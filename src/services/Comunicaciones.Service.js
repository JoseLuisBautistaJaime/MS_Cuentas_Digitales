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

async function sendOtpToComunicaciones(req, res, modoEnvio, cliente, tokenOtp) {
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)

  // validacion de excepciones..
  if (tokenOtp === null || tokenOtp === '') {
    // const controlExcepcion = {
    //   codigo: CODE_INTERNAL_SERVER_ERROR,
    //   mensaje: MESSAGE_ERROR
    // }
    // const response = {
    //   controlExcepcion
    // }
    return res.status(500).send(res)
  }
  // proceso: Validacion del campo tipo, para el envio de SMS.
  if (modoEnvio !== 'sms' && modoEnvio !== 'email') {
    // const controlExcepcion = {
    //   codigo: CODE_INTERNAL_SERVER_ERROR,
    //   mensaje: `${MESSAGE_ERROR} (la variable 'modeSend' debe tener un valor de 'EMAIL' o 'SMS')`
    // }
    // const response = {
    //   controlExcepcion
    // }
    return res.status(500).send(res)
  }

  // envio de otp por email o sms
  if (modoEnvio === 'email') {
    const statusEmail = await enviarCodigoEMAIL(
      req,
      res,
      correoCliente,
      tokenOtp
    )
    LOG.debugJSON('statusEmail', statusEmail)
    if (statusEmail.statusRequest !== 201) {
      return res.status(500).send(statusEmail)
    }
  }
  if (modoEnvio === 'sms') {
    const statusSMS = await enviarCodigoSMS(req, res, celularCliente, tokenOtp)
    LOG.debugJSON('statusSMS', statusSMS)
    if (statusSMS.statusRequest !== 201) {
      return res.status(500).send(statusSMS)
    }
  }
  return true
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
  enviarCodigoSMS,
  enviarCodigoEMAIL,
  sendOtpToComunicaciones
}

export default ComunicacionesService
