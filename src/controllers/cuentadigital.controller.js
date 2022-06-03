/*
 * Proyecto:        NMP - CUENTA DIGITAL.
 * Quarksoft S.A.P.I. de C.V. – Todos los derechos reservados. Para uso exclusivo de Nacional Monte de Piedad.
 */
import LOG from '../commons/logger'
import { Response } from '../commons/response'
import * as OTPAuth from 'otpauth'
import mongo from '../service/mongo.service'
import { CommonValidator } from '../validator/common.validator'
import { CODE_INTERNAL_SERVER_ERROR, MESSAGE_ERROR } from '../constansts'
import handlerError from '../validator/handler-error'
import { CuentaDigitalValidator } from '../validator/cuentadigital.validator'
import { handlerErrorValidation } from '../validator/message.mapping'
import { ComunicacionesController } from './comunicaciones.controller'

const otpSecret = '22222';

const healthCheck = async (req, res) => {
    return Response.Ok(res)
}

const generateOTP = async (req, res) => {
    LOG.info('CTRL: Starting generateOTP method')
    try {
        await CommonValidator.validateHeaderOAG(req)

        const validator = CuentaDigitalValidator.ValidatorSchema.validate(
            req.body,
            CuentaDigitalValidator.generateOPTRequest
        )
        if (validator.errors.length) handlerErrorValidation(validator)
    
        const usuario = req.body.usuario;

        const token_otp = await _generateOTP(otpSecret,usuario,60,6);

        LOG.debugJSON('CTRL token_otp', token_otp)

        if (token_otp === null || token_otp === "") {
            const controlExcepcion = {
                codigo: CODE_INTERNAL_SERVER_ERROR,
                mensaje: MESSAGE_ERROR
              }
      
              const response = {
                controlExcepcion
              }
              return res.status(500).send(response)
        }

        const destinatario = req.body.destinatario 
        if (req.body.tipo === 'EMAIL') {
            ComunicacionesController.enviarCodigoEMAIL(req, destinatario, token_otp)
        } else {
            ComunicacionesController.enviarCodigoSMS(req, destinatario, token_otp)
        }

        const response = {
            codigoVerificacion: token_otp
        }
        LOG.info('CTRL: Ending generateOTP method')
        return res.status(200).send(response)
    } catch (err) {
        LOG.error(err)
        return handlerError(res, err)
    }
};

const  _generateOTP = async (secretA, usuario, periodo, digits) => {
    const secretX = secretA + usuario;
    try {
        let totp = new OTPAuth.TOTP({
            issuer: 'NMP', label: 'experiencia2', algorithm: 'SHA512',
            digits: digits,  period: periodo, secret: secretX
        });
        return totp.generate();
    } catch(err) {
        LOG.error(err)
        return '0000';
    }
    
}

const validateOTP = async (req,res) => {
    let usuario = req.body.usuario;
    let token_otp = req.body.otp;

    Response.Ok(res)
}

export const  cuentaDigitalController = {
    healthCheck,
    generateOTP,
    validateOTP
}