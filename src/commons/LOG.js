import log4JS from 'log4js'

log4JS.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}] [%[%-5.5p%]] - [%[%-8c%]] %m'
      }
    },
    cuentasdigitales: {
      type: 'dateFile',
      pattern: 'yyyy.MM.dd',
      alwaysIncludePattern: true,
      keepFileExt: true,
      filename: './logs/api.catalogos.log',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}] [%[%-5.5p%]] - [%[%-8c%]] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out', 'cuentasdigitales'],
      level: process.env.LOG_LEVEL || 'info'
    }
  }
})

const LOG = log4JS.getLogger('cuentasdigitales')
LOG.level = process.env.LOG_LEVEL || 'info'

export default LOG
