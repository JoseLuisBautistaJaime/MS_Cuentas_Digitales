import fetch from 'node-fetch'
import https from 'https'
import { log } from './cd-log'

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
  log.debug('SERVICE: Starting sendRequest method')

  log.debug(`url - ${url}`)
  log.debug(`method - ${method}`)
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

    log.debug(`valido: ${ok}`)
    log.debug(`status: ${status}`)
    log.debug('SERVICE: Ending sendRequest method')
    responseBody.statusRequest = status
    return responseBody
  } catch (err) {
    log.error(`Error: ${JSON.stringify(err)}`)
    // if (err instanceof CommonException) throw err
    // AGREGAR CONTROL DE EXCEPCION EN ESTE PUNTO...
    // throw new InternalServerException(createMessageError('NMP.CUENTASDIGITALES-500', { text: err.message }))
  }
}

export const HttpClientService = {
  sendRequest,
  HttpMethod
}

export default null
