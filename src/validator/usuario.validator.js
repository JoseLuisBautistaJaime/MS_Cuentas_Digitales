import { Validator } from 'jsonschema'

const ValidatorSchema = new Validator()
const actializarUsuarioRequest = {
  id: '/actializarUsuarioRequest',
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
    appellidoPaterno: {
      type: 'string',
      required: true
    },
    appellidoMaterno: {
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

ValidatorSchema.addSchema(actializarUsuarioRequest, '/actializarUsuarioRequest');
ValidatorSchema.addSchema(setEstatusActivacionRequest,'/setEstatusActivacionRequest');
ValidatorSchema.addSchema(getEstatusActivacionRequest,'/getEstatusActivacionRequest');

export const UsuarioValidator = {
  ValidatorSchema,
  actializarUsuarioRequest,
  setEstatusActivacionRequest,
  getEstatusActivacionRequest
}
export default UsuarioValidator
