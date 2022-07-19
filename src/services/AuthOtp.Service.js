import md5 from 'md5'
import { totp } from 'otplib'
import { ComunicacionesService } from './Comunicaciones.Service'
import { clienteActivacionService } from './clienteActivacion.Service'
import { ActivacionEventoService } from './ActivacionEvento.Service'
import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { ActivacionEventoDAO } from '../dao/ActivacionEvento.DAO'
import { ACTIVACION_BLOQUEO_REINTENTOS } from '../commons/constants'

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
  LOG.debug(`TOTP-fullSecret ${fullSecret}`)
  const hashSecret = String(md5(fullSecret)).toUpperCase()
  return hashSecret
}

const evaluarBloqueo = async idCliente => {
  LOG.info('SERV: Iniciando AuthOtp.evaluarBloqueo')

  // evaluando acciones
  const totalEventos6 = await ActivacionEventoService.listarEventos(idCliente, 6, true)
  const totalEventos3 = await ActivacionEventoService.listarEventos(idCliente, 3, true)
  const reintentosDisponibles = ACTIVACION_BLOQUEO_REINTENTOS - totalEventos6 - totalEventos3
  const bloquearCliente = reintentosDisponibles <= 0

  // evaluacion del estatus actual y cambiar el estatus a bloquado cuando no lo este
  LOG.debugJSON('AuthOtp.evaluarBloqueo: idCliente', idCliente)
  let activacion = await clienteActivacionService.obtenerEstatusActivacion(idCliente, false)
  LOG.debugJSON('AuthOtp.evaluarBloqueo: activacion', activacion)

  // evalua el desbloqueo de cuenta..
  if (activacion.estatusActivacion === 5 && bloquearCliente === false)
    activacion = await clienteActivacionService.establecerEstatusActivacion(idCliente, 2)

  // procedimientos cuando la cuenta necesita bloearse o se debe de encontrar debidamente bloqueada
  if (bloquearCliente && activacion.estatusActivacion !== 5)
    activacion = await clienteActivacionService.establecerEstatusActivacion(idCliente, 5)

  // preparanto resultados a Retornar
  LOG.info('SERV: Terminando AuthOtp.evaluarBloqueo')
  return activacion
}

/**
 * SERV: para el envío del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const enviarOtp = async (req, bodySchemaEnviarOtp) => {
  LOG.info(`SERV: Iniciando enviarOtp method. idCliente.`)
  const { idCliente, modoEnvio } = bodySchemaEnviarOtp

  /** EVALUACION DE BLOQUEOS */
  const bloquearCliente = await evaluarBloqueo(idCliente, 3)
  if (bloquearCliente.code !== 200) return bloquearCliente

  /** PROCESANDO CUENTA SIN BLOQUEAR */
  const cliente = await ClienteDAO.findByIdCliente(idCliente)

  /** generacion del Token */
  totp.options = OTP_OPTIONS
  LOG.debugJSON('OPTIONLS:', OTP_OPTIONS)
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
  const codigoOtp = totp.generate(hashSecret)
  const expiraCodigoOtp = parseInt((Date.now() + OTP_DURACION_SEGUNDOS * 1000) / 1000, 10)
  const expiraCodigoOtpISO = new Date(expiraCodigoOtp * 1000).toISOString()

  /** envio del codigoOtp por sms o email */
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)

  let statusEnvio
  // envio de otp por email o sms
  if (modoEnvio === 'email') statusEnvio = await ComunicacionesService.enviarCodigoEMAIL(req, correoCliente, codigoOtp)
  if (modoEnvio === 'sms') statusEnvio = await ComunicacionesService.enviarCodigoSMS(req, celularCliente, codigoOtp)

  // verificar si existe alguna excepcion
  if (statusEnvio.statusRequest !== 201) {
    LOG.debugJSON('sendOtpToComunicaciones-statusEnvio', statusEnvio)
    const toReturn = {
      code: 500,
      message: `Internal Server Error - MS_COMUNICACIONES: ${statusEnvio.descripcionError}`
    }
    return toReturn
  }

  await clienteActivacionService.establecerEstatusActivacion(idCliente, 3, codigoOtp)
  LOG.info('SERV: Terminando enviarOtp method')
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
  LOG.info('SERV: Iniciando verificarOtp method')
  const { idCliente, codigoOtp } = bodySchemaEnviarOtp
  let { enviarEmail } = bodySchemaEnviarOtp
  if (enviarEmail === undefined) enviarEmail = true

  // evaluacion si existe o se requiere de establecer algun bloqueo por algun abuso
  const bloquearCliente = await evaluarBloqueo(idCliente)
  if (bloquearCliente.code !== 200) return bloquearCliente

  // verificacion si existe el estatus apropiado para evaluar el codigo otp.
  const toReturn = { code: 200, esValidoOtp: false, estaExpiradoOtp: false }
  const estatus = await clienteActivacionService.obtenerEstatusActivacion(idCliente, false)

  if (estatus.estatusActivacion !== 3) {
    toReturn.mensaje = 'No existe o no se ha enviado un Codigo OTP al cliente'
    toReturn.code = 214
    ActivacionEventoDAO.agregarEventoError(idCliente, toReturn.mensaje)
    return toReturn
  }

  // evaluacion del OTP, en las condiciones correctas de estatus.
  let cliente
  if (estatus.codigoOtp !== codigoOtp) {
    toReturn.mensaje = `Codigo OTP no es el correcto. ${estatus.codigoOtp}`
    toReturn.code = 200
    ActivacionEventoDAO.agregarEventoError(idCliente, toReturn.mensaje)
  } else {
    // validaciones y carga de parametros
    cliente = await ClienteDAO.findByIdCliente(idCliente)
    totp.options = OTP_OPTIONS
    const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
    toReturn.esValidoOtp = totp.check(codigoOtp, hashSecret)
    LOG.debug(`TEST: esValidoOtp: ${toReturn.esValidoOtp}`)
    LOG.info('SERV: Terminando verificarOtp method')
    toReturn.estaExpiradoOtp = !toReturn.esValidoOtp
  }
  if (toReturn.esValidoOtp === true) {
    await clienteActivacionService.establecerEstatusActivacion(idCliente, 4)
  }
  if (toReturn.esValidoOtp && enviarEmail) await ComunicacionesService.enviarActivacionEMAIL(req, res, cliente)
  return toReturn
}

export const AuthOtpService = {
  enviarOtp,
  verificarOtp
}
export default AuthOtpService
