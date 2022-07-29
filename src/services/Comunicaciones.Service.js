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
import { log } from '../commons/log'
import { InternalServerError } from '../commons/exceptions'

const { HttpMethod } = HttpClientService

/**
 * createHeaderComunicaciones: Genera los Headers para la petición al servicio de comunicaciones.
 * @param req Headers: para crear el header de consulta.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const createHeaderComunicaciones = async req => {
  log.info('SERV: Iniciando createHeaderComunicaciones')
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
  log.info('SERV: Iniciando internalEnviarMensaje')
  try {
    const header = await createHeaderComunicaciones(req)
    log.debugJSON('internalEnviarMensaje-header', header)
    log.debugJSON('internalEnviarMensaje-body', bodyComunicaciones)
    const HttpComunicaciones = {
      url: `${URL_API_COMUNICACIONES}/solicitud/mensaje`,
      method: HttpMethod.POST,
      headers: header,
      body: bodyComunicaciones
    }
    log.debugJSON('internalEnviarMensaje-HttpComunicaciones', HttpComunicaciones)
    const bodyResp = await HttpClientService.sendRequest(HttpComunicaciones)
    if (bodyResp.statusRequest !== 201) {
      throw new InternalServerError({ message: JSON.stringify(bodyResp), exceptionCode: 50002 })
    }
    log.debugJSON('internalEnviarMensaje-bodyResp', bodyResp)
    log.info('SERV: Terminando internalEnviarEmail')
    return bodyResp
  } catch (err) {
    log.error(err)
    throw new InternalServerError({ message: JSON.stringify(err), exceptionCode: 50001 })
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
  log.info('SERV: Iniciando enviarCodigoSMS')

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
  log.info('SERV: Terminando enviarCodigoSMS', bodyResp)
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
  log.info('SERV: Iniciando enviarCodigoEMAIL')
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
  log.info(`**** TAG bodyResp ${bodyResp}`)
  log.info('SERV: Terminado enviarCodigoEMAIL')
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
  log.info('SERV: Iniciando enviarActivacionEMAIL')
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
  log.info('SERV: Terminando enviarActivacionEMAIL', bodyResp)
  return bodyResp
}

export const ComunicacionesService = {
  enviarCodigoSMS,
  enviarCodigoEMAIL,
  enviarActivacionEMAIL
}

export default ComunicacionesService
