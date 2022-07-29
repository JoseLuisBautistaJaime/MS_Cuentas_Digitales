/* eslint-disable prettier/prettier */
import { ActivacionEventoService } from '../services/ActivacionEvento.Service'
import { invokeController } from '../commons/pi8-controller'

const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaStatusActivacion = { properties: { 
  estatusActivacion: { type: 'number', required: false },
}, additionalProperties : false }

const listarEventos = async (req, res) => invokeController('listarEventos', 200, req, res, 
  validationQuerySchemaCliente, undefined, 
  async reqX => ActivacionEventoService.listarEventos(reqX.query.idCliente))

const removerEventos = async (req, res) => invokeController('removerEventos', 201, req, res, 
  validationQuerySchemaCliente, validationBodySchemaStatusActivacion, 
  async reqX => ActivacionEventoService.removerEventos(reqX.query.idCliente,reqX.body.estatusActivacion))  

export const ActivacionEventoController = {
  listarEventos,
  removerEventos
}

export default ActivacionEventoController
