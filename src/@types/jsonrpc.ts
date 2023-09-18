import { IJsonRpcType } from 'jsonrpc-lite/jsonrpc'
export interface PaginatedResult<T> {
  length?: number
  records: T[]
}

export interface JsonRpcSuccessResponse<T> extends IJsonRpcType {
  id: number;
  result: T | PaginatedResult<T>;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data: {
    debug: string;
    name: string;
    message: string;
    arguments: string[];
    context: Record<string, unknown>;
  };
}

export interface JsonRpcErrorResponse extends IJsonRpcType {
  id: number;
  error: JsonRpcError;
}
/**
 * Normalizes the response from a JSON-RPC server.
 *
 * @param data The JSON-RPC response from the server.
 * @param singleRecord If set to true, returns a single record instead of a paginated result.
 * @returns The normalized response, or a paginated result if singleRecord is false.
 */
export function normalizeResponse<T> (
  data: JsonRpcSuccessResponse<T> | JsonRpcErrorResponse, singleRecord?:boolean
): T | PaginatedResult<T> {
  // Odoo REST API uses JSON RPC 2.0, so no standard HTTP status codes (boo!)
  // So we are getting the error from the success response and re-throwing it
  // as an actual error

  // console.log(data)
  if ('error' in data) {
    throw new Error(data.error.data.message)
  } else if (singleRecord && Array.isArray(data.result)) {
    return data.result[0]
  } else {
    return data.result
  }
}
