/* eslint-disable prettier/prettier */
import { ClienteActivacionService } from '../services/ClienteEstatusActivacion.Service'
import { invokeController } from '../commons/invokeController'


const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaEstatusActivacion = {properties: { 
  idCliente: { type: 'string', required: true },
  estatusActivacion: { type: 'number',  required: true },
}, additionalProperties : false}

const getEstadoActivacion = async (req, res) => invokeController(
  'getEstadoActivacion', 200, req, res, validationQuerySchemaCliente, undefined,
  async reqX => ClienteActivacionService.getEstadoActivacion(reqX.query.idCliente))

const setEstadoActivacion = async (req, res) => invokeController(
  'setEstadoActivacion', 201, req, res, undefined, validationBodySchemaEstatusActivacion,
  async reqX => ClienteActivacionService.setEstadoActivacion(reqX.body.idCliente,reqX.body.estatusActivacion))

export const ClienteActivacionController = {
  getEstadoActivacion,
  setEstadoActivacion
}
