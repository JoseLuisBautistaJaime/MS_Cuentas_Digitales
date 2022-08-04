/* eslint-disable prettier/prettier */
import { EstadoActivacionService } from '../services/EstadoActivacion.Service'
import { invokeController } from '../commons/invokeController'


const querySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false }

const bodySchemaEstatusActivacion = {properties: { 
  idCliente: { type: 'string', required: true },
  estatusActivacion: { type: 'number',  required: true },
}, additionalProperties : false}

const obtenerEstatusActivacion = async (req, res) => invokeController(
  'obtenerEstatusActivacion', 200, req, res,
  { querySchema : querySchemaCliente },
  async reqX => EstadoActivacionService.getEstadoActivacion(reqX.query.idCliente))

const establecerEstatusActivacion = async (req, res) => invokeController(
  'establecerEstatusActivacion', 201, req, res,
  { bodySchema : bodySchemaEstatusActivacion },
  async reqX => EstadoActivacionService.setEstadoActivacion(reqX.body.idCliente,reqX.body.estatusActivacion))

export const EstadoActivacionController = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
