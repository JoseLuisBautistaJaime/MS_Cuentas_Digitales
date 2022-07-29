import log4JS from 'log4js'

log4JS.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%[%-5.5p%]]-[%[%-10.10c%]] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.LOG_LEVEL || 'info'
    }
  }
})

export const LOG = log4JS.getLogger('tests')
LOG.level = 'debug'

const genMessage = (message, _json, colorStyle) => {
  if (typeof _json === 'undefined') {
    LOG.mark(`${colorStyle}${message}\x1b[0m`)
  } else {
    LOG.mark(`${colorStyle}${message}: ${JSON.stringify(_json)}\x1b[0m`)
  }
}

export const log = {
  reWarn: (message, _json) => genMessage(message, _json, '\x1b[30m\x1b[43m'),
  reMark: (message, _json) => genMessage(message, _json, '\x1b[37m\x1b[44m'),
  reFatal: (message, _json) => genMessage(message, _json, '\x1b[30m\x1b[41m'),
  info: message => LOG.info(message),
  debug: message => LOG.debug(message)
}
