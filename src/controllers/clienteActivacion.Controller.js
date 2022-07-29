/* eslint-disable prettier/prettier */
import { ClienteActivacionService } from '../services/ClienteActivacion.Service'
import { invokeController } from '../commons/cd-controller'


const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaEstatusActivacion = {properties: { 
  idCliente: { type: 'string', required: true },
  estatusActivacion: { type: 'number',  required: true },
}, additionalProperties : false}

const obtenerEstatusActivacion = async (req, res) => invokeController(
  'obtenerEstatusActivacion', 200, req, res, validationQuerySchemaCliente, undefined,
  async reqX => ClienteActivacionService.obtenerEstatusActivacion(reqX.query.idCliente))

const establecerEstatusActivacion = async (req, res) => invokeController(
  'establecerEstatusActivacion', 201, req, res, undefined, validationBodySchemaEstatusActivacion,
  async reqX => ClienteActivacionService.establecerEstatusActivacion(reqX.body.idCliente,reqX.body.estatusActivacion))

export const ClienteActivacionController = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
