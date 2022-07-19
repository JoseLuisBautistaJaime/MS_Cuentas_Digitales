/* eslint-disable prettier/prettier */
import { AuthOtpService } from '../services/AuthOtp.Service'
import { UController } from '../commons/UController'

const validationBodySchemaEnviarOtp = {properties: { 
    idCliente: { type: 'string', required: true },
    modoEnvio: { type: 'string', enum: ['sms','email'], required: true },
  }, additionalProperties : false }

const validationBodySchemaVerificarOtp = {properties: { 
    idCliente: { type: 'string', required: true },
    codigoOtp: { type: 'string', required: true },
    enviarEmail: { type: 'boolean', required: false },
  }, additionalProperties : false }

const enviarOtp = async (req, res) => UController.invoke(
  'enviarOtp', 201, req, res, 
  true, undefined, validationBodySchemaEnviarOtp,
  async reqX => AuthOtpService.enviarOtp(reqX, reqX.body))

  const verificarOtp = async (req, res) => UController.invoke(
    'verificarOtp', 201, req, res, 
    true, undefined, validationBodySchemaVerificarOtp,
    async reqX => AuthOtpService.verificarOtp(reqX, reqX.body))

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
