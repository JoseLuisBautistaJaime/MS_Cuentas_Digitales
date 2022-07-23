import log4JS from 'log4js'

log4JS.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%[%-5.5p%]]-[%[%-10.10c%]] %m'
      }
    },
    controller: {
      type: 'dateFile',
      pattern: 'yyyy.MM.dd',
      alwaysIncludePattern: true,
      keepFileExt: true,
      filename: './logs/api.catalogos.log',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%[%-5.5p%]]-[%[%-10.10c%]] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out', 'controller'],
      level: process.env.LOG_LEVEL || 'info'
    }
  }
})

export const LOG = log4JS.getLogger('controller')
// LOG.level = process.env.LOG_LEVEL || 'info'
LOG.level = 'debug'
LOG.debugJSON = (message, json) => {
  LOG.debug(`${message}: ${JSON.stringify(json)}`)
}

LOG.reFatal = (message, json) => LOG.fatal(`\x1b[30m\x1b[41m${message}: ${JSON.stringify(json)}\x1b[0m`)
LOG.reWarn = (message, json) => {
  if (json === undefined) {
    LOG.warn(`\x1b[30m\x1b[43m${message}`)
  } else {
    LOG.warn(`\x1b[30m\x1b[43m${message}: ${JSON.stringify(json)}\x1b[0m`)
  }
}
const colorReMark = '\x1b[37m\x1b[44m'

export const reMark = (message, json) => {
  if (typeof json === 'undefined') {
    LOG.mark(`${colorReMark}${message}\x1b[0m`)
  } else {
    LOG.mark(`${colorReMark}${message}: ${JSON.stringify(json)}\x1b[0m`)
  }
}

export const info = message => LOG.info(message)

// LOG.reMark = (message, json) => LOG.mark(`\x1b[37m\x1b[44m${message}: ${JSON.stringify(json)}\x1b[0m`)

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
export const log = { info }
