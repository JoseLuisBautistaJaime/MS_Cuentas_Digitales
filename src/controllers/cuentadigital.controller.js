/*
 * Proyecto:        NMP - CUENTA DIGITAL.
 * Quarksoft S.A.P.I. de C.V. – Todos los derechos reservados. Para uso exclusivo de Nacional Monte de Piedad.
 */
import LOG from '../commons/logger'
import { Response } from '../commons/response'
import mongo from '../service/mongo.service'

const healthCheck = async (req, res) => {
    return Response.Ok(res)
}

export const  cuentaDigitalController = {
    healthCheck
}