import {
  EMAIL_REMITENTE,
  HEADER_AUTHORIZATION,
  HEADER_ID_CONSUMIDOR,
  HEADER_ID_DESTINO,
  HEADER_OAUTH,
  HEADER_USUARIO,
  TEMPLATE_API_COMUNICACIONES_EMAIL,
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
  LOG.debug('SERV: Iniciando sendOtpToComunicaciones')
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

  // envio de otp por email o sms
  if (modoEnvio === 'email') {
    const statusEmail = await enviarCodigoEMAIL(
      req,
      res,
      correoCliente,
     

          
      codigoOtp
    
    
    
    )
    if (statusEmail.statusRequest !== 201) {
      LOG.debugJSON('email', statusEmail)
      const controlExcepcion = {
        code: CODE_INTERNAL_SERVER_ERROR,
        message: `Internal Server Error - ${statusEmail.descripcionError}`
      }
      return res.status(500).send({ controlExcepcion })
    }
  }

  // envio de otp por sms
  if (modoEnvio === 'sms') {
    const statusSMS = await enviarCodigoSMS(req, res, celularCliente, codigoOtp)
    if (statusSMS.statusRequest !== 201) {
      const controlExcepcion = {
        code: CODE_INTERNAL_SERVER_ERROR,
        message: `Internal Server Error - ${statusSMS.descripcionError}`
      }
      return res.status(500).send({ controlExcepcion })
    }
  }
  LOG.debug('SERV: Terminando sendOtpToComunicaciones')
  return true
}

/**
 * enviarCodigoSMS: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Teléfono al cual se enviá el SMS.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoSMS = async (req, res, destinatario, codigoOtp) => {
  LOG.debug('SERV: Iniciando enviarCodigoSMS')
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
          codigo: codigoOtp
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
const enviarCodigoEMAIL = async (req, res, destinatario, codigoOtp) => {
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
          codigo: codigoOtp
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
  enviarCodigoSMS,
  enviarCodigoEMAIL,
  sendOtpToComunicaciones
}

export default ComunicacionesService
