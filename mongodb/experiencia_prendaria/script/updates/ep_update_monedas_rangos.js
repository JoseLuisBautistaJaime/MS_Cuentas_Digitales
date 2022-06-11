/* eslint-disable */

/**
 * Script para actualizar la colección de Rangos de Monedas
 */

print('---Experiencia Prendaria---')

db = db.getSiblingDB('ibmclouddb')

print('Base de Datos: ', db)

/**
 * Se hace un borrado lógico del registro Monedas sin Oro
 */

print(':::Actualización de rangos de monedas:::')

db.catalog_monedas_rangos.update(
  {
    "ExpPrendaria.description": "Monedas sin Oro"
  },
  {
    $set: {
      "active": false
    }
  }
)

print(':::Rangos de monedas actualizados:::')
