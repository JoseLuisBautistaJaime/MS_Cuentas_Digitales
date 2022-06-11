import { Validator } from 'jsonschema'

const validatorSchema = new Validator()

const catalog = {
  id: '/catalog',
  type: 'object',
  properties: {
    catalogName: {
      type: 'string',
      minLength: 2,
      required: true
    },
    description: {
      type: 'string',
      maxLength: 150,
      required: true
    },
    directCatalogChilds: {
      type: 'array',
      required: false,
      uniqueItems: true,
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string', //  id del catálogo hijo
            required: true
          }
        }
      }
    }
  }
}

const catalogUpdate = {
  id: '/catalogUpdate',
  type: 'object',
  properties: {
    catalogName: {
      type: 'string',
      minLength: 2,
      required: false
    },
    description: {
      type: 'string',
      required: true
    }
  }
}

const registryAncestors = {
  type: 'array',
  required: false,
  uniqueItems: true,
  items: {
    type: 'object',
    properties: {
      registry: {
        type: 'string', //  id padre
        required: true
      },
      catalog: {
        type: 'string', //  catalogo padre
        required: true
      }
    }
  }
}

const registryPatternProperties = {
  '^[a-zA-Z]+.id$': {
    type: 'string',
    required: true
  },
  '^[a-zA-Z]+.description$': {
    type: 'string',
    required: true
  },
  '^[a-zA-Z]+.extendedDetail$': {
    type: 'object',
    required: false,
    additionalProperties: true
  }
}

const registry = {
  id: '/registry',
  type: 'object',
  properties: {
    catalogId: {
      type: 'string',
      required: true
    },
    ancestors: registryAncestors
  },
  patternProperties: registryPatternProperties,
  additionalProperties: false,
  minProperties: 3
}

const registryUpdate = {
  id: '/registryUpdate',
  type: 'object',
  properties: {
    ancestors: registryAncestors
  },
  patternProperties: registryPatternProperties,
  additionalProperties: false,
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

export const EPCatalogValidator = {
  validatorSchema,
  catalog,
  catalogUpdate,
  registry,
  registryUpdate,
  translate
}

export default null
