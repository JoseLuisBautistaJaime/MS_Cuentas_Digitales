import md5 from 'md5'
import { totp } from 'otplib'
import { toInteger } from 'lodash'
import { ComunicacionesService } from './Comunicaciones.Service'
import { EstadoActivacionService } from './EstadoActivacion.Service'
import { EventosEstadoActivacionService } from './EventosEstadoActivacion.Service'
import { log } from '../commons/log'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { EventosEstadoActivacionDAO } from '../dao/EventosEstadoActivacion.DAO'
import {
  // Configuracion de OTP
  OTP_DURACION_SEGUNDOS,
  OTP_SECRETO,
  OTP_DIGITOS,
  ACTIVACION_BLOQUEO_REINTENTOS,
  // Estados de Activacion
  ESTADO_ACTIVACION_OTPGENERADO,
  ESTADO_ACTIVACION_ACTIVADO,
  ESTADO_ACTIVACION_BLOQUEADO
} from '../constants/constants'
import { NotFoundCliente, CuentaBloqueadaException, VerificarOtpError } from '../commons/exceptions'

// Cambiar a variables de ambiente
const OTP_OPTIONS = {
  digits: toInteger(OTP_DIGITOS),
  algorithm: 'sha1',
  step: toInteger(OTP_DURACION_SEGUNDOS),
  window: 2
}
function generateHashSecret(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRETO}.${idCliente}.${idDevice}`
  log.debug(`TOTP-fullSecret ${fullSecret}`)
  return String(md5(fullSecret)).toUpperCase()
}

/**
 * SERV: para el envío del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const enviarOtp = async (idCliente, body, req) => {
  log.info(`SERV: Iniciando enviarOtp method. idCliente.`)

  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  /** EVALUACION DE BLOQUEOS */
  const activacion = await EstadoActivacionService.getEstadoActivacionEvaluado(idCliente)
  log.debugJSON('paso #1', activacion)
  if (activacion.estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO)
    throw new CuentaBloqueadaException({ exceptionCode: 20301, message: JSON.stringify(activacion) })

  /** PROCESANDO CUENTA SIN BLOQUEAR */
  /** generacion del Token */
  totp.options = OTP_OPTIONS
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
  const codigoOtp = totp.generate(hashSecret)
  /** envio del codigoOtp por sms o email */
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)

  // envio de otp por email o sms
  if (body.modoEnvio === 'email') await ComunicacionesService.enviarCodigoEMAIL(req, correoCliente, codigoOtp)
  if (body.modoEnvio === 'sms') await ComunicacionesService.enviarCodigoSMS(req, celularCliente, codigoOtp)

  await EstadoActivacionService.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_OTPGENERADO, codigoOtp)
  log.info('SERV: Terminando enviarOtp method')
  const reintentosDisponibles =
    ACTIVACION_BLOQUEO_REINTENTOS - (await EventosEstadoActivacionService.getEventos(idCliente, ESTADO_ACTIVACION_OTPGENERADO, true))

  const expiraCodigoOtp = parseInt((Date.now() + OTP_DURACION_SEGUNDOS * 1000) / 1000, 10)
  const expiraCodigoOtpISO = new Date(expiraCodigoOtp * 1000).toISOString()
  return { codigoOtp, expiraCodigoOtp, expiraCodigoOtpISO, reintentosDisponibles }
}

/**
 * SERV: verificacion del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const verificarOtp = async (idCliente, bodySchemaEnviarOtp, req) => {
  log.info('SERV: Iniciando verificarOtp method')
  const { codigoOtp } = bodySchemaEnviarOtp

  // evaluacion si existe o se requiere de establecer algun bloqueo por algun abuso
  /** EVALUACION DE QUE EXISTA EL CLIENTE */
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  /** EVALUACION DE BLOQUEOS */
  const activacion = await EstadoActivacionService.getEstadoActivacionEvaluado(idCliente)
  if (activacion.estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO)
    throw new CuentaBloqueadaException({ exceptionCode: 20302, message: JSON.stringify(activacion) })

  // verificacion si existe el estatus apropiado para evaluar el codigo otp.
  if (activacion.estadoActivacion !== ESTADO_ACTIVACION_OTPGENERADO) {
    const message = 'No existe o no se ha enviado un Codigo OTP al cliente'
    EventosEstadoActivacionDAO.agregarEventoError(idCliente, message)
    throw new VerificarOtpError({ exceptionCode: 21401, message })
  }

  if (activacion.codigoOtp !== codigoOtp) {
    const message = `Codigo OTP no es el correcto. ${activacion.codigoOtp}`
    EventosEstadoActivacionDAO.agregarEventoError(idCliente, message)
    throw new VerificarOtpError({ exceptionCode: 21402, message })
  }

  // validaciones y carga de parametros
  totp.options = OTP_OPTIONS
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)

  const esValidoCodigoOtp = totp.check(codigoOtp, hashSecret)
  if (esValidoCodigoOtp === false) {
    const message = `El Codigo OTP ha expirado.`
    EventosEstadoActivacionDAO.agregarEventoError(idCliente, message)
    throw new VerificarOtpError({ exceptionCode: 21403, message })
  }

  await EstadoActivacionService.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_ACTIVADO)
  await ComunicacionesService.enviarActivacionEMAIL(req, cliente)
  log.info('SERV: Terminando verificarOtp method')
}

export const AuthOtpService = {
  enviarOtp,
  verificarOtp
}
export default AuthOtpService
