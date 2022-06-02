// context API
export const { CONTEXT_NAME } = process.env
export const { CONTEXT_VERSION } = process.env
export const { LOG_LEVEL } = process.env
export const { URL_OAUTH_VALIDATOR } = process.env
// Operation Status
export const SUCCESS = 'SUCCESS'
export const NOT_FOUND = 'NOT FOUND'
export const BAD_REQUEST = 'BAD REQUEST'
export const UNAUTHORIZED = 'UNAUTHORIZED'
export const INTERNAL_SERVER_ERROR = 'INTERNAL SERVER ERROR'

// Headers
export const HEADER_OAUTH = 'oauth.bearer'
export const HEADER_ID_CONSUMIDOR = 'idConsumidor'
export const HEADER_ID_DESTINO = 'idDestino'
export const HEADER_USUARIO = 'usuario'
export const HEADER_AUTHORIZATION = 'Authorization'

// Operation Code
export const CODE_SUCCESS = 'NMP-API-CUENTADIGITAL-200'
export const CODE_NO_CONTENT = 'NMP-API-CUENTADIGITAL-204'
export const CODE_BAD_REQUEST = 'NMP-API-CUENTADIGITAL-400'
export const CODE_UNAUTHORIZED = 'NMP-API-CUENTADIGITAL-401'
export const CODE_FORBIDDEN = 'NMP-API-CUENTADIGITAL-403'
export const CODE_NOT_FOUND = 'NMP-API-CUENTADIGITAL-404'
export const CODE_INTERNAL_SERVER_ERROR = 'NMP-API-CUENTADIGITAL-500'
export const CODE_INTERNAL_BAD_GETAWAY = 'NMP-API-CUENTADIGITAL-502'

// Messages
export const MESSAGE_SUCCESS = 'Se ha realizado correctamente la operación'
export const MESSAGE_EXITOSO = 'Resultado Exitoso'
export const MESSAGE_ERROR = "Ocurrio un error ne la generación de la información"