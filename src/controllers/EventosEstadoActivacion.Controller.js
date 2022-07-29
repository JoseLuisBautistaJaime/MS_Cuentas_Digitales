/* eslint-disable prettier/prettier */
import { ActivacionEventoService } from '../services/EventosEstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'

const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaEstadoActivacion = { properties: { 
  estadoActivacion: { type: 'number', required: false },
}, additionalProperties : false }

const listarEventos = async (req, res) => invokeController('listarEventos', 200, req, res, 
  validationQuerySchemaCliente, undefined, 
  async reqX => ActivacionEventoService.listarEventos(reqX.query.idCliente))

const removerEventos = async (req, res) => invokeController('removerEventos', 201, req, res, 
  validationQuerySchemaCliente, validationBodySchemaEstadoActivacion, 
  async reqX => ActivacionEventoService.removerEventos(reqX.query.idCliente,reqX.body.estadoActivacion))  

export const ActivacionEventoController = {
  listarEventos,
  removerEventos
}

export default ActivacionEventoController
