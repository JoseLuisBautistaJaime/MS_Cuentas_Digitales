export const TEST_CLIENTE = '9999'
export const TEST_CLIENTE_DATA = {
  idCliente: TEST_CLIENTE,
  idDevice: '74312734d5403d54',
  tarjetaMonte: '11111',
  nombreCliente: 'ricoff',
  apellidoPaterno: 'CARRILLO',
  apellidoMaterno: 'LOPEZF',
  correoCliente: 'rigocl@hotmail.com',
  celularCliente: '6731143889'
}
export const HEADER = {
  AUTHORIZATION: 'Basic zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz=',
  IDCONSUMIDOR: 99,
  IDDESTINO: 99,
  USUARIO: 'test',
  AUTHBEARER: 'xxxxxxxxxxxx='
}

export const TEST_LISTHEADER_OAG = [
  { name: 'Authorization', value: HEADER.AUTHORIZATION },
  { name: 'oauth.bearer', value: HEADER.AUTHBEARER },
  { name: 'idConsumidor', value: HEADER.IDCONSUMIDOR },
  { name: 'idDestino', value: HEADER.IDDESTINO },
  { name: 'usuario', value: HEADER.USUARIO }
]
