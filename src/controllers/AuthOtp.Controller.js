/* eslint-disable prettier/prettier */
import { AuthOtpService } from '../services/AuthOtp.Service'
import { invokeController } from '../commons/invokeController'

const validationQuerySchemaCliente = { properties: { 
  idCliente: { type: 'string', required: true },
}, additionalProperties : false}

const validationBodySchemaEnviarOtp = {properties: { 
    modoEnvio: { type: 'string', enum: ['sms','email'], required: true },
  }, additionalProperties : false }

const validationBodySchemaVerificarOtp = {properties: { 
    codigoOtp: { type: 'string', required: true },
    enviarEmail: { type: 'boolean', required: false },
  }, additionalProperties : false }

const enviarOtp = async (req, res) => invokeController('enviarOtp', 201, req, res, 
  validationQuerySchemaCliente, validationBodySchemaEnviarOtp,
  async reqX => AuthOtpService.enviarOtp(reqX.query.idCliente, reqX.body,reqX))

const verificarOtp = async (req, res) => invokeController('verificarOtp', 201, req, res, 
  validationQuerySchemaCliente, validationBodySchemaVerificarOtp,
  async reqX => AuthOtpService.verificarOtp(reqX.query.idCliente, reqX.body,reqX))

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
