/* eslint-disable prettier/prettier */
import { ClienteActivacionService } from '../services/EstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'


const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaEstadoActivacion = {properties: { 
  idCliente: { type: 'string', required: true },
  estadoActivacion: { type: 'number',  required: true },
}, additionalProperties : false}

const getEstadoActivacion = async (req, res) => invokeController(
  'getEstadoActivacion', 200, req, res, validationQuerySchemaCliente, undefined,
  async reqX => ClienteActivacionService.getEstadoActivacion(reqX.query.idCliente))

const setEstadoActivacion = async (req, res) => invokeController(
  'setEstadoActivacion', 201, req, res, undefined, validationBodySchemaEstadoActivacion,
  async reqX => ClienteActivacionService.setEstadoActivacion(reqX.body.idCliente,reqX.body.estadoActivacion))

export const ClienteActivacionController = {
  getEstadoActivacion,
  setEstadoActivacion
}
