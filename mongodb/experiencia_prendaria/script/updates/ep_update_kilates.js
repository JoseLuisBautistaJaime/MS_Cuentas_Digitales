/* eslint-disable */

/**
 * Script para actualizar la colección Kilates
 */

print('---Experiencia Prendaria---')

db = db.getSiblingDB('ibmclouddb')

print('Base de Datos: ', db)

/**
 * Se hace un borrado lógico del registro 21 kilates
 */

print(':::Actualización de kilates:::')

db.catalog_kilates.update(
  {
    "ExpPrendaria.extendedDetail.calidad": "21_Q"
  },
  {
    $set: {
      "active": false
    }
  }
)

print(':::Kilates actualizados:::')
