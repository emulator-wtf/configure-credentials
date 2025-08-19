import { HttpClient } from '@actions/http-client';
import { ErrorResponse, OidcAuthenticateRequest, OidcAuthenticateResponse } from './types';

export async function authenticateOidc(request: OidcAuthenticateRequest): Promise<OidcAuthenticateResponse> {
  const client = new HttpClient()

  const response = await client.postJson<OidcAuthenticateResponse | ErrorResponse>('https://api.emulator.wtf/auth/oidc', request)

  if (response.statusCode >= 200 && response.statusCode < 300) {
    if (response.result == null) {
      throw new Error('Unexpected response: null result');
    }
    if (isErrorResponse(response.result)) {
      throw new Error(`SHOULD NOT HAPPEN! API Error for a 2xx response: ${response.result.message}`);
    }
    return response.result;
  }

  if (isErrorResponse(response.result)) {
    throw new Error(`API Error: ${response.result.message}`);
  }
  throw Error(`API call to emulator.wtf failed with status code ${response.statusCode}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isErrorResponse(body: any): body is ErrorResponse {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return body.type !== undefined && body.message !== undefined
}
