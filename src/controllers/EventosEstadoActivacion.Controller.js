/* eslint-disable prettier/prettier */
import { EventosEstadoActivacionService } from '../services/EventosEstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'

const querySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const bodySchemaEstatusActivacion = { properties: { 
  estatusActivacion: { type: 'number', required: false },
}, additionalProperties : false }

const listarEventos = async (req, res) => invokeController('listarEventos', 200, req, res, 
{ querySchema : querySchemaCliente },
  async reqX => EventosEstadoActivacionService.getEventos(reqX.query.idCliente))

const removerEventos = async (req, res) => invokeController('removerEventos', 201, req, res, 
{ querySchema:querySchemaCliente, bodySchema : bodySchemaEstatusActivacion },
  async reqX => EventosEstadoActivacionService.deleteEventos(reqX.query.idCliente,reqX.body.estatusActivacion))  

export const EventosEstadoActivacionController = {
  listarEventos,
  removerEventos
}

export default EventosEstadoActivacionController
