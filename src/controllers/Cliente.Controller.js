/* eslint-disable prettier/prettier */
import { ClienteService } from '../services/Cliente.Service'
import { invokeController } from '../commons/invokeController'

const bodySchemaCliente = {properties: { 
    idCliente: { type: 'string', required: true },
    idDevice: { type: 'string',  required: true },
    tarjetaMonte: { type: 'string', required: true },
    nombreCliente: { type: 'string', required: true },
    apellidoPaterno: { type: 'string', required: false },
    apellidoMaterno: { type: 'string', required: false },
    celularCliente : { type: 'string', required: false },
    correoCliente : { type: 'string', required: false }
  }, additionalProperties : false}

const querySchemaCliente = { properties: { 
    idCliente: { type: 'string', required: true },
  }, additionalProperties : false}

const actualizarCliente = async (req, res) => invokeController('actualizarCliente', 201, req, res, 
  { bodySchema : bodySchemaCliente },
  async reqX => ClienteService.setCliente(reqX.body.idCliente,reqX.body))

const obtenerCliente = async (req, res) => invokeController('obtenerCliente', 200, req, res, 
  { querySchema : querySchemaCliente },
  async reqX => ClienteService.getCliente(reqX.query.idCliente))

const removerCliente = async (req, res) => invokeController('removerCliente', 201, req, res, 
  { querySchema : querySchemaCliente },
  async reqX => ClienteService.deleteCliente(reqX.query.idCliente))

export const ClienteController = {
  obtenerCliente,
  removerCliente,
  actualizarCliente
}
export default ClienteController

