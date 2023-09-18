import ky from 'ky'
import { RequestObject, request as JsonRpcRequest } from 'jsonrpc-lite/jsonrpc'
import {
	normalizeResponse,
	JsonRpcSuccessResponse,
	PaginatedResult,
} from 'src/@types/jsonrpc'
import { User } from 'src/@types/user'

export type SimpleFilter<T = string> =
  | [key: T, value: string | number | null]
  | '|'
  | '&'
export type ComplexFilter<T = string> = [
  key: T,
  operator: '=' | '>' | '<' | '>=' | '<=' | '!=' | 'in' | 'not in' | 'ilike',
  value: string | number | boolean | string[] | number[] | boolean[]
]

export type Filter<T = string> = SimpleFilter<T> | ComplexFilter<T>

export interface QueryOptions {
  model: string
  query?: string[]
  filter?: Filter[]
  limit?: number
  offset?: number
  order?: string
  id?: number
  context?: Record<string, unknown>
  sort?: string
}
/**
 * Queries and retrieves records from an Odoo model.
 *
 * @param options - The options for the query.
 * @param options.model - The name of the Odoo model to query.
 * @param options.query - The list of fields to return to the results.
 * @param options.filter - The filter to apply to the query.
 * @param options.limit - The maximum number of records to return.
 * @returns A promise that resolves to a paginated result of the query.
 */
export function searchReadOdoo<T>({
	model,
	query,
	filter,
	limit,
	sort,
}: QueryOptions): Promise<PaginatedResult<T>> {
	const payload: RequestObject = JsonRpcRequest(3, 'call', {
		model,
		fields: query,
		limit,
		domain: filter,
		sort,
	})
	return ky
		.post('/web/dataset/search_read', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<T>>()
		.then(normalizeResponse) as Promise<PaginatedResult<T>>
}

/**
 * Read a model instance from the server.
 *
 * @param model The model name to read from.
 * @param id The ID of the instance to read.
 * @param The list of fields to return to the result.
 * @returns A promise that resolves to the instance data.
 */
export function read<T>({ model, id, query }: QueryOptions): Promise<T> {
	const payload: RequestObject = JsonRpcRequest(4, 'call', {
		model,
		method: 'read',
		args: [id, query],
		kwargs: {
			context: {},
		},
	})

	return ky
		.post('/web/dataset/call_kw', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<T>>()
		.then((response) => normalizeResponse(response, true)) as Promise<T>
}
export interface CreateOptions {
  model: string
  data: Record<string, unknown>
  context?: Record<string, unknown>
}
/**
 * Creates a new record in the specified Odoo model.
 *
 * @param options - The options for creating the record.
 * @param options.model - The name of the Odoo model to create the record in.
 * @param options.data - The data for the new record.
 * @param options.context - The context for the operation.
 * @returns A promise that resolves to the ID of the newly created record.
 */
export function create({ model, data, context }: CreateOptions) {
	const payload: RequestObject = JsonRpcRequest(5, 'call_kw', {
		model,
		method: 'create',
		args: [data],
		kwargs: {
			context,
		},
	})
	return ky
		.post('/web/dataset/call_kw', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<number>>()
		.then(normalizeResponse) as Promise<number>
}
export interface UpdateOptions extends CreateOptions {
  id?: number
  filter?: Filter[]
}

/**
 * Updates an existing record in the specified Odoo model.
 *
 * @param options - The options for updating the record.
 * @param options.model - The name of the Odoo model to update the record in.
 * @param options.data - The updated data for the record.
 * @param options.id - The ID of the record to update.
 * @param options.context - The context for the operation.
 * @returns A promise that resolves to `true` if the record was updated successfully, or `false` if it failed.
 */
export function update({
	model,
	data,
	id,
	context,
}: UpdateOptions): Promise<boolean> {
	const payload: RequestObject = JsonRpcRequest(6, 'call_kw', {
		model,
		method: 'write',
		args: [[id], data],
		kwargs: {
			context,
		},
	})
	return ky
		.put('/web/dataset/call_kw', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<boolean>>()
		.then(normalizeResponse) as Promise<boolean>
}

export interface RemoveOptions {
  id?: number
  filter?: Filter[]
  model: string
}

/**
 * Removes a model instance from the server.
 *
 * @param model The model name to remove the instance from.
 * @param id The ID of the instance to remove.
 * @returns A promise that resolves to a boolean indicating if the operation was successful.
 */
export function remove({ model, id }: RemoveOptions): Promise<boolean> {
	const payload: RequestObject = JsonRpcRequest(7, 'call_kw', {
		model,
		method: 'unlink',
		args: [[id]],
		kwargs: {
			context: {},
		},
	})
	return ky
		.post('/web/dataset/call_kw', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<boolean>>()
		.then(normalizeResponse) as Promise<boolean>
}

export interface CallOptions {
  method: string
  model: string
  args?: unknown[]
  kwargs?: Record<string, unknown>
  context?: Record<string, unknown>
}

/**
 * Calls a model method on the server.
 *
 * @param model The model name to call the method on.
 * @param method The name of the method to call.
 * @param args A list of positional arguments to pass to the method.
 * @param kwargs A map of keyword arguments to pass to the method.
 * @param context The context to pass to the method.
 * @returns A promise that resolves to the result of the method call.
 */
export function call<T>({
	model,
	method,
	args,
	kwargs,
	context,
}: CallOptions): Promise<T> {
	const payload: RequestObject = JsonRpcRequest(8, 'call_kw', {
		model,
		method,
		args,
		kwargs,
		context,
	})
	return ky
		.post('/web/dataset/call_kw', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<T>>()
		.then(normalizeResponse) as Promise<T>
}

interface SignInOptions {
  email: string
  password: string
}
/**
 * Login in to Odoo using the provided sign-in options.
 *
 * @param data - The sign-in options, including the user's email and password.
 * @returns A promise that resolves to the authenticated user's information.
 */
export function loginOdoo(data: SignInOptions): Promise<User> {
	const payload: RequestObject = JsonRpcRequest(1, 'call', {
		login: data.email,
		password: data.password,
		db: import.meta.env.VITE_APP_DB_NAME,
	})
	return ky
		.post('/web/session/authenticate', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<User>>()
		.then((response) => normalizeResponse(response)) as Promise<User>
}

/**
 * Retrieves the authenticated user's information from Odoo.
 *
 * @returns A promise that resolves to the authenticated user's information.
 */

export function meOdoo(): Promise<User> {
	// const accessToken = window.localStorage.getItem('accessToken')
	const payload: RequestObject = JsonRpcRequest(2, 'call', {})
	return ky
		.post('/web/session/get_session_info', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<User>>()
		.then(normalizeResponse) as Promise<User>
}

export function logoutOdoo(): Promise<boolean> {
	const payload: RequestObject = JsonRpcRequest(9, 'call', {})
	return ky
		.post('/web/session/destroy', {
			json: payload,
		})
		.json<JsonRpcSuccessResponse<boolean>>()
		.then(normalizeResponse) as Promise<boolean>
}
