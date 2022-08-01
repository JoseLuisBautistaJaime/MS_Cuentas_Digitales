/* eslint-disable prettier/prettier */
import { EstadoActivacionService } from '../services/EstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'

const paramsSchemaCliente = { properties: { idCliente: { type: 'string', required: true }}, additionalProperties : false}
const bodySchemaEstadoActivacion = {properties: { estadoActivacion: { type: 'number',  required: true }}, additionalProperties : false}

const getEstadoActivacion = async (req, res) => invokeController('getEstadoActivacion', 200, req, res, 
  { paramsSchema : paramsSchemaCliente},
  async reqX => EstadoActivacionService.getEstadoActivacion(reqX.params.idCliente))

const setEstadoActivacion = async (req, res) => invokeController('setEstadoActivacion', 201, req, res, 
  { paramsSchema : paramsSchemaCliente, bodySchema : bodySchemaEstadoActivacion },
  async reqX => EstadoActivacionService.setEstadoActivacion(reqX.params.idCliente,reqX.body.estadoActivacion))

export const EstadoActivacionController = {
  getEstadoActivacion,
  setEstadoActivacion
}
