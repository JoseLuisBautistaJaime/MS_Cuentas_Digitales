import {
  HEADER_AUTHORIZATION,
  HEADER_ID_CONSUMIDOR,
  HEADER_ID_DESTINO,
  HEADER_OAUTH,
  HEADER_USUARIO,
  EMAIL_REMITENTE,
  TEMPLATE_API_COMUNICACIONES_EMAIL,
  TEMPLATE_API_COMUNICACIONES_EMAIL_ACTIVACION,
  TEMPLATE_API_COMUNICACIONES_SMS,
  URL_API_COMUNICACIONES
} from '../commons/constants'
import { HttpClientService } from '../commons/http-client'
import LOG from '../commons/LOG'
import { Util } from '../commons/utils'

const { HttpMethod } = HttpClientService

/**
 * createHeaderComunicaciones: Genera los Headers para la petición al servicio de comunicaciones.
 * @param req Headers: para crear el header de consulta.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const createHeaderComunicaciones = async req => {
  LOG.info('SERV: Iniciando createHeaderComunicaciones')
  // await CommonValidator.validateHeaderOAG(req)
  await Util.validateHeaderOAG(req)
  const idConsumidor = req.header(HEADER_ID_CONSUMIDOR)
  const idDestino = req.header(HEADER_ID_DESTINO)
  const usuario = req.header(HEADER_USUARIO)
  const oauth = req.header(HEADER_OAUTH)
  const authorization = req.header(HEADER_AUTHORIZATION)
  // Regenerate Header
  return {
    authorization,
    idConsumidor,
    idDestino,
    'oauth.bearer': oauth,
    usuario
  }
}

const internalEnviarMensaje = async (req, bodyComunicaciones) => {
  LOG.info('SERV: Iniciando internalEnviarMensaje')
  try {
    const header = await createHeaderComunicaciones(req)
    LOG.debugJSON('internalEnviarMensaje-header', header)
    LOG.debugJSON('internalEnviarMensaje-body', bodyComunicaciones)
    const HttpComunicaciones = {
      url: `${URL_API_COMUNICACIONES}/solicitud/mensaje`,
      method: HttpMethod.POST,
      headers: header,
      body: bodyComunicaciones
    }
    LOG.debugJSON('internalEnviarMensaje-HttpComunicaciones', HttpComunicaciones)
    const bodyResp = await HttpClientService.sendRequest(HttpComunicaciones)
    LOG.debugJSON('internalEnviarMensaje-bodyResp', bodyResp)
    LOG.info('SERV: Terminando internalEnviarEmail')
    return bodyResp
  } catch (error) {
    LOG.error(error)
    // return handlerError(res, error)
  }
}

/**
 * enviarCodigoSMS: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Teléfono al cual se enviá el SMS.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoSMS = async (req, destinatario, codigoOtp) => {
  LOG.info('SERV: Iniciando enviarCodigoSMS')

  const bodyComunicaciones = {
    destinatario: {
      telefonos: [destinatario]
    },
    tipoMensaje: 'SMS',
    template: {
      id: TEMPLATE_API_COMUNICACIONES_SMS,
      metadata: {
        codigo: codigoOtp
      }
    }
  }
  const bodyResp = await internalEnviarMensaje(req, bodyComunicaciones)
  LOG.info('SERV: Terminando enviarCodigoSMS', bodyResp)
  return bodyResp
}

/**
 * enviarCodigoEMAIL: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Email al que se envia el correo.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoEMAIL = async (req, destinatario, codigoOtp) => {
  LOG.info('SERV: Iniciando enviarCodigoEMAIL')
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
        codigo: codigoOtp
      }
    },
    datosEmail: {
      asunto: 'Código de Verificación'
    }
  }

  const bodyResp = await internalEnviarMensaje(req, bodyComunicaciones)
  LOG.info('SERV: Terminado enviarCodigoEMAIL')
  return bodyResp
}

/**
 * enviarCodigoEMAIL: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Email al que se envia el correo.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarActivacionEMAIL = async (req, cliente) => {
  LOG.info('SERV: Iniciando enviarActivacionEMAIL')
  const destinatario = cliente.correoCliente
  const clienteFullName = `${cliente.nombreCliente} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`

  const bodyComunicaciones = {
    destinatario: {
      email: destinatario
    },
    remitente: {
      email: EMAIL_REMITENTE
    },
    tipoMensaje: 'EMAIL',
    template: {
      id: TEMPLATE_API_COMUNICACIONES_EMAIL_ACTIVACION,
      metadata: {
        cliente: clienteFullName,
        linkActivacion: 'http://www.montepiedad.com.mx/'
      }
    },
    datosEmail: {
      asunto: 'Activación de Cuente'
    }
  }

  const bodyResp = await internalEnviarMensaje(req, bodyComunicaciones)
  LOG.info('SERV: Terminando enviarActivacionEMAIL', bodyResp)
  return bodyResp
}

export const ComunicacionesService = {
  enviarCodigoSMS,
  enviarCodigoEMAIL,
  enviarActivacionEMAIL
}

export default ComunicacionesService
