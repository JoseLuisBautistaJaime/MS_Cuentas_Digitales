import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
    BadRequestException,
    InternalServerException,
    CommonException,
    createMessageError
} from '../src/commons/exceptions'

chai.use(chaiAsPromised).should()

describe('throw BadRequestException', () => {
    it('throw BadRequestException', async () => {
        const message =
        {
            messaje: "Mensaje de error",
        }
        try {
            throw new BadRequestException(
                createMessageError('NMP-API-REDIS-400', { message })
            )
        } catch (err) {
            err.should.to.be.an.instanceof(BadRequestException)
        }
    })
})

describe('throw CommonException', () => {
    it('throw CommonException', async () => {
        const message =
        {
            messaje: "Mensaje de error",
        }
        try {
            throw new CommonException(
                createMessageError('NMP-API-REDIS-400', { message })
            )
        } catch (err) {
            err.should.to.be.an.instanceof(CommonException)
        }
    })
})

describe('throw InternalServerException', () => {
    it('throw InternalServerException', async () => {
        const message =
        {
            messaje: "Mensaje de error",
        }
        try {
            throw new InternalServerException(
                createMessageError('NMP-API-INTERMEDIARIO-500', { message })
            )
        } catch (err) {
            err.should.to.be.an.instanceof(InternalServerException)
        }
    })
})

