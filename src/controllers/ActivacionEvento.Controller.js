/* eslint-disable prettier/prettier */
import { activacionEventoService } from '../services/activacionEvento.Service'
import { invokeController } from '../commons/pi8-controller'

const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const validationBodySchemaStatusActivacion = { properties: { 
  estatusActivacion: { type: 'number', required: false },
}, additionalProperties : false }

const listarEventos = async (req, res) =>
  invokeController('listarEventos', 200, req, res, true, validationQuerySchemaCliente, undefined, async reqX =>
    activacionEventoService.listarEventos(reqX.query.idCliente))

const removerEventos = async (req, res) =>
  invokeController('removerEventos', 201, req, res, true, validationQuerySchemaCliente, validationBodySchemaStatusActivacion, async reqX =>
    activacionEventoService.removerEventos(reqX.query.idCliente,reqX.body.estatusActivacion))  

export const activacionEventoController = {
  listarEventos,
  removerEventos
}

export default activacionEventoController
