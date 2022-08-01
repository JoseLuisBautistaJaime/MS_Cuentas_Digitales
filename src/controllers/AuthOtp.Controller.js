/* eslint-disable prettier/prettier */
import { AuthOtpService } from '../services/AuthOtp.Service'
import { invokeController } from '../commons/invokeController'

const paramsSchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true }
}, additionalProperties : false}

const bodySchemaEnviarOtp = {properties: { 
    modoEnvio: { type: 'string', enum: ['sms','email'], required: true }
  }, additionalProperties : false }

const bodySchemaVerificarOtp = {properties: { codigoOtp: { type: 'string', required: true }}, additionalProperties : false }

const enviarOtp = async (req, res) => invokeController('enviarOtp', 201, req, res, 
  { paramsSchema : paramsSchemaCliente, bodySchema : bodySchemaEnviarOtp },
  async reqX => AuthOtpService.enviarOtp(reqX.params.idCliente, reqX.body,reqX))

const verificarOtp = async (req, res) => invokeController('verificarOtp', 201, req, res, 
  { paramsSchema : paramsSchemaCliente, bodySchema : bodySchemaVerificarOtp },
  async reqX => AuthOtpService.verificarOtp(reqX.params.idCliente, reqX.body,reqX))

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
