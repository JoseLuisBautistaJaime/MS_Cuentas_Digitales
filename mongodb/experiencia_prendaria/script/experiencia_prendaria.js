/* eslint-disable */
print('---Experiencia Prendaria---')

db = db.getSiblingDB('ibmclouddb')

print('Base de Datos: ', db)

print(':::Creación de catálogos:::')

db.ep_catalogs.insert([
  {
    "_id" : ObjectId("5fda4cdc5b0d1e3db4609c1e"),
    "active" : true,
    "catalogName" : "ramos",
    "description" : "Catálogo de Ramos para Avalúos",
    "directCatalogChilds" : [ 
      {
        "_id" : ObjectId("5fda4ce05b0d1e3db4609c1f")
      }
    ],
    "createdAt" : ISODate("2020-12-16T18:07:24.152Z"),
    "updatedAt" : ISODate("2020-12-16T18:39:31.408Z")
  },
  {
    "_id" : ObjectId("5fda4ce05b0d1e3db4609c1f"),
    "active" : true,
    "catalogName" : "subramos",
    "description" : "Catálogo de Subramos para Avalúos",
    "directCatalogChilds" : [],
    "createdAt" : ISODate("2020-12-16T18:07:28.760Z"),
    "updatedAt" : ISODate("2020-12-16T18:07:28.760Z")
  },
  {
    "_id" : ObjectId("5fda4ce35b0d1e3db4609c20"),
    "active" : true,
    "catalogName" : "metales",
    "description" : "Catálogo de Metales",
    "directCatalogChilds" : [],
    "createdAt" : ISODate("2020-12-16T18:07:31.108Z"),
    "updatedAt" : ISODate("2020-12-16T18:07:31.108Z")
  },
  {
    "_id" : ObjectId("5fda4ce55b0d1e3db4609c21"),
    "active" : true,
    "catalogName" : "kilates",
    "description" : "Catálogo de Kilates",
    "directCatalogChilds" : [],
    "createdAt" : ISODate("2020-12-16T18:07:33.053Z"),
    "updatedAt" : ISODate("2020-12-16T18:07:33.053Z")
  },
  {
    "_id" : ObjectId("5fda4d055b0d1e3db4609c22"),
    "active" : true,
    "catalogName" : "monedas_rangos",
    "description" : "Catálogo de Rangos para Monedas",
    "directCatalogChilds" : [],
    "createdAt" : ISODate("2020-12-16T18:08:05.802Z"),
    "updatedAt" : ISODate("2020-12-16T18:08:05.802Z")
  },
  {
    "_id" : ObjectId("5fda4d075b0d1e3db4609c23"),
    "active" : true,
    "catalogName" : "monedas_tipos",
    "description" : "Catálogo de Tipos de Monedas",
    "directCatalogChilds" : [],
    "createdAt" : ISODate("2020-12-16T18:08:07.996Z"),
    "updatedAt" : ISODate("2020-12-16T18:08:07.996Z")
  },
  {
    "_id" : ObjectId("5ff37613840d7e1d80a67155"),
    "active" : true,
    "catalogName" : "hechura_tipos",
    "description" : "Catálogo de Tipos de Hechura o Condición del Artículo",
    "directCatalogChilds" : [],
    "createdAt" : ISODate("2021-01-04T20:03:09.427Z"),
    "updatedAt" : ISODate("2021-01-04T20:03:09.427Z")
  }
],{ ordered: true })

print(':::Catálogos creados:::')

print(':::Creación de ramos:::')

db.catalog_ramos.insert([
  {
    "_id" : ObjectId("5fda4d145b0d1e3db4609c24"),
    "active" : true,
    "catalogId" : "5fda4cdc5b0d1e3db4609c1e",
    "ExpPrendaria" : {
        "id" : "AL",
        "description" : "Alhajas",
        "lastUpdated" : "2020-12-16T18:08:20.711Z"
    },
    "createdAt" : ISODate("2020-12-16T18:08:20.721Z"),
    "updatedAt" : ISODate("2020-12-16T18:08:20.721Z")
  },
  {
    "_id" : ObjectId("5fda4d195b0d1e3db4609c25"),
    "active" : true,
    "catalogId" : "5fda4cdc5b0d1e3db4609c1e",
    "ExpPrendaria" : {
        "id" : "VE",
        "description" : "Vehículos",
        "lastUpdated" : "2020-12-16T18:08:25.320Z"
    },
    "createdAt" : ISODate("2020-12-16T18:08:25.322Z"),
    "updatedAt" : ISODate("2020-12-16T18:08:25.322Z")
  },
  {
    "_id" : ObjectId("5fda4d1d5b0d1e3db4609c26"),
    "active" : true,
    "catalogId" : "5fda4cdc5b0d1e3db4609c1e",
    "ExpPrendaria" : {
        "id" : "RJ",
        "description" : "Relojes",
        "lastUpdated" : "2020-12-16T18:08:29.835Z"
    },
    "createdAt" : ISODate("2020-12-16T18:08:29.837Z"),
    "updatedAt" : ISODate("2020-12-16T18:08:29.837Z")
  },
  {
    "_id" : ObjectId("5fda4d225b0d1e3db4609c27"),
    "active" : true,
    "catalogId" : "5fda4cdc5b0d1e3db4609c1e",
    "ExpPrendaria" : {
        "id" : "MN",
        "description" : "Monedas",
        "lastUpdated" : "2020-12-16T18:08:34.391Z"
    },
    "createdAt" : ISODate("2020-12-16T18:08:34.398Z"),
    "updatedAt" : ISODate("2020-12-16T18:08:34.398Z")
  }
], { ordered: true })

print(':::Ramos creados:::')

print(':::Creación de subramos:::')

db.catalog_subramos.insert([
  {
    "_id" : ObjectId("5fda54635b0d1e3db4609c4a"),
    "active" : true,
    "catalogId" : "5fda4ce05b0d1e3db4609c1f",
    "ExpPrendaria" : {
        "id" : "RJM",
        "description" : "Reloj de Marca",
        "lastUpdated" : "2020-12-16T18:39:31.385Z"
    },
    "ancestors" : [ 
        {
            "catalog" : "ramos",
            "registry" : "5fda4d1d5b0d1e3db4609c26"
        }
    ],
    "createdAt" : ISODate("2020-12-16T18:39:31.392Z"),
    "updatedAt" : ISODate("2020-12-16T18:39:31.392Z")
  },
  {
    "_id" : ObjectId("5fda548d5b0d1e3db4609c4c"),
    "active" : true,
    "catalogId" : "5fda4ce05b0d1e3db4609c1f",
    "ExpPrendaria" : {
        "id" : "RJO",
        "description" : "Reloj de Oro",
        "lastUpdated" : "2020-12-16T18:40:13.394Z"
    },
    "ancestors" : [ 
        {
            "catalog" : "ramos",
            "registry" : "5fda4d1d5b0d1e3db4609c26"
        }
    ],
    "createdAt" : ISODate("2020-12-16T18:40:13.404Z"),
    "updatedAt" : ISODate("2020-12-16T18:40:13.404Z")
  }
], { ordered: true })

print(':::Subramos creados:::')

print(':::Creación de metales:::')

db.catalog_metales.insert([
  {
    "_id" : ObjectId("5fda4d925b0d1e3db4609c28"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "1",
        "description" : "Oro Amarillo",
        "extendedDetail": {
          "abreviatura": "MP"
        },
        "lastUpdated" : "2020-12-16T18:10:26.559Z"
    },
    "createdAt" : ISODate("2020-12-16T18:10:26.563Z"),
    "updatedAt" : ISODate("2020-12-16T18:10:26.563Z")
  },
  {
    "_id" : ObjectId("5fda4da35b0d1e3db4609c29"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "2",
        "description" : "Oro Blanco",
        "extendedDetail": {
          "abreviatura": "MP"
        },
        "lastUpdated" : "2020-12-16T18:10:43.771Z"
    },
    "createdAt" : ISODate("2020-12-16T18:10:43.776Z"),
    "updatedAt" : ISODate("2020-12-16T18:10:43.776Z")
  },
  {
    "_id" : ObjectId("5fda4dd45b0d1e3db4609c2a"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "3",
        "description" : "Platino",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:11:32.125Z"
    },
    "createdAt" : ISODate("2020-12-16T18:11:32.132Z"),
    "updatedAt" : ISODate("2020-12-16T18:11:32.132Z")
  },
  {
    "_id" : ObjectId("5fda4def5b0d1e3db4609c2b"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "4",
        "description" : "Plata 0.999",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:11:59.671Z"
    },
    "createdAt" : ISODate("2020-12-16T18:11:59.673Z"),
    "updatedAt" : ISODate("2020-12-16T18:11:59.673Z")
  },
  {
    "_id" : ObjectId("5fda4e085b0d1e3db4609c2c"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "5",
        "description" : "Plata 0.925",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:12:24.374Z"
    },
    "createdAt" : ISODate("2020-12-16T18:12:24.377Z"),
    "updatedAt" : ISODate("2020-12-16T18:12:24.377Z")
  },
  {
    "_id" : ObjectId("5fda4e295b0d1e3db4609c2d"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "6",
        "description" : "Plata 0.720",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:12:57.829Z"
    },
    "createdAt" : ISODate("2020-12-16T18:12:57.835Z"),
    "updatedAt" : ISODate("2020-12-16T18:12:57.835Z")
  },
  {
    "_id" : ObjectId("5fda4e4f5b0d1e3db4609c2e"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "7",
        "description" : "Plata 0.500",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:13:35.429Z"
    },
    "createdAt" : ISODate("2020-12-16T18:13:35.435Z"),
    "updatedAt" : ISODate("2020-12-16T18:13:35.435Z")
  },
  {
    "_id" : ObjectId("5fda4e6e5b0d1e3db4609c2f"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "8",
        "description" : "Plata-Paladio",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:14:06.742Z"
    },
    "createdAt" : ISODate("2020-12-16T18:14:06.746Z"),
    "updatedAt" : ISODate("2020-12-16T18:14:06.746Z")
  },
  {
    "_id" : ObjectId("5fda4e925b0d1e3db4609c30"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "9",
        "description" : "Plata 0.900",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:14:42.382Z"
    },
    "createdAt" : ISODate("2020-12-16T18:14:42.389Z"),
    "updatedAt" : ISODate("2020-12-16T18:14:42.389Z")
  },
  {
    "_id" : ObjectId("5fda4eb75b0d1e3db4609c31"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "10",
        "description" : "Oro",
        "extendedDetail": {
          "abreviatura": "AU"
        },
        "lastUpdated" : "2020-12-16T18:15:19.514Z"
    },
    "createdAt" : ISODate("2020-12-16T18:15:19.519Z"),
    "updatedAt" : ISODate("2020-12-16T18:15:19.519Z")
  },
  {
    "_id" : ObjectId("5fda4edc5b0d1e3db4609c32"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "11",
        "description" : "Plata 0.920",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:15:56.325Z"
    },
    "createdAt" : ISODate("2020-12-16T18:15:56.326Z"),
    "updatedAt" : ISODate("2020-12-16T18:15:56.326Z")
  },
  {
    "_id" : ObjectId("5fda4efb5b0d1e3db4609c33"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "12",
        "description" : "Plata 0.800",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:16:27.468Z"
    },
    "createdAt" : ISODate("2020-12-16T18:16:27.471Z"),
    "updatedAt" : ISODate("2020-12-16T18:16:27.471Z")
  },
  {
    "_id" : ObjectId("5fda4f1e5b0d1e3db4609c34"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "13",
        "description" : "Plata 0.625",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:17:02.918Z"
    },
    "createdAt" : ISODate("2020-12-16T18:17:02.924Z"),
    "updatedAt" : ISODate("2020-12-16T18:17:02.924Z")
  },
  {
    "_id" : ObjectId("5fda4f2f5b0d1e3db4609c35"),
    "active" : true,
    "catalogId" : "5fda4ce35b0d1e3db4609c20",
    "ExpPrendaria" : {
        "id" : "14",
        "description" : "Plata 0.100",
        "extendedDetail": {
          "abreviatura": "OM"
        },
        "lastUpdated" : "2020-12-16T18:17:19.896Z"
    },
    "createdAt" : ISODate("2020-12-16T18:17:19.903Z"),
    "updatedAt" : ISODate("2020-12-16T18:17:19.903Z")
  }
], { ordered: true })

print(':::Metales creados:::')

print(':::Creación de kilates:::')

db.catalog_kilates.insert(
  [
    {
      _id: ObjectId('5fda4fb25b0d1e3db4609c36'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '8',
        description: 'Baja 8',
        extendedDetail: {
          calidad: '8_Q',
          abreviatura: 'BJ'
        },
        lastUpdated: '2020-12-16T18:19:30.147Z'
      },
      createdAt: ISODate('2020-12-16T18:19:30.151Z'),
      updatedAt: ISODate('2020-12-16T18:19:30.151Z')
    },
    {
      _id: ObjectId('5fda4fec5b0d1e3db4609c37'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '10',
        description: 'Baja 10',
        extendedDetail: {
          calidad: '10_Q',
          abreviatura: 'BJ'
        },
        lastUpdated: '2020-12-16T18:20:28.583Z'
      },
      createdAt: ISODate('2020-12-16T18:20:28.587Z'),
      updatedAt: ISODate('2020-12-16T18:20:28.587Z')
    },
    {
      _id: ObjectId('5fda501f5b0d1e3db4609c38'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '12',
        description: 'Medio 12',
        extendedDetail: {
          calidad: '12_Q',
          abreviatura: 'MD'
        },
        lastUpdated: '2020-12-16T18:21:19.741Z'
      },
      createdAt: ISODate('2020-12-16T18:21:19.746Z'),
      updatedAt: ISODate('2020-12-16T18:21:19.746Z')
    },
    {
      _id: ObjectId('5fda502f5b0d1e3db4609c39'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '14',
        description: 'Medio 14',
        extendedDetail: {
          calidad: '14_Q',
          abreviatura: 'MD'
        },
        lastUpdated: '2020-12-16T18:21:35.273Z'
      },
      createdAt: ISODate('2020-12-16T18:21:35.278Z'),
      updatedAt: ISODate('2020-12-16T18:21:35.278Z')
    },
    {
      _id: ObjectId('5fda50425b0d1e3db4609c3a'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '16',
        description: 'Alto 16',
        extendedDetail: {
          calidad: '16_Q',
          abreviatura: 'AT'
        },
        lastUpdated: '2020-12-16T18:21:54.733Z'
      },
      createdAt: ISODate('2020-12-16T18:21:54.740Z'),
      updatedAt: ISODate('2020-12-16T18:21:54.740Z')
    },
    {
      _id: ObjectId('5fda50595b0d1e3db4609c3b'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '18',
        description: 'Alto 18',
        extendedDetail: {
          calidad: '18_Q',
          abreviatura: 'AT'
        },
        lastUpdated: '2020-12-16T18:22:17.802Z'
      },
      createdAt: ISODate('2020-12-16T18:22:17.804Z'),
      updatedAt: ISODate('2020-12-16T18:22:17.804Z')
    },
    {
      _id: ObjectId('5fda506f5b0d1e3db4609c3c'),
      active: false,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '21',
        description: 'Fina 21',
        extendedDetail: {
          calidad: '21_Q',
          abreviatura: 'FN'
        },
        lastUpdated: '2020-12-16T18:22:39.261Z'
      },
      createdAt: ISODate('2020-12-16T18:22:39.269Z'),
      updatedAt: ISODate('2020-12-16T18:22:39.269Z')
    },
    {
      _id: ObjectId('5fda50895b0d1e3db4609c3d'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '22',
        description: 'Fina 22',
        extendedDetail: {
          calidad: '22_Q',
          abreviatura: 'FN'
        },
        lastUpdated: '2020-12-16T18:23:05.465Z'
      },
      createdAt: ISODate('2020-12-16T18:23:05.470Z'),
      updatedAt: ISODate('2020-12-16T18:23:05.470Z')
    },
    {
      _id: ObjectId('5fda50a35b0d1e3db4609c3e'),
      active: true,
      catalogId: '5fda4ce55b0d1e3db4609c21',
      ExpPrendaria: {
        id: '24',
        description: 'Fina 24',
        extendedDetail: {
          calidad: '24_Q',
          abreviatura: 'FN'
        },
        lastUpdated: '2020-12-16T18:23:31.336Z'
      },
      createdAt: ISODate('2020-12-16T18:23:31.341Z'),
      updatedAt: ISODate('2020-12-16T18:23:31.341Z')
    }
  ],
  { ordered: true }
)

print(':::Kilates creados:::')

print(':::Creación de rangos de monedas:::')

db.catalog_monedas_rangos.insert(
  [
    {
      _id: ObjectId('5fda513b5b0d1e3db4609c3f'),
      active: true,
      catalogId: '5fda4d055b0d1e3db4609c22',
      ExpPrendaria: {
        id: '1',
        description: 'Monedas con Oro 21K Familia Centenario',
        lastUpdated: '2020-12-16T18:26:03.286Z'
      },
      createdAt: ISODate('2020-12-16T18:26:03.292Z'),
      updatedAt: ISODate('2020-12-16T18:26:03.292Z')
    },
    {
      _id: ObjectId('5fda51655b0d1e3db4609c40'),
      active: true,
      catalogId: '5fda4d055b0d1e3db4609c22',
      ExpPrendaria: {
        id: '2',
        description: 'Monedas con Oro 21K Otra',
        lastUpdated: '2020-12-16T18:26:45.374Z'
      },
      createdAt: ISODate('2020-12-16T18:26:45.376Z'),
      updatedAt: ISODate('2020-12-16T18:26:45.376Z')
    },
    {
      _id: ObjectId('5fda519a5b0d1e3db4609c41'),
      active: true,
      catalogId: '5fda4d055b0d1e3db4609c22',
      ExpPrendaria: {
        id: '3',
        description: 'Monedas con Oro 24K Crédito Suizo',
        lastUpdated: '2020-12-16T18:27:38.746Z'
      },
      createdAt: ISODate('2020-12-16T18:27:38.748Z'),
      updatedAt: ISODate('2020-12-16T18:27:38.748Z')
    },
    {
      _id: ObjectId('5fda51f85b0d1e3db4609c42'),
      active: false,
      catalogId: '5fda4d055b0d1e3db4609c22',
      ExpPrendaria: {
        id: '4',
        description: 'Monedas sin Oro',
        lastUpdated: '2020-12-16T18:29:12.814Z'
      },
      createdAt: ISODate('2020-12-16T18:29:12.820Z'),
      updatedAt: ISODate('2020-12-16T18:29:12.820Z')
    }
  ],
  { ordered: true }
)

print(':::Rangos de monedas creadas:::')

print(':::Creación de tipos de monedas:::')

db.catalog_monedas_tipos.insert([
  {
    "_id" : ObjectId("5fda52445b0d1e3db4609c43"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "1",
        "description" : "Centenario($50)",
        "lastUpdated" : "2020-12-16T18:30:28.031Z"
    },
    "createdAt" : ISODate("2020-12-16T18:30:28.034Z"),
    "updatedAt" : ISODate("2020-12-16T18:30:28.034Z")
  },
  {
    "_id" : ObjectId("5fda526b5b0d1e3db4609c44"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "2",
        "description" : "Azteca($20)",
        "lastUpdated" : "2020-12-16T18:31:07.058Z"
    },
    "createdAt" : ISODate("2020-12-16T18:31:07.061Z"),
    "updatedAt" : ISODate("2020-12-16T18:31:07.061Z")
  },
  {
    "_id" : ObjectId("5fda52805b0d1e3db4609c45"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "3",
        "description" : "Hidalgo($10)",
        "lastUpdated" : "2020-12-16T18:31:28.884Z"
    },
    "createdAt" : ISODate("2020-12-16T18:31:28.886Z"),
    "updatedAt" : ISODate("2020-12-16T18:31:28.886Z")
  },
  {
    "_id" : ObjectId("5fda529a5b0d1e3db4609c46"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "4",
        "description" : "1/2 Hidalgo($5)",
        "lastUpdated" : "2020-12-16T18:31:54.297Z"
    },
    "createdAt" : ISODate("2020-12-16T18:31:54.300Z"),
    "updatedAt" : ISODate("2020-12-16T18:31:54.300Z")
  },
  {
    "_id" : ObjectId("5fda52b65b0d1e3db4609c47"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "5",
        "description" : "1/4 Hidalgo($2.5)",
        "lastUpdated" : "2020-12-16T18:32:22.333Z"
    },
    "createdAt" : ISODate("2020-12-16T18:32:22.336Z"),
    "updatedAt" : ISODate("2020-12-16T18:32:22.336Z")
  },
  {
    "_id" : ObjectId("5fda52ca5b0d1e3db4609c48"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "6",
        "description" : "1/5 Hidalgo($2)",
        "lastUpdated" : "2020-12-16T18:32:42.577Z"
    },
    "createdAt" : ISODate("2020-12-16T18:32:42.580Z"),
    "updatedAt" : ISODate("2020-12-16T18:32:42.580Z")
  },
  {
    "_id" : ObjectId("5fda52dd5b0d1e3db4609c49"),
    "active" : true,
    "catalogId" : "5fda4d075b0d1e3db4609c23",
    "ExpPrendaria" : {
        "id" : "7",
        "description" : "1/10 Hidalgo($1)",
        "lastUpdated" : "2020-12-16T18:33:01.191Z"
    },
    "createdAt" : ISODate("2020-12-16T18:33:01.193Z"),
    "updatedAt" : ISODate("2020-12-16T18:33:01.193Z")
  }
], { ordered: true })

print(':::Tipos de monedas creadas:::')

print(':::Creación de tipos de hechuras:::')

db.catalog_hechura_tipos.insert([
  {
    "_id" : ObjectId("5ff377e8840d7e1d80a67157"),
    "active" : true,
    "catalogId" : "5ff37613840d7e1d80a67155",
    "ExpPrendaria" : {
        "id" : "1",
        "description" : "Rotas y Pedacería",
        "extendedDetail" : {
            "abreviatura": "F1",
            "calidad_oro" : [ 
                NumberInt(8),
                NumberInt(10),
                NumberInt(12),
                NumberInt(14),
                NumberInt(16),
                NumberInt(18),
                NumberInt(22),
                NumberInt(24)
            ]
        },
        "lastUpdated" : "2021-01-04T20:17:44.514Z"
    },
    "createdAt" : ISODate("2021-01-04T20:17:44.518Z"),
    "updatedAt" : ISODate("2021-01-04T20:17:44.518Z")
  },
  {
    "_id" : ObjectId("5ff37873840d7e1d80a67158"),
    "active" : true,
    "catalogId" : "5ff37613840d7e1d80a67155",
    "ExpPrendaria" : {
        "id" : "2",
        "description" : "Personalizado (Grabado)",
        "extendedDetail" : {
            "abreviatura" : "F2",
            "calidad_oro" : [ 
                NumberInt(8),
                NumberInt(10),
                NumberInt(12),
                NumberInt(14),
                NumberInt(16),
                NumberInt(18),
                NumberInt(22),
                NumberInt(24)
            ]
        },
        "lastUpdated" : "2021-01-04T20:20:03.711Z"
    },
    "createdAt" : ISODate("2021-01-04T20:20:03.714Z"),
    "updatedAt" : ISODate("2021-01-04T20:20:03.714Z")
  },
  {
    "_id" : ObjectId("5ff378ac840d7e1d80a67159"),
    "active" : true,
    "catalogId" : "5ff37613840d7e1d80a67155",
    "ExpPrendaria" : {
        "id" : "3",
        "description" : "Sin Personalizar",
        "extendedDetail" : {
            "abreviatura" : "F3",
            "calidad_oro" : [ 
                NumberInt(8),
                NumberInt(10),
                NumberInt(12),
                NumberInt(14),
                NumberInt(16),
                NumberInt(18),
                NumberInt(22),
                NumberInt(24)
            ]
        },
        "lastUpdated" : "2021-01-04T20:21:00.125Z"
    },
    "createdAt" : ISODate("2021-01-04T20:21:00.127Z"),
    "updatedAt" : ISODate("2021-01-04T20:21:00.127Z")
  },
  {
    "_id" : ObjectId("5ff378e1840d7e1d80a6715a"),
    "active" : true,
    "catalogId" : "5ff37613840d7e1d80a67155",
    "ExpPrendaria" : {
        "id" : "4",
        "description" : "Buen Estado Sin Personalizar",
        "extendedDetail" : {
            "abreviatura" : "F4",
            "calidad_oro" : [ 
                NumberInt(8),
                NumberInt(10),
                NumberInt(12),
                NumberInt(14),
                NumberInt(16),
                NumberInt(18),
                NumberInt(22),
                NumberInt(24)
            ]
        },
        "lastUpdated" : "2021-01-04T20:21:53.450Z"
    },
    "createdAt" : ISODate("2021-01-04T20:21:53.455Z"),
    "updatedAt" : ISODate("2021-01-04T20:21:53.455Z")
  },
  {
    "_id" : ObjectId("5ff37913840d7e1d80a6715b"),
    "active" : true,
    "catalogId" : "5ff37613840d7e1d80a67155",
    "ExpPrendaria" : {
        "id" : "5",
        "description" : "Marcas Comerciales y Piezas Nuevas",
        "extendedDetail" : {
            "abreviatura" : "F5",
            "calidad_oro" : [
                NumberInt(10),
                NumberInt(12),
                NumberInt(14),
                NumberInt(16),
                NumberInt(18),
                NumberInt(22),
                NumberInt(24)
            ]
        },
        "lastUpdated" : "2021-01-04T20:22:43.772Z"
    },
    "createdAt" : ISODate("2021-01-04T20:22:43.776Z"),
    "updatedAt" : ISODate("2021-01-04T20:22:43.776Z")
  },
  {
    "_id" : ObjectId("5ff37943840d7e1d80a6715c"),
    "active" : true,
    "catalogId" : "5ff37613840d7e1d80a67155",
    "ExpPrendaria" : {
        "id" : "6",
        "description" : "Alta Joyería",
        "extendedDetail" : {
            "abreviatura" : "F6",
            "calidad_oro" : [
                NumberInt(18),
                NumberInt(22),
                NumberInt(24)
            ]
        },
        "lastUpdated" : "2021-01-04T20:23:31.493Z"
    },
    "createdAt" : ISODate("2021-01-04T20:23:31.495Z"),
    "updatedAt" : ISODate("2021-01-04T20:23:31.495Z")
  }
], { ordered: true })

print(':::Tipos de hechuras creadas:::')
