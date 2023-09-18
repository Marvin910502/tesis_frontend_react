import {
  CreateOptions,

  QueryOptions,
  create,
  update,
  UpdateOptions,
  RemoveOptions,
  remove, read, CallOptions, call, searchReadOdoo
} from 'src/api/queries'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { QueryClient } from 'react-query/core'
import { PaginatedResult } from 'src/@types/jsonrpc'

/**
 * A utility function for invalidating one or more queries.
 * @param invalidateQuery - An array of strings representing the names of queries to invalidate, or a boolean value indicating whether all queries should be invalidated.
 * @param queryClient - The query client instance.
 */
export function cleanQuery (invalidateQuery:string[]|boolean, queryClient:QueryClient) {
  if (typeof invalidateQuery === 'boolean') {
    return
  }
  invalidateQuery.forEach(value => {
    queryClient.invalidateQueries(value)
  })
}
/**
 * A hook for searching and reading Odoo data.
 * @param data - An object containing the options for the search and read operation.
 * @param MODEL - A string representing the name of the Odoo model to search and read from used for query cache and invalidate query.
 * @returns The result of the search and read operation.
 */
export function useSearchOdoo<T> (data: QueryOptions, MODEL: string) {
  return useQuery<PaginatedResult<T>>(
    [MODEL, data],
    {
      queryFn: () => {
        return searchReadOdoo<T>(data).then((response) => {
          return response
        })
      }
    }
  )
}

/**
 * A hook for reading Odoo data.
 * @param data - An object containing the options for the read operation.
 * @param MODEL - A string representing the name of the Odoo model to read from used for query cache and invalidate query.
 * @returns The result of the read operation.
 */
export function useReadOdoo<T> (data:QueryOptions, MODEL: string) {
  return useQuery<T>(
    [MODEL, data],
    {
      queryFn: () => {
        return read<T>(data).then((response) => {
          return response
        })
      }
    }
  )
}
/**
 * A hook for creating Odoo data.
 * @param invalidateQuery - An optional array of strings representing the names of queries to invalidate, or a boolean value indicating whether all queries should be invalidated.
 * @returns A tuple containing the `create` function and an object with a `onSuccess` property representing the create operation's success callback.
 */
export function useCreateOdoo (invalidateQuery?:string[]|boolean) {
  const queryClient = useQueryClient()
  return useMutation(
    (data:CreateOptions) => create(data),
    {
      onSuccess: () => cleanQuery(invalidateQuery ?? false, queryClient)

    }

  )
}
/**
 * A hook for updating Odoo data.
 * @param invlidateQuery - An optional array of strings representing the names of queries to invalidate.
 * @returns A tuple containing the `update` function and an object with a `onSuccess` property representing the update's success callback.
 */
export function useUpdateOdoo (invlidateQuery?:string[]) {
  const queryClient = useQueryClient()
  return useMutation(
    (data:UpdateOptions) => update(data),
    {
      onSuccess: () => cleanQuery(invlidateQuery ?? false, queryClient)
    }
  )
}

/**
 * A function that uses the `useDeleteOdoo` hook to delete data from an Odoo database.
 *
 * @param {string[]} [invlidateQuery] - An optional array of query names to invalidate.
 * @returns {[RemoveOptions, (data: RemoveOptions) => void]} - A tuple containing the remove options and the `useMutation` hook.
 */
export function useDeleteOdoo (invlidateQuery?:string[]) {
  const queryClient = useQueryClient()
  return useMutation(
    (data:RemoveOptions) => remove(data),
    {
      onSuccess: () => cleanQuery(invlidateQuery ?? false, queryClient)
    }
  )
}

export function useExecuteOdoo (invlidateQuery?:string[]) {
  const queryClient = useQueryClient()
  return useMutation(
    (data:CallOptions) => call(data),
    {
      onSuccess: () => cleanQuery(invlidateQuery ?? false, queryClient)
    }
  )
}
export function useCallOdoo<T> (data: CallOptions, MODEL: string) {
  return useQuery <T>(
    [MODEL, data],
    {
      queryFn: () => {
        return call<T>(data).then((response) => {
          return response
        })
      }
    }
  )
}
