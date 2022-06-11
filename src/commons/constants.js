// Context API
export const { CONTEXT_NAME } = process.env
export const { CONTEXT_VERSION } = process.env

// Headers
export const HEADER_OAUTH = 'oauth.bearer'
export const HEADER_ID_CONSUMIDOR = 'idConsumidor'
export const HEADER_ID_DESTINO = 'idDestino'
export const HEADER_USUARIO = 'usuario'
export const HEADER_AUTHORIZATION = 'Authorization'
export const HEADER_ID_CLIENTE = 'idCliente'

// Operation Status
export const CREATED = 'CREATED'
export const SUCCESS = 'SUCCESS'
export const NOT_FOUND = 'NOT FOUND'
export const BAD_REQUEST = 'BAD REQUEST'
export const CONFLICT = 'CONFLICT'
export const INTERNAL_SERVER_ERROR = 'INTERNAL SERVER ERROR'

// Operation Code
export const CODE_SUCCESS = 'NMP.CUENTASDIGITALES.200'
export const CODE_CREATED = 'NMP.CUENTASDIGITALES.201'
export const CODE_NO_CONTENT = 'NMP.CUENTASDIGITALES.204'
export const CODE_BAD_REQUEST = 'NMP.CUENTASDIGITALES.400'
export const CODE_NOT_FOUND = 'NMP.CUENTASDIGITALES.404'
export const CODE_CONFLICT = 'NMP.CUENTASDIGITALES.409'
export const CODE_INTERNAL_SERVER_ERROR = 'NMP.CUENTASDIGITALES.500'

export const { URL_BASE_API_CLIENTES } = process.env

export const { AUTHORIZATION } = process.env

// Operation Page
export const PERPAGE = 50
export const CODE_BAD_GATEWAY = 'NMP.CUENTASDIGITALES.502'
export const CODE_SERVICE_UNAVAILABLE = 'NMP.CUENTASDIGITALES.503'
export const CODE_GATEWAY_TIMEOUT = 'NMP.CUENTASDIGITALES.504'
