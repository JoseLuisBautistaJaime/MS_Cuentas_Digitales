/* eslint-disable prettier/prettier */
import { ClienteService } from '../services/Cliente.Service'
import { UController } from '../commons/UController'

const validationBodySchemaCliente = {
  properties: { 
    // idCliente: { type: 'string', required: true },
    idDevice: { type: 'string',  required: true },
    tarjetaMonte: { type: 'string', required: true },
    nombreCliente: { type: 'string', required: true },
    apellidoPaterno: { type: 'string', required: true },
    apellidoMaterno: { type: 'string', required: true }
  }, 
  additionalProperties : false
}

const validationQuerySchemaCliente = {
  properties: { 
    idCliente: { type: 'string', required: true },
  },
  additionalProperties : false
}

const actualizarCliente = async (req, res) => UController.invoke(
  'actualizarCliente', 200, req, res, 
  true, undefined, validationBodySchemaCliente,
  async reqX => ClienteService.actualizarCliente(reqX.body))

const obtenerCliente = async (req, res) => UController.invoke(
  'obtenerCliente', 200, req, res, 
  true, validationQuerySchemaCliente, null,
  async reqX => ClienteService.obtenerCliente(reqX.query.idCliente))

const removerCliente = async (req, res) => UController.invoke(
  'removerCliente', 200, req, res, 
  true, validationQuerySchemaCliente, null,
  async reqX => ClienteService.removerCliente(reqX.query.idCliente))

export const ClienteController = {
  obtenerCliente,
  removerCliente,
  actualizarCliente
}
export default ClienteController

