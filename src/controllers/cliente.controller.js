import mongoose from 'mongoose'
import LOG from '../commons/logger'
import { Response } from '../commons/response'
// import mongo from '../service/mongo.service'
import { CommonValidator } from '../validator/common.validator'
// import { CODE_INTERNAL_SERVER_ERROR, MESSAGE_ERROR } from '../constansts'
import handlerError from '../validator/handler-error'
import { ClienteValidator } from '../validator/cliente.validator'
import { handlerErrorValidation } from '../validator/message.mapping'
import { CODE_INTERNAL_SERVER_ERROR, MESSAGE_ERROR } from '../constansts'
// import { HEADER_ID_CLIENTE } from '../constansts'
// import Usuario from '../models/usuario.model'
// import { result } from 'lodash'

const clienteSchema = new mongoose.Schema({
  idCliente: { type: String, index: true, required: true },
  idDevice: { type: String, required: true },
  tarjetaMonte: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  nombreCompleto: String,
  correoCliente: String,
  celularCliente: String,
  statusActivacion: { Type: Number },
  Activacion: Object,
  codigoVerificacion: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})

const Cliente = mongoose.model('Cliente', clienteSchema)

const healthCheck = async (req, res) => {
  return Response.Ok(res)
}
async function setStatusActivacionInternal(idCliente, statusActivacion) {
  const resultSave = await Cliente.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        statusActivacion,
        ultimaActualizacion: Date.now()
      }
    },
    {
      new: true
    }
  )
  return resultSave
}

const setStatusActivacion = async (req, res) => {
  try {
    LOG.info('CTRL: setStatusActivacion')
    await CommonValidator.validateHeaderOAG(req)
    const validator = ClienteValidator.ValidatorSchema.validate(
      req.body,
      ClienteValidator.setStatusActivacionRequest
    )
    if (validator.errors.length) handlerErrorValidation(validator)
    const { idCliente, statusActivacion } = req.body
    const resultSave = await setStatusActivacionInternal(idCliente, statusActivacion)
    LOG.info('CTRL: Terminado setStatusActivacion')
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}


// ** Inicio: getCliente
async function getClienteInternal(res, idCliente) {
  LOG.debugJSON('getClienteInternal: idCliente', idCliente)
  const cliente = await Cliente.findOne({ idCliente })
  LOG.debugJSON('getClienteInternal: cliente', cliente)

  if (cliente === null || cliente === undefined) {
    const controlExcepcion = {
      codigo: CODE_INTERNAL_SERVER_ERROR,
      mensaje: MESSAGE_ERROR
    }
    const response = {
      controlExcepcion
    }
    return res.status(500).send(response)
  }
  return cliente
}

const getCliente = async (req, res) => {
  LOG.info('CTRL: Starting getCliente')
  try {
    await CommonValidator.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await getClienteInternal(res, idCliente)
    LOG.info('CTRL: Terminado getCliente')
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}
// ** Terminacion: getCliente

// ** Inicio: getEstatusActivacion
async function getStatusActivacionInternal(res, idCliente) {
  LOG.debugJSON('getStatusActivacionInternal-idCliente', idCliente)
  const cliente = await getClienteInternal(res, idCliente)
  // const usuario = await Usuario.findOne({ idCliente })
  LOG.debugJSON('ctrl: cliente', cliente)

  let result = {
    statusActivacion: 0,
    statusActivacionName: ''
  }

  if (cliente === null)
    result = { statusActivacion: 1, statusActivacionName: 'NoExisteCliente' }
  else {
    let { statusActivacion } = cliente
    LOG.debugJSON('getStatusActivacionInternal: statusActivacion', statusActivacion)

    if (statusActivacion === '' || statusActivacion === undefined)
      statusActivacion = 2
    switch (String(statusActivacion)) {
      case '2':
        LOG.debugJSON('switch(2): statusActivacion', statusActivacion)
        result = { statusActivacion, statusActivacionName: 'Prospecto' }
        break
      case (3, '3'):
        result = { statusActivacion, statusActivacionName: 'OtpGenerado' }
        break
      case (4, '4'):
        result = { statusActivacion, statusActivacionName: 'Activado' }
        break
      default:
        LOG.debugJSON('switch: statusActivacion', statusActivacion)
    }
    LOG.debugJSON('getStatusActivacionInternal: result', result)
  }
  return result
}

const getStatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting getStatusActivacion')
  try {
    await CommonValidator.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await getStatusActivacionInternal(res, idCliente)
    LOG.info('CTRL: Terminado getStatusActivacion')
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}


// ** Fin: getEstatusUsuario
async function actualizarClienteInternal(body) {
  LOG.info('Internal: Starting actualizarUsuario method')
  const { idCliente } = body
  LOG.debugJSON('ctrl: idCliente', idCliente)
  const usuarioExist = await Cliente.find({ idCliente }).count()
  LOG.debugJSON('prms:  usuarioExist', usuarioExist)

  LOG.debugJSON('prms:  body', body)

  let resultSave
  if (usuarioExist === 0) {
    const clienteToAdd = new Cliente({
      idCliente,
      idDevice: body.idDevice,
      tarjetaMonte: body.tarjetaMonte,
      nombreCliente: body.nombreCliente,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno,
      correoCliente: body.correoCliente,
      celularCliente: body.celularCliente,
      estatusActivacion: 'prospecto',
      ultimaActualizacion: Date.now()
    })
    LOG.debugJSON('CTRL: clienteToAdd', clienteToAdd)
    resultSave = await clienteToAdd.save()
    LOG.debugJSON('ctrl: Usuario Creado', idCliente)
  }

  // actualizacion de cambios (CUANDO EL CLIENTE YA EXISTE)
  if (usuarioExist !== 0) {
    resultSave = await Cliente.findOneAndUpdate(
      {
        idCliente
      },
      {
        $set: {
          idDevice: body.idDevice,
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

const actualizarCliente = async (req, res) => {
  LOG.info('CTRL: Starting actualizarUsuario method')
  try {
    await CommonValidator.validateHeaderOAG(req)
    const validator = ClienteValidator.ValidatorSchema.validate(
      req.body,
      ClienteValidator.clienteRequest
    )
     if (validator.errors.length) handlerErrorValidation(validator)
    // busqueda del usuario
    const resultSave = await actualizarClienteInternal(req.body)
    LOG.debugJSON('ctrl: Usuario Actualizado', resultSave)
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}

export const clienteController = {
  healthCheck,
  actualizarCliente,
  actualizarClienteInternal,
  getStatusActivacion,
  getCliente,
  getClienteInternal,
  setStatusActivacion,
  getStatusActivacionInternal,
  setStatusActivacionInternal
}
export default clienteController
