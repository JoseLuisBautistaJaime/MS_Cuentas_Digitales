/* eslint-disable prettier/prettier */
import { ClienteService } from '../services/Cliente.Service'
import { invokeController } from '../commons/invokeController'

const validationBodySchemaCliente = {properties: { 
    idDevice: { type: 'string',  required: true },
    tarjetaMonte: { type: 'string', required: true },
    nombreCliente: { type: 'string', required: true },
    apellidoPaterno: { type: 'string', required: false },
    apellidoMaterno: { type: 'string', required: false },
    celularCliente : { type: 'string', required: false },
    correoCliente : { type: 'string', required: false }
  }, additionalProperties : false}
  
const validationQuerySchemaCliente = { properties: { 
    idCliente: { type: 'string', required: true },
  }, additionalProperties : false}

const setCliente = async (req, res) => invokeController('setCliente', 201, req, res, 
validationQuerySchemaCliente, validationBodySchemaCliente, 
  async reqX => ClienteService.setCliente(reqX.query.idCliente,reqX.body))

const obtenerCliente = async (req, res) => invokeController('obtenerCliente', 200, req, res, 
  validationQuerySchemaCliente, undefined, 
  async reqX => ClienteService.obtenerCliente(reqX.query.idCliente))

const removerCliente = async (req, res) => invokeController('removerCliente', 201, req, res, 
  validationQuerySchemaCliente, undefined, 
  async reqX => ClienteService.removerCliente(reqX.query.idCliente))

export const ClienteController = {
  obtenerCliente,
  removerCliente,
  setCliente
}
export default ClienteController

