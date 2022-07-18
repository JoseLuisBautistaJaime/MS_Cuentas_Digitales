/* eslint-disable max-classes-per-file */
export class ValidationHeaderException {
  constructor(message) {
    this.name = 'Header Validation'
    this.statusCode = 400
    this.exceptionCode = 40001
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class ValidationBodyException {
  constructor(message) {
    this.name = 'Body Validation'
    this.statusCode = 400
    this.exceptionCode = 40002
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class ValidationQueryException {
  constructor(message) {
    this.name = 'Query Validation'
    this.statusCode = 400
    this.exceptionCode = 40003
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}
