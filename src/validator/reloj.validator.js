import { Validator } from 'jsonschema'

const validatorSchema = new Validator()

const minLength = 1
const maxLength = 100

const relojBusquedaSchema = {
  id: '/relojBusqueda',
  type: 'object',
  properties: {
    marca: {
      type: 'string',
      maxLength,
      required: true
    },
    modeloLinea: {
      type: 'string',
      minLength,
      maxLength
    },
    referencia: {
      type: 'string',
      minLength,
      maxLength
    },
    ultimaReferencia: {
      type: 'string',
      minLength,
      maxLength
    },
    ultimoModelo: {
      type: 'string',
      minLength,
      maxLength
    }
  },
  if: {
    properties: {
      modeloLinea: {
        const: ''
      }
    }
  },
  then: {
    properties: {
      referencia: {
        required: true
      }
    }
  }
}

const photography = {
  id: 'fotografia',
  type: 'object',
  properties: {
    locations: {
      type: 'array',
      items: {
        type: 'string',
        pattern: /^.+\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
      },
      minItems: 1,
      maxItems: 5,
      uniqueItems: true
    }
  }
}

validatorSchema.addSchema(relojBusquedaSchema, '/reloj')
validatorSchema.addSchema(photography, '/fotografia')

export const RelojValidator = {
  validatorSchema,
  relojBusquedaSchema,
  photography
}
