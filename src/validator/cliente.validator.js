import { Validator } from 'jsonschema'

const ValidatorSchema = new Validator()
const clienteRequest = {
  id: '/clienteRequest',
  type: 'object',
  properties: {
    idCliente: {
      type: 'string',
      required: true
    },
    idDevice: {
      type: 'string',
      required: true
    },
    tarjetaMonte: {
      type: 'string',
      required: true
    },
    nombreCliente: {
      type: 'string',
      required: true
    },
    apellidoPaterno: {
      type: 'string',
      required: true
    },
    apellidoMaterno: {
      type: 'string',
      required: true
    }
  }
}

const getStatusActivacionRequest = {
  id: '/getStatusActivacionRequest',
  type: 'object',
  properties: {
    idCliente: {
      type: 'string',
      required: true
    }
  }
}

const setStatusActivacionRequest = {
  id: '/setStatusActivacionRequest',
  type: 'object',
  properties: {
    idCliente: {
      type: 'string',
      required: true
    },
    statusActivacion: {
      type: 'number',
      required: true
    }
  }
};

ValidatorSchema.addSchema(clienteRequest, '/clienteRequest')
ValidatorSchema.addSchema(
  setStatusActivacionRequest,
  '/setStatusActivacionRequest'
)
ValidatorSchema.addSchema(
  getStatusActivacionRequest,
  '/getStatusActivacionRequest'
)

export const ClienteValidator = {
  ValidatorSchema,
  clienteRequest,
  setStatusActivacionRequest
}
export default ClienteValidator
