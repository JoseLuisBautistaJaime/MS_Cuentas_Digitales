import { Validator } from 'jsonschema'

const ValidatorSchema = new Validator()

const paperlessRequest = {
  id: '/paperlessRequest',
  type: 'object',
  properties: {
    informacionCliente: {
      type: 'object',
      required: true,
      properties: {
        noCredencial: {
          type: 'string',
          required: true
        },
        idCliente: {
          type: "integer",
          required: true
        },
        nombre: {
          type: 'string',
          required: true
        },
        aPaterno: {
          type: 'string',
          required: true
        },
        aMaterno: {
          type: 'string',
          required: false
        },
        nivelCliente: {
          type: 'string',
          required: true
        },
        correo: {
          type: 'string',
          required: true
        },
        genero: {
          type: 'string',
          required: false
        },
        rfc: {
          type: 'string',
          required: false
        },
        telefono: {
          type: 'string',
          required: false
        },
        calificacion: {
          type: 'object',
          required: false,
          properties: {
            aforo: {
              type: 'number',
              required: false
            },
            sobreAforo: {
              type: 'number',
              required: false
            }
          }
        }
      }
    },
    informacionValuador: {
      type: 'object',
      required: true,
      properties: {
        nombre: {
          type: 'string',
          required: true
        },
        aPaterno: {
          type: 'string',
          required: true
        },
        aMaterno: {
          type: 'string',
          required: false
        }
      }
    },
    bien: {
      type: 'object',
      required: false,
      properties: {
        tipoBien: {
          type: 'string',
          required: false
        },
        articulo: {
          type: 'string',
          required: false
        },
        categorias: {
          type: 'object',
          required: true,
          properties: {
            canal: {
              type: 'object',
              required: true,
              properties: {
                nombreCanal: {
                  type: 'string',
                  required: true
                },
                guidCanal: {
                  type: 'string',
                  required: true
                }
              }
            },
            categoriaCanal: {
              type: 'string',
              required: false
            }
          }
        },
        descripcion: {
          type: 'string',
          required: false
        },
        imagenBien: {
          type: 'string',
          required: false
        },
        guidBien: {
          type: 'integer',
          required: true
        },
        noBoleta: {
          type: 'string',
          required: false
        },
        prestamoSobreAvaluo: {
          type: 'number',
          required: false
        },
        avaluo: {
          type: 'object',
          required: false,
          properties: {
            ramo: {
              type: 'string',
              required: true
            },
            subramo: {
              type: 'string',
              required: true
            },
            rango: {
              type: 'string',
              required: true
            },
            metal: {
              type: 'string',
              required: false
            },
            kilates: {
              type: 'integer',
              required: false
            },
            numeroDeposito: {
              type: 'integer',
              required: true
            }
          }
        }
      }
    }
  }
}

const proyeccionesRequest = {
  id: '/proyeccionesRequest',
  type: 'object',
  properties: {
    bienes: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          guidBien: {
            type: 'integer',
            required: true
          },
          noBoleta: {
            type: 'string',
            required: true
          }
          ,
          prestamoSobreAvaluo: {
            type: 'number',
            required: true
          },
          proyecciones: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              properties: {
                importe: {
                  type: 'number',
                  required: true
                },
                intereses: {
                  type: 'number',
                  required: true
                },
                almacenaje: {
                  type: 'integer',
                  required: true
                },
                iva: {
                  type: 'number',
                  required: true
                },
                refrendo: {
                  type: 'number',
                  required: true
                },
                montoTotal: {
                  type: 'number',
                  required: true
                }
                ,
                fecha: {
                  type: 'string',
                  required: true
                }
              }
            }
          }
        }
      }
    }
  }
}
const contratosRequest = {
  id: '/contratosRequest',
  type: 'object',
  properties: {
    bienes: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          contrato: {
            type: 'string',
            required: true
          },
          guidBien: {
            type: 'integer',
            required: true
          },
          nombreDocumento: {
            type: 'string',
            required: true
          },
          talon: {
            type: 'string',
            required: true
          }
        }
      }
    },
    firmaValuador: {
      type: 'string',
      required: false
    },
    noBienes: {
      type: 'integer',
      required: false
    }
  }
}
const referenciaRequest = {
  id: '/referenciaRequest',
  type: 'object',
  properties: {
    referencia: {
      type: 'string',
      required: true
    }
  }
}

const contratoImageRequest = {
  id: '/contratoImageRequest',
  type: 'object',
  properties: {
    contrato: {
      type: 'string',
      required: true
    },
    talon: {
      type: 'string',
      required: true
    }
  }
}

ValidatorSchema.addSchema(paperlessRequest, '/paperlessRequest')
ValidatorSchema.addSchema(proyeccionesRequest, '/proyeccionesRequest')
ValidatorSchema.addSchema(contratosRequest, '/contratosRequest')
ValidatorSchema.addSchema(referenciaRequest, '/referenciaRequest')
ValidatorSchema.addSchema(contratoImageRequest, '/contratoImageRequest')

export const PaperlessValidator = {
  ValidatorSchema,
  paperlessRequest,
  proyeccionesRequest,
  contratosRequest,
  referenciaRequest,
  contratoImageRequest
}

export default null