import { Validator } from 'jsonschema'

const ValidatorSchema = new Validator()

const sendOtpRequest = {
  id: '/sendOtpRequest',
  type: 'object',
  properties: {
    idCliente: {
      type: 'string',
      required: true
    },
    modeSend: {
      type: 'string',
      required: true
    }
  }
}

ValidatorSchema.addSchema(sendOtpRequest, '/sendOtpRequest')

export const CuentaDigitalValidator = {
  ValidatorSchema,
  sendOtpRequest
}