export const RELOJ_API_CONSTANTS = {
  HOST: process.env.RELOJ_API_HOST,
  ROOT_URL: '/',
  URL_BASE: '/NMP',
  FTP_HOST: process.env.FTP_HOST,
  FTP_USER: process.env.FTP_USER,
  FTP_PASSWORD: process.env.FTP_PASSWORD,
  FTP_PORT: process.env.FTP_PORT,
  FTP_ROOT: process.env.FTP_ROOT || '',
  ENDPOINTS: {
    CATALOGOS: {
      URL_BASE: '/GestionCatalogos/Relojes',
      MARCAS: '/MARCA',
      MODELOS: '/MODELO'
    },
    BUSQUEDA: {
      URL_BASE: '/OperacionPrendaria/Relojes',
      INFORMACION: '/informacionRelojes'
    }
  },
  HEADERS_BUSQUEDA: {
    idDestino: 22,
    usuario: 'midas',
    idConsumidor: 17
  }
}
