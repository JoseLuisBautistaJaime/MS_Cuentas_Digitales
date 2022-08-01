/* eslint-disable prettier/prettier */
import { ClienteService } from '../services/Cliente.Service'
import { invokeController } from '../commons/invokeController'

const bodySchemaCliente = {properties: { 
    idDevice: { type: 'string',  required: true },
    tarjetaMonte: { type: 'string', required: true },
    nombreCliente: { type: 'string', required: true },
    apellidoPaterno: { type: 'string', required: false },
    apellidoMaterno: { type: 'string', required: false },
    celularCliente : { type: 'string', required: false },
    correoCliente : { type: 'string', required: false }
  }, additionalProperties : false}
  
const paramsSchemaCliente = { properties: { 
    idCliente: { type: 'string', required: true },
  }, additionalProperties : false}

const setCliente = async (req, res) => invokeController('setCliente', 201, req, res, 
  {paramsSchema : paramsSchemaCliente, bodySchema : bodySchemaCliente },
  async reqX => ClienteService.setCliente(reqX.params.idCliente,reqX.body))

const getCliente = async (req, res) => invokeController('getCliente', 200, req, res, 
  {paramsSchema : paramsSchemaCliente},
  async reqX => ClienteService.getCliente(reqX.params.idCliente))

const deleteCliente = async (req, res) => invokeController('deleteCliente', 201, req, res, 
  {paramsSchema : paramsSchemaCliente},
  async reqX => ClienteService.deleteCliente(reqX.params.idCliente))

export const ClienteController = {
  getCliente,
  deleteCliente,
  setCliente
}
export default ClienteController

