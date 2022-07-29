import fetch from 'node-fetch'
import https from 'https'
import LOG from './LOG'
// import { InternalServerException, CommonException, createMessageError } from './exceptions'

const agent = new https.Agent({ rejectUnauthorized: false })

const HttpMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}

const parseResponse = res => {
  return res.json().then(responseBody => ({
    responseBody,
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers.raw()
  }))
}

const sendRequest = async ({ url, method, body = null, headers, isHttps = true }) => {
  LOG.debug('SERVICE: Starting sendRequest method')

  LOG.debug(`url - ${url}`)
  LOG.debug(`method - ${method}`)
  const options = {
    method,
    headers: {
      ...{
        'Content-Type': 'application/json'
      },
      ...headers
    }
  }

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') options.body = JSON.stringify(body || {})

  if (isHttps) options.agent = agent

  try {
    const { responseBody, ok, status } = await fetch(url, options).then(parseResponse)

    LOG.debugJSON('valido', ok)
    LOG.debugJSON('status', status)
    LOG.debug('SERVICE: Ending sendRequest method')
    responseBody.statusRequest = status
    return responseBody
  } catch (err) {
    LOG.error(`Error: ${JSON.stringify(err)}`)
    // if (err instanceof CommonException) throw err

    // throw new InternalServerException(createMessageError('NMP.CUENTASDIGITALES-500', { text: err.message }))
  }
}

export const HttpClientService = {
  sendRequest,
  HttpMethod
}

export default null
