/* eslint-disable prettier/prettier */
import { EventosEstadoActivacionService } from '../services/EventosEstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'

const paramsSchemaCliente = { properties: { idCliente: { type: 'string', required: true }}, additionalProperties : false }
const bodySchemaEstadoActivacion = { properties: { estadoActivacion: { type: 'number', required: false }}, additionalProperties : false }

const getEventos = async (req, res) => invokeController('getEventos', 200, req, res, 
  { paramsSchema : paramsSchemaCliente},
  async reqX => EventosEstadoActivacionService.getEventos(reqX.params.idCliente))

const deleteEventos = async (req, res) => invokeController('deleteEventos', 201, req, res, 
  { paramsSchema : paramsSchemaCliente, bodySchema : bodySchemaEstadoActivacion },
  async reqX => EventosEstadoActivacionService.deleteEventos(reqX.params.idCliente, reqX.body.estadoActivacion))  

export const EventosEstadoActivacionController = {
  getEventos,
  deleteEventos
}
