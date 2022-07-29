/* eslint-disable prettier/prettier */
import { ClienteActivacionService } from '../services/ClienteActivacion.Service'
import { invokeController } from '../commons/invokeController'


const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaEstatusActivacion = {properties: { 
  idCliente: { type: 'string', required: true },
  estatusActivacion: { type: 'number',  required: true },
}, additionalProperties : false}

const getEstatusActivacion = async (req, res) => invokeController(
  'getEstatusActivacion', 200, req, res, validationQuerySchemaCliente, undefined,
  async reqX => ClienteActivacionService.getEstatusActivacion(reqX.query.idCliente))

const setEstatusActivacion = async (req, res) => invokeController(
  'setEstatusActivacion', 201, req, res, undefined, validationBodySchemaEstatusActivacion,
  async reqX => ClienteActivacionService.setEstatusActivacion(reqX.body.idCliente,reqX.body.estatusActivacion))

export const ClienteActivacionController = {
  getEstatusActivacion,
  setEstatusActivacion
}
