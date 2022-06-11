/* eslint-disable */

/**
 * Script para actualizar la colección de Tipos de Hechura
 */

print('---Experiencia Prendaria---')

db = db.getSiblingDB('ibmclouddb')

print('Base de Datos: ', db)

/**
 * Se agrega el campo calidad_oro para hacer el filtro por kilataje
 */

print(':::Actualización de tipos de hechura:::')

db.catalog_hechura_tipos.update(
  {
    "ExpPrendaria.extendedDetail.abreviatura": "F1"
  },
  {
    $set: {
      "ExpPrendaria.extendedDetail.calidad_oro": [ 
          NumberInt(8),
          NumberInt(10),
          NumberInt(12),
          NumberInt(14),
          NumberInt(16),
          NumberInt(18),
          NumberInt(22),
          NumberInt(24)
      ]
    }
  }
)

db.catalog_hechura_tipos.update(
  {
    "ExpPrendaria.extendedDetail.abreviatura": "F2"
  },
  {
    $set: {
      "ExpPrendaria.extendedDetail.calidad_oro": [ 
          NumberInt(8),
          NumberInt(10),
          NumberInt(12),
          NumberInt(14),
          NumberInt(16),
          NumberInt(18),
          NumberInt(22),
          NumberInt(24)
      ]
    }
  }
)

db.catalog_hechura_tipos.update(
  {
    "ExpPrendaria.extendedDetail.abreviatura": "F3"
  },
  {
    $set: {
      "ExpPrendaria.extendedDetail.calidad_oro": [ 
          NumberInt(8),
          NumberInt(10),
          NumberInt(12),
          NumberInt(14),
          NumberInt(16),
          NumberInt(18),
          NumberInt(22),
          NumberInt(24)
      ]
    }
  }
)

db.catalog_hechura_tipos.update(
  {
    "ExpPrendaria.extendedDetail.abreviatura": "F4"
  },
  {
    $set: {
      "ExpPrendaria.extendedDetail.calidad_oro": [ 
          NumberInt(8),
          NumberInt(10),
          NumberInt(12),
          NumberInt(14),
          NumberInt(16),
          NumberInt(18),
          NumberInt(22),
          NumberInt(24)
      ]
    }
  }
)

db.catalog_hechura_tipos.update(
  {
    "ExpPrendaria.extendedDetail.abreviatura": "F5"
  },
  {
    $set: {
      "ExpPrendaria.extendedDetail.calidad_oro": [
          NumberInt(10),
          NumberInt(12),
          NumberInt(14),
          NumberInt(16),
          NumberInt(18),
          NumberInt(22),
          NumberInt(24)
      ]
    }
  }
)

db.catalog_hechura_tipos.update(
  {
    "ExpPrendaria.extendedDetail.abreviatura": "F6"
  },
  {
    $set: {
      "ExpPrendaria.extendedDetail.calidad_oro": [
          NumberInt(18),
          NumberInt(22),
          NumberInt(24)
      ]
    }
  }
)

print(':::Tipos de hechura actualizados:::')
