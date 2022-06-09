import { Validator } from 'jsonschema';

const ValidatorSchema = new Validator()

const generateOPTRequest = {
    id: '/generateOPTRequest',
    type: 'object',
    properties: {
        idCliente: {
            type: 'string',
            required: true
        },
        tipo: {
            type: 'string',
            required: true
        }
    }
}

ValidatorSchema.addSchema(generateOPTRequest, '/generateOPTRequest')

export const CuentaDigitalValidator = {
    ValidatorSchema,
    generateOPTRequest
}