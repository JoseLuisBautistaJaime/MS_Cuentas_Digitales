/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
import { AuthOtpService } from '../services/AuthOtp.Service'
import { invokeController } from '../commons/invokeController'

const bodySchemaEnviarOtp = {properties: { 
  idCliente: { type: 'string', required: true },
  modoEnvio: { type: 'string', enum: ['sms','email'], required: true }
}, additionalProperties : false }

const bodySchemaVerificarOtp = {properties: {
   idCliente: { type: 'string', required: true },
   codigoOtp: { type: 'string', required: true }
  }, additionalProperties : false }

const enviarOtp = async (req, res) => invokeController('enviarOtp', 201, req, res, 
  { bodySchema : bodySchemaEnviarOtp },
  async reqX => AuthOtpService.enviarOtp(reqX.body.idCliente, reqX.body,reqX))

const verificarOtp = async (req, res) => invokeController('verificarOtp', 201, req, res, 
  { bodySchema : bodySchemaVerificarOtp },
  async reqX => AuthOtpService.verificarOtp(reqX.body.idCliente, reqX.body,reqX))

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
