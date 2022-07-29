import md5 from 'md5'
import { totp } from 'otplib'
import { ComunicacionesService } from './Comunicaciones.Service'
import { ClienteActivacionService } from './EstadoActivacion.Service'
import { ActivacionEventoService } from './EventosEstadoActivacion.Service'
import { log } from '../commons/log'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { ActivacionEventoDAO } from '../dao/EventosEstadoActivacion.DAO'
import { ACTIVACION_BLOQUEO_REINTENTOS } from '../commons/constants'
import { NotFoundCliente, CuentaBloqueadaException, VerificarOtpError } from '../commons/exceptions'

// Cambiar a variables de ambiente
const OTP_SECRET = '465465465465sgdfgsdfa4ardsgasgsasdag'
const OTP_DURACION_SEGUNDOS = 120
const OTP_OPTIONS = {
  digits: 4,
  algorithm: 'sha1',
  step: OTP_DURACION_SEGUNDOS,
  window: 2
}
function generateHashSecret(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRET}.${idCliente}.${idDevice}`
  log.debug(`TOTP-fullSecret ${fullSecret}`)
  return String(md5(fullSecret)).toUpperCase()
}

const evaluarBloqueo = async idCliente => {
  log.info('SERV: Iniciando AuthOtp.evaluarBloqueo')

  // evaluando acciones
  const totalEventos6 = await ActivacionEventoService.listarEventos(idCliente, 6, true)
  const totalEventos3 = await ActivacionEventoService.listarEventos(idCliente, 3, true)
  const reintentosDisponibles = ACTIVACION_BLOQUEO_REINTENTOS - totalEventos6 - totalEventos3
  const bloquearCliente = reintentosDisponibles <= 0

  // evaluacion del estatus actual y cambiar el estatus a bloquado cuando no lo este
  log.debugJSON('AuthOtp.evaluarBloqueo: idCliente', idCliente)
  let activacion = await ClienteActivacionService.getEstadoActivacion(idCliente, false)
  log.debugJSON('AuthOtp.evaluarBloqueo: activacion', activacion)

  // evalua el desbloqueo de cuenta..
  if (activacion.estadoActivacion === 5 && bloquearCliente === false)
    activacion = await ClienteActivacionService.setEstadoActivacion(idCliente, 2)

  // procedimientos cuando la cuenta necesita bloearse o se debe de encontrar debidamente bloqueada
  if (bloquearCliente && activacion.estadoActivacion !== 5) activacion = await ClienteActivacionService.setEstadoActivacion(idCliente, 5)

  // preparanto resultados a Retornar
  log.info('SERV: Terminando AuthOtp.evaluarBloqueo')
  return activacion
}

/**
 * SERV: para el envío del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const enviarOtp = async (req, bodySchemaEnviarOtp) => {
  log.info(`SERV: Iniciando enviarOtp method. idCliente.`)
  const { idCliente, modoEnvio } = bodySchemaEnviarOtp
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  /** EVALUACION DE BLOQUEOS */
  const bloquearCliente = await evaluarBloqueo(idCliente)
  if (bloquearCliente.estadoActivacion === 5) throw new CuentaBloqueadaException({ exceptionCode: 20301, message: JSON.stringify(bloquearCliente) })

  /** PROCESANDO CUENTA SIN BLOQUEAR */
  /** generacion del Token */
  totp.options = OTP_OPTIONS
  log.debugJSON('OPTIONLS:', OTP_OPTIONS)
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
  const codigoOtp = totp.generate(hashSecret)
  const expiraCodigoOtp = parseInt((Date.now() + OTP_DURACION_SEGUNDOS * 1000) / 1000, 10)
  const expiraCodigoOtpISO = new Date(expiraCodigoOtp * 1000).toISOString()

  /** envio del codigoOtp por sms o email */
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)

  // envio de otp por email o sms
  if (modoEnvio === 'email') await ComunicacionesService.enviarCodigoEMAIL(req, correoCliente, codigoOtp)
  if (modoEnvio === 'sms') await ComunicacionesService.enviarCodigoSMS(req, celularCliente, codigoOtp)

  await ClienteActivacionService.setEstadoActivacion(idCliente, 3, codigoOtp)
  log.info('SERV: Terminando enviarOtp method')
  const reintentosDisponibles = ACTIVACION_BLOQUEO_REINTENTOS - (await ActivacionEventoService.listarEventos(idCliente, 3, true))
  return { code: 200, codigoOtp, expiraCodigoOtp, expiraCodigoOtpISO, reintentosDisponibles }
}

/**
 * SERV: verificacion del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const verificarOtp = async (req, bodySchemaEnviarOtp) => {
  log.info('SERV: Iniciando verificarOtp method')
  const { idCliente, codigoOtp } = bodySchemaEnviarOtp
  let { enviarEmail } = bodySchemaEnviarOtp
  if (enviarEmail === undefined) enviarEmail = true

  // evaluacion si existe o se requiere de establecer algun bloqueo por algun abuso
  /** EVALUACION DE QUE EXISTA EL CLIENTE */
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  /** EVALUACION DE BLOQUEOS */
  const bloquearCliente = await evaluarBloqueo(idCliente)
  if (bloquearCliente.estadoActivacion === 5) throw new CuentaBloqueadaException({ exceptionCode: 20302, message: JSON.stringify(bloquearCliente) })

  // verificacion si existe el estatus apropiado para evaluar el codigo otp.
  const toReturn = { code: 201, esValidoOtp: false, estaExpiradoOtp: false }
  const estatus = await ClienteActivacionService.getEstadoActivacion(idCliente)

  if (estatus.estadoActivacion !== 3) {
    ActivacionEventoDAO.agregarEventoError(idCliente, 'No existe o no se ha enviado un Codigo OTP al cliente')
    throw new VerificarOtpError()
  }

  // evaluacion del OTP, en las condiciones correctas de estatus.
  if (estatus.codigoOtp !== codigoOtp) {
    toReturn.mensaje = `Codigo OTP no es el correcto. ${estatus.codigoOtp}`
    toReturn.code = 201
    ActivacionEventoDAO.agregarEventoError(idCliente, toReturn.mensaje)
  } else {
    // validaciones y carga de parametros
    totp.options = OTP_OPTIONS
    const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
    toReturn.esValidoOtp = totp.check(codigoOtp, hashSecret)
    log.debug(`TEST: esValidoOtp: ${toReturn.esValidoOtp}`)
    log.info('SERV: Terminando verificarOtp method')
    toReturn.estaExpiradoOtp = !toReturn.esValidoOtp
  }
  if (toReturn.esValidoOtp === true) {
    await ClienteActivacionService.setEstadoActivacion(idCliente, 4)
  }
  if (toReturn.esValidoOtp && enviarEmail) await ComunicacionesService.enviarActivacionEMAIL(req, cliente)
  return toReturn
}

export const AuthOtpService = {
  enviarOtp,
  verificarOtp
}
export default AuthOtpService
