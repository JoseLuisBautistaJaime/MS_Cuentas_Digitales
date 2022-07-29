/* eslint-disable prettier/prettier */
import { ActivacionEventoService } from '../services/EventosEstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'

const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaEstadoActivacion = { properties: { 
  estadoActivacion: { type: 'number', required: false },
}, additionalProperties : false }

const getEventos = async (req, res) => invokeController('getEventos', 200, req, res, 
  validationQuerySchemaCliente, undefined, 
  async reqX => ActivacionEventoService.getEventos(reqX.query.idCliente))

const deleteEventos = async (req, res) => invokeController('deleteEventos', 201, req, res, 
  validationQuerySchemaCliente, validationBodySchemaEstadoActivacion, 
  async reqX => ActivacionEventoService.deleteEventos(reqX.query.idCliente,reqX.body.estadoActivacion))  

export const ActivacionEventoController = {
  getEventos,
  deleteEventos
}

export default ActivacionEventoController
