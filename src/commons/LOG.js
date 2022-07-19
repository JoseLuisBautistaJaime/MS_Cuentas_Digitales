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
LOG.debugJSON = (message, json) => {
  LOG.debug(`${message}: ${JSON.stringify(json)}`)
}

LOG.reFatal = (message, json) => LOG.debug(`\x1b[30m\x1b[41m${message}: ${JSON.stringify(json)}\x1b[0m`)
LOG.reWarn = (message, json) => LOG.debug(`\x1b[30m\x1b[43m${message}: ${JSON.stringify(json)}\x1b[0m`)
LOG.reMark = (message, json) => LOG.debug(`\x1b[37m\x1b[44m${message}: ${JSON.stringify(json)}\x1b[0m`)

LOG.test = (message, json) => {
  LOG.debug(`\x1b[30m\x1b[41m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[37m\x1b[41m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[30m\x1b[45m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[37m\x1b[45m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[30m\x1b[44m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[37m\x1b[44m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[30m\x1b[43m${message}: ${JSON.stringify(json)}\x1b[0m`)
  LOG.debug(`\x1b[37m\x1b[43m${message}: ${JSON.stringify(json)}\x1b[0m`)
}

export default LOG
