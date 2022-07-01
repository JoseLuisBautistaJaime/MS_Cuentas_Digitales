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
  URL_API_COMUNICACIONES,
  CODE_BAD_REQUEST,
  CODE_INTERNAL_SERVER_ERROR
} from '../commons/constants'
import { HttpClientService } from '../commons/http-client'
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

const internalEnviarMensaje = async (req, res, bodyComunicaciones) => {
  LOG.info('SERV: Iniciando internalEnviarMensaje')
  try {
    const header = await createHeaderComunicaciones(req)
    LOG.debugJSON('internalEnviarMensaje-header', header)
    LOG.debugJSON('internalEnviarMensaje-body', body)
    const HttpComunicaciones = {
      url: `${URL_API_COMUNICACIONES}/solicitud/mensaje`,
      method: HttpMethod.POST,
      headers: header,
      body: bodyComunicaciones
    }

    const bodyResp = await HttpClientService.sendRequest(HttpComunicaciones)
    LOG.debugJSON('internalEnviarMensaje-bodyResp', bodyResp)
    LOG.info('SERV: Terminando internalEnviarEmail')
    return bodyResp
  } catch (error) {
    LOG.error(error)
    return handlerError(res, error)
  }
}

/**
 * enviarCodigoSMS: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Teléfono al cual se enviá el SMS.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoSMS = async (req, res, destinatario, codigoOtp) => {
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
  const bodyResp = await internalEnviarMensaje(req, res, bodyComunicaciones)
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
const enviarCodigoEMAIL = async (req, res, destinatario, codigoOtp) => {
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
  const bodyResp = await internalEnviarMensaje(req, res, bodyComunicaciones)
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
const enviarActivacionEMAIL = async (req, res, cliente) => {
  LOG.info('SERV: Iniciando enviarActivacionEMAIL')
  const clienteFullName = `${cliente.nombreCliente} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`
  const { correoCliente } = cliente
  const bodyComunicaciones = {
    destinatario: {
      email: correoCliente
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
  const bodyResp = await internalEnviarMensaje(req, res, bodyComunicaciones)
  LOG.info('SERV: Terminando enviarActivacionEMAIL', bodyResp)
  return bodyResp
}

/**
 * sendOtpToComunicaciones: Envia el codigoOtp por el medio apropiado, validando el codigoOtp y el modoEnvio
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param {*} res Response del proceso padre.
 * @param modoEnvio Modo de envio del codigo email o sms
 * @param cliente Objeto cliente, obtenido directamente del modelo cliente_model
 * @param codigoOtp Codigo OTP a enviar
 * @returns Retorna true, si la ejecución fue exitosa. O desencadena excepción, en caso de existir alguna.
 */
async function sendOtpToComunicaciones(req, res, modoEnvio, cliente, codigoOtp) {
  LOG.info('SERV: Iniciando sendOtpToComunicaciones')
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)

  // Validación del Token Otp..
  if (codigoOtp === null || codigoOtp === '') {
    const controlExcepcion = {
      code: CODE_BAD_REQUEST,
      message: 'BadRequest - Token no generado correctamente.'
    }
    return res.status(400).send({ controlExcepcion })
  }

  // Modo de envio de sms..
  if (modoEnvio !== 'sms' && modoEnvio !== 'email') {
    const controlExcepcion = {
      code: CODE_BAD_REQUEST,
      message: `BadRequest - El parametro en body 'modoEnvio' debe ser 'sms' o 'email'`
    }
    return res.status(400).send({ controlExcepcion })
  }

  let statusEnvio
  // envio de otp por email o sms
  if (modoEnvio === 'email')
    statusEnvio = await enviarCodigoEMAIL(req, res, correoCliente, codigoOtp)
  if (modoEnvio === 'sms')
    statusEnvio = await enviarCodigoSMS(req, res, celularCliente, codigoOtp)

  // verificar si existe alguna excepcion
  if (statusEnvio.statusRequest !== 201) {
    LOG.debugJSON('sendOtpToComunicaciones-statusEnvio', statusEnvio)
    const controlExcepcion = {
      code: CODE_INTERNAL_SERVER_ERROR,
      message: `Internal Server Error - ${statusEnvio.descripcionError}`
    }
    return res.status(500).send({ controlExcepcion })
  }
  LOG.info('SERV: Terminando sendOtpToComunicaciones')
  return true
}

export const ComunicacionesService = {
  enviarCodigoSMS,
  enviarCodigoEMAIL,
  enviarActivacionEMAIL,
  sendOtpToComunicaciones
}

export default ComunicacionesService
