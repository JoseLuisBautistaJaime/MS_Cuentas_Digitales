/* eslint-disable prettier/prettier */
import { AuthOtpService } from '../services/AuthOtp.Service'
import { invokeController } from '../commons/pi8-controller'

const validationBodySchemaEnviarOtp = {properties: { 
    idCliente: { type: 'string', required: true },
    modoEnvio: { type: 'string', enum: ['sms','email'], required: true },
  }, additionalProperties : false }

const validationBodySchemaVerificarOtp = {properties: { 
    idCliente: { type: 'string', required: true },
    codigoOtp: { type: 'string', required: true },
    enviarEmail: { type: 'boolean', required: false },
  }, additionalProperties : false }

const enviarOtp = async (req, res) => invokeController('enviarOtp', 201, req, res, 
  undefined, validationBodySchemaEnviarOtp,
  async reqX => AuthOtpService.enviarOtp(reqX, reqX.body))

const verificarOtp = async (req, res) => invokeController('verificarOtp', 201, req, res, 
  undefined, validationBodySchemaVerificarOtp,
  async reqX => AuthOtpService.verificarOtp(reqX, reqX.body))

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
