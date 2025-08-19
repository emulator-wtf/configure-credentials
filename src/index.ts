import { getInput, getIDToken, exportVariable } from '@actions/core'
import { authenticateOidc } from './api'

async function run() {
  const oidcConfigurationUuid = getInput('oidc-configuration-id', { required: true })

  try {
    const oidcToken = await getIDToken('api://emulator.wtf')

    // make api request to the OIDC configuration endpoint
    const response = await authenticateOidc({ oidcConfigurationUuid, oidcToken })

    // export EW_API_TOKEN to environment
    exportVariable('EW_API_TOKEN', response.apiToken)
  } catch (error) {
    // check for "Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable" error
    if (error instanceof Error && error.message.includes('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable')) {
      throw new Error("This action requires the 'id-token' permission to be set in the workflow. Please add the following to your workflow file:\n\n" +
        "permissions:\n  id-token: write\n")
    } else {
      throw error
    }
  }
}

// noinspection JSIgnoredPromiseFromCall
run()
