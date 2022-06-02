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

const otpSecret = '22222';

const healthCheck = async (req, res) => {
    return Response.Ok(res)
}

const generateOTP = async (req, res) => {
    LOG.info('CTRL: Starting generateOTP method')
    try {
        await CommonValidator.validateHeaderOAG(req)
        const usuario = req.body.usuario;

        const token_otp = _generateOTP(otpSecret,usuario,60,6);

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

        LOG.info('CTRL: Ending generateOTP method')
        return res.status(200).send(token_otp)
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
        return null;
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