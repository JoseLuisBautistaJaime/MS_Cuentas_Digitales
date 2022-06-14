import {
  EMAIL_REMITENTE,
  HEADER_AUTHORIZATION,
  HEADER_ID_CONSUMIDOR,
  HEADER_ID_DESTINO,
  HEADER_OAUTH,
  HEADER_USUARIO,
  TEMPLATE_API_COMUNICACIONES_EMAIL,
  TEMPLATE_API_COMUNICACIONES_SMS,
  URL_API_COMUNICACIONES
} from '../commons/constants'
import { HttpClientService } from '../commons/http-client.service'
import handlerError from '../validator/handler-error'
import LOG from '../commons/LOG'
import { Util } from '../commons/utils'

const { HttpMethod } = HttpClientService

/**
 * createHeaderComunicaciones: Genera los Headers para la petición al servicio de comunicaciones.
 * @param req Headers: para crear el header de consulta.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const createHeaderComunicaciones = async req => {
  await Util.validateHeaderOAG(req)
  const idConsumidor = req.header(HEADER_ID_CONSUMIDOR)
  const idDestino = req.header(HEADER_ID_DESTINO)
  const usuario = req.header(HEADER_USUARIO)
  const oauth = req.header(HEADER_OAUTH)
  const authorization = req.header(HEADER_AUTHORIZATION)
  const header = {
    authorization,
    idConsumidor,
    idDestino,
    'oauth.bearer': oauth,
    usuario
  }
  return header
}

/**
 * enviarCodigoSMS: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Teléfono al cual se enviá el SMS.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoSMS = async (req, res, destinatario, codigo) => {
  LOG.debug('SERV: Ejecutando enviarCodigoSMS')
  try {
    const header = await createHeaderComunicaciones(req)

    const bodyComunicaciones = {
      destinatario: {
        telefonos: [destinatario]
      },
      tipoMensaje: 'SMS',
      template: {
        id: TEMPLATE_API_COMUNICACIONES_SMS,
        metadata: {
          codigo
        }
      }
    }

    const HttpComunicaciones = {
      url: `${URL_API_COMUNICACIONES}/solicitud/mensaje`,
      method: HttpMethod.POST,
      headers: header,
      body: bodyComunicaciones
    }

    const bodyResp = await HttpClientService.sendRequest(HttpComunicaciones)

    LOG.debugJSON('SERV: Terminando enviarCodigoSMS', bodyResp)
    return bodyResp
  } catch (error) {
    LOG.error(error)
    return handlerError(res, error)
  }
}

/**
 * enviarCodigoEMAIL: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Email al que se envia el correo.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoEMAIL = async (req, res, destinatario, codigo) => {
  LOG.debug('SERV: Ejecutando enviarCodigoEMAIL')
  try {
    const header = await createHeaderComunicaciones(req)
    const bodyComunicaciones = {
      destinatario: {
        email: destinatario
      },
      remitente: {
        email: EMAIL_REMITENTE
      },
      tipoMensaje: 'EMAIL',
      template: {
        id: TEMPLATE_API_COMUNICACIONES_EMAIL,
        metadata: {
          codigo
        }
      },
      datosEmail: {
        asunto: 'Código de Verificación'
      }
    }

    const HttpComunicaciones = {
      url: `${URL_API_COMUNICACIONES}/solicitud/mensaje`,
      method: HttpMethod.POST,
      headers: header,
      body: bodyComunicaciones
    }

    const bodyResp = await HttpClientService.sendRequest(HttpComunicaciones)

    LOG.debugJSON('SERV: Terminando enviarCodigoEMAIL', bodyResp)
    return bodyResp
  } catch (error) {
    LOG.error(error)
    return handlerError(res, error)
  }
}

export const ComunicacionesService = {
  enviarCodigoEMAIL,
  enviarCodigoSMS
}

export default ComunicacionesService
