export const MESSAGES = {
  'NMP-API-CUENTADIGITAL-200': {
    template: 'SUCCESS',
    description: 'Se ha realizado correctamente la operación'
  },
  'NMP-API-CUENTADIGITAL-204': {
    template: 'NO CONTENT',
    description: 'Se ha realizado correctamente la operación'
  },
  'NMP-API-CUENTADIGITAL-400': {
    template: '<%= message %>',
    description: 'Petición mal formada.'
  },
  'NMP-API-CUENTADIGITAL-401': {
    description: 'Se ha producido un error de autorización'
  },
  'NMP-API-CUENTADIGITAL-403': {
    description: 'Se ha producido un error de autorización'
  },
  'NMP-API-CUENTADIGITAL-404': {
    description: 'No se encontraron resultados.'
  },
  'NMP-API-CUENTADIGITAL-500': {
    template: '<%= text %>',
    description: 'Error interno del servidor.'
  },
  'NMP-API-CUENTADIGITAL-502': {
    template: 'BAD GETAWAY',
    description: 'Error interno del servidor.'
  }
}

export default null
