import mongoose from 'mongoose'
import LOG from '../commons/logger'
import { Response } from '../commons/response'
// import mongo from '../service/mongo.service'
import { CommonValidator } from '../validator/common.validator'
// import { CODE_INTERNAL_SERVER_ERROR, MESSAGE_ERROR } from '../constansts'
import handlerError from '../validator/handler-error'
import { UsuarioValidator } from '../validator/usuario.validator'
import { handlerErrorValidation } from '../validator/message.mapping'
import { HEADER_ID_CLIENTE } from '../constansts'
// import Usuario from '../models/usuario.model'
// import { result } from 'lodash'

const usuarioSchema = new mongoose.Schema({
  idCliente: { type: String, required: true },
  tarjetaMonte: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  nombreCompleto: String,
  correoCliente: String,
  celularCliente: String,
  estatusActivacion: String,
  codigoVerificacion: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})

const Usuario = mongoose.model('Usuario', usuarioSchema)
const healthCheck = async (req, res) => {
  return Response.Ok(res)
}
async function setEstatusActivacionInternal(idCliente, estatusActivacion) {
  LOG.info('CTRL: setEstatusActivacionInternal')
  const resultSave = await Usuario.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        estatusActivacion,
        ultimaActualizacion: Date.now()
      }
    },
    {
      new: true
    }
  )
  return resultSave
}

const setEstatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting setEstatusActivacion method')
  try {
    await CommonValidator.validateHeaderOAG(req)
    const validator = UsuarioValidator.ValidatorSchema.validate(
       req.body,
       UsuarioValidator.setEstatusActivacionRequest
    )
    if (validator.errors.length) handlerErrorValidation(validator)
    const { idCliente, estatusActivacion } = req.body
    const resultSave = await setEstatusActivacionInternal(idCliente, estatusActivacion)
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}

// ** Inicio: getEstatusActivacion
async function getEstatusActivacionInternal(idCliente) {
  LOG.info('internal: getEstatusActivacionInternal')
  const usuario = await Usuario.findOne({ idCliente })
  LOG.debugJSON('ctrl: usuario', usuario)
  if (usuario === null) return 'NoExiste'
  const { estatusActivacion } = usuario
  if (estatusActivacion === '' || estatusActivacion === undefined) return 'Prospecto'
  return estatusActivacion
}

const getEstatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting getEstatusActivacion method')
  try {
    await CommonValidator.validateHeaderOAG(req)
    await CommonValidator.validarHeader(req, HEADER_ID_CLIENTE)
    const idCliente = req.header(HEADER_ID_CLIENTE)
    const estatusUsuario = await getEstatusActivacionInternal(idCliente)

    LOG.info('CTRL: Terminado getEstatusActivacion method')
    const resp = {
      estatusUsuario: estatusUsuario
    }
    return res.status(200).send(resp)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}


// ** Fin: getEstatusUsuario
async function actualizarUsuarioInternal(body) {
  LOG.info('Internal: Starting actualizarUsuario method')
  const { idCliente } = body
  LOG.debugJSON('ctrl: idCliente', idCliente)
  const usuarioExist = await Usuario.find({ idCliente }).count()
  LOG.debugJSON('prms:  usuarioExist', usuarioExist)

  LOG.debugJSON('prms:  body', body)

  let resultSave
  if (usuarioExist === 0) {
    const usuarioToAdd = new Usuario({
      idCliente,
      tarjetaMonte: body.tarjetaMonte,
      nombreCliente: body.nombreCliente,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno,
      correoCliente: body.correoCliente,
      celularCliente: body.celularCliente,
      estatusActivacion: 'prospecto',
      ultimaActualizacion: Date.now()
    })
    LOG.debugJSON('CTRL: usuarioToAdd', usuarioToAdd)
    resultSave = await usuarioToAdd.save()
    LOG.debugJSON('ctrl: Usuario Creado', idCliente)
  }

  // actualizacion de cambios (CUANDO EL CLIENTE YA EXISTE)
  if (usuarioExist !== 0) {
    resultSave = await Usuario.findOneAndUpdate(
      {
        idCliente
      },
      {
        $set: {
          tarjetaMonte: body.tarjetaMonte,
          nombreCliente: body.nombreCliente,
          apellidoPaterno: body.apellidoPaterno,
          apellidoMaterno: body.apellidoMaterno,
          correoCliente: body.correoCliente,
          celularCliente: body.celularCliente,
          ultimaActualizacion: Date.now()
        }
      },
      {
        new: true
      }
    )
    // resultSave = await usuarioToUpdate.save()
  }
  return resultSave
}

const actualizarUsuario = async (req, res) => {
  LOG.info('CTRL: Starting actualizarUsuario method')
  try {
    await CommonValidator.validateHeaderOAG(req)
    const validator = UsuarioValidator.ValidatorSchema.validate(
      req.body,
      UsuarioValidator.usuarioRequest
    )
    if (validator.errors.length) handlerErrorValidation(validator)
    // busqueda del usuario
    const resultSave = await actualizarUsuarioInternal(req.body)
    LOG.debugJSON('ctrl: Usuario Actualizado', resultSave)
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}

export const usuarioController = {
  healthCheck,
  actualizarUsuario,
  actualizarUsuarioInternal,
  getEstatusActivacion,
  setEstatusActivacion,
  getEstatusActivacionInternal,
  setEstatusActivacionInternal
}
export default usuarioController
