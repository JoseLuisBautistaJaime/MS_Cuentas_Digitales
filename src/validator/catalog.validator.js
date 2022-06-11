import { Validator } from 'jsonschema'

const validatorSchema = new Validator()

const catalog = {
  id: '/catalog',
  type: 'object',
  properties: {
    catalogName: {
      type: 'string',
      required: false
    },
    description: {
      type: 'string',
      maxLength: 150,
      required: true
    }
  }
}

const catalogUpdate = {
  id: '/catalogUpdate',
  type: 'object',
  properties: {
    description: {
      type: 'string',
      required: true
    }
  }
}

const registry = {
  id: '/registry',
  type: 'object',
  properties: {
    catalogId: {
      type: 'string',
      required: true
    }
  },
  patternProperties: {
    '^[a-zA-Z]+.id$': {
      type: 'string',
      required: true
    },
    '^[a-zA-Z]+.description$': {
      type: 'string',
      required: true
    }
  },
  additionalProperties: true,
  minProperties: 3
}

const registryUpdate = {
  id: '/registryUpdate',
  type: 'object',
  patternProperties: {
    '^[a-zA-Z]+.id$': {
      type: 'string',
      required: true
    },
    '^[a-zA-Z]+.description$': {
      type: 'string',
      required: true
    }
  },
  additionalProperties: true,
  minProperties: 1
}

const translate = {
  id: '/translate',
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        required: true,
        properties: {
          catalogId: {
            type: 'string',
            required: true
          },
          value: {
            type: 'string',
            required: true
          },
          origin: {
            type: 'string',
            required: true
          },
          destination: {
            type: 'string',
            required: true
          }
        }
      }
    }
  }
}

validatorSchema.addSchema(catalog, 'catalog')
validatorSchema.addSchema(catalogUpdate, 'catalogUpdate')
validatorSchema.addSchema(registry, '/registry')
validatorSchema.addSchema(registryUpdate, '/registryUpdate')
validatorSchema.addSchema(translate, 'translate')

export const CatalogValidator = {
  validatorSchema,
  catalog,
  catalogUpdate,
  registry,
  registryUpdate,
  translate
}

export default null
