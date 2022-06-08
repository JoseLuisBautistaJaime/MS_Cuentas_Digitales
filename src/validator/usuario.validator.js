import { Validator } from 'jsonschema'

const ValidatorSchema = new Validator()
const usuarioRequest = {
  id: '/usuarioRequest',
  type: 'object',
  properties: {
    idCliente: {
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

const getEstatusActivacionRequest = {
  id: '/getEstatusActivacionRequest',
  type: 'object',
  properties: {
    idCliente: {
      type: 'string',
      required: true
    }
  }
}

const setEstatusActivacionRequest = {
  id: '/setEstatusActivacionRequest',
  type: 'object',
  properties: {
    idCliente: {
      type: 'string',
      required: true
    },
    estatusActivacion: {
      type: 'string',
      required: true
    }
  }
};

ValidatorSchema.addSchema(usuarioRequest, '/usuarioRequest');
ValidatorSchema.addSchema(setEstatusActivacionRequest,'/setEstatusActivacionRequest');
ValidatorSchema.addSchema(getEstatusActivacionRequest,'/getEstatusActivacionRequest');

export const UsuarioValidator = {
  ValidatorSchema,
  usuarioRequest,
  setEstatusActivacionRequest
}
export default UsuarioValidator
