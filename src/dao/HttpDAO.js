import https from 'https'
import fetch from 'node-fetch'

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

class HttpDAO {
  constructor() {
    this.timeout = 10000
    this.headersJson = { 'Content-Type': 'application/json' }
  }

  /**
   * Método que permite realizar una petición Http medieante el método get.
   * @param uri Url de la petición.
   * @param headers Información del Header.
   */
  async get(uri, headers = {}) {
    const { timeout } = this
    const options = {
      method: 'GET',
      headers,
      timeout
    }

    if (uri.includes('https')) {
      options.agent = httpsAgent
    }

    const res = await fetch(uri, options)

    return res
  }

  /**
   * Método que permite realizar una petición Http medieante el método post.
   * @param uri Url de la petición.
   * @param body Infomraicón del Body.
   * @param headers Información del Header.
   */
  async post(uri, body = {}, headers = {}) {
    const { timeout } = this
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...this.headersJson,
        ...headers
      },
      timeout
    }

    if (uri.includes('https')) {
      options.agent = httpsAgent
    }

    const res = await fetch(uri, options)

    return res
  }

  /**
   * Método que permite realizar una petición Http medieante el método put.
   * @param uri Url de la petición.
   * @param body Infomraicón del Body.
   * @param headers Información del Header.
   */
  async put(uri, body = {}, headers = {}) {
    const { timeout } = this
    const options = {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        ...this.headersJson,
        ...headers
      },
      timeout
    }

    if (uri.includes('https')) {
      options.agent = httpsAgent
    }

    const res = await fetch(uri, options)

    return res
  }

  /**
   * Método que permite realizar una petición Http medieante el método patch.
   * @param uri Url de la petición.
   * @param body Infomraicón del Body.
   * @param headers Información del Header.
   */
  async patch(uri, body = {}, headers = {}) {
    const { timeout } = this
    const options = {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        ...this.headersJson,
        ...headers
      },
      timeout
    }

    if (uri.includes('https')) {
      options.agent = httpsAgent
    }

    const res = await fetch(uri, options)

    return res
  }

  /**
   * Método que permite realizar una petición Http medieante el método delete.
   * @param uri Url de la petición.
   * @param headers Información del Header.
   */
  async delete(uri, headers = {}) {
    const { timeout } = this
    const options = {
      method: 'DELETE',
      headers,
      timeout
    }

    if (uri.includes('https')) {
      options.agent = httpsAgent
    }

    const res = await fetch(uri, options)

    return res
  }
}

const obj = new HttpDAO()

export { obj as HttpDAO }
