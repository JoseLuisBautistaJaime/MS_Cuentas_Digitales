import { Validator } from 'jsonschema';

const ValidatorSchema = new Validator()

const generateOPTRequest = {
    id: '/generateOPTRequest',
    type: 'object',
    properties: {
        usuario: {
            type: 'string',
            required: true
        },
        tipo: {
            type: 'string',
            required: true
        },
        destinatario: {
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