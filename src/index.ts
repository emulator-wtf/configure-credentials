import { getInput, getIDToken, exportVariable } from '@actions/core';
import { authenticateOidc } from './api';

async function run() {
  const oidcConfigurationUuid = getInput('configuration-id', { required: true });
  const oidcToken = await getIDToken('api://emulator.wtf')

  // make api request to the OIDC configuration endpoint
  const response = await authenticateOidc({ oidcConfigurationUuid, oidcToken })

  // export EW_API_TOKEN to environment
  exportVariable('EW_API_TOKEN', response.apiToken);
}

// noinspection JSIgnoredPromiseFromCall
run()
