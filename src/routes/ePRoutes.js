import { Router } from 'express'
import { ClienteController } from '../controllers'

/**
 * @swagger
 *  definitions:
 *      CampoDescripcion:
 *         type: object
 *         properties:
 *            description:
 *                type: string
 *                description: Descripcion del catalogo
 *                example: 'Actualizacion del catalogo de modelos de auto'
 *      Catalog:
 *          type: object
 *          properties:
 *            catalogName:
 *                type: string
 *                description: Nombre del catalogo. Para busquedas el nombre debera de estar en minusculas para poder encontrar los registros deseados.
 *                example: 'Auto-Modelo'
 *            description:
 *                type: string
 *                description: Descripcion del catalogo
 *                example: 'Almacena la descripcion de los modelos'
 *      Kilometraje:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              modelo:
 *                type: string
 *                example: 'Modelo'
 *              kmInicial:
 *                type: number
 *                example: 0
 *              kmFinal:
 *                type: number
 *                example: 5000
 *              cantidad:
 *                type: number
 *                example: 32900
 *      Ancestors:
 *          type: object
 *          properties:
 *            catalog:
 *                type: string
 *                description: Corresponde al nombre del catalogo del cual este registro esta compuesto. Si este fuera un registro de subramo, entonces el valor de catalog sera de "ramo", ya que es el catalogo del cual se compone.
 *                example: 'Auto-Modelo'
 *            registry:
 *                type: string
 *                description: Identificador en este aplicativo del registro padre. En el ejemplo del catalogo subramo, aqui como registry se tendra el id de este mismo aplicativo del registro de ramo.
 *                example: '5fce5a36f9facb095091933e'
 *      Registry:
 *          type: object
 *          properties:
 *            sistema.id:
 *                type: string
 *                description: 'Id del registro proveniente de un Sistema, sin embargo se debe reemplazar la palabra sistema por textos como: sap, crm, apicliente.'
 *                example: '2'
 *            sistema.description:
 *                type: string
 *                description: 'Descripcion del registro proveniente de un Sistema.'
 *                example: 'AA3'
 *            sistema.extendedDetail:
 *                type: object
 *                description: 'En esta propiedad se puede mandar cualquier json que este bien formado, como ejemplo se usa kilometrajes, pero puede ser cualquier objeto o listado.'
 *                properties:
 *                   kilometrajes:
 *                      $ref: '#/definitions/Kilometraje'
 *            ancestors:
 *                description: Este listado solo aplica cuando el registro en cuestion es una composicion de varios otros registros de otros catalogos
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Ancestors'
 *          required:
 *            - sistema.id
 *            - sistema.description
 *      NewRegistry:
 *        allOf:     # Combines the BasicErrorModel and the inline model
 *          - $ref: '#/definitions/Registry'
 *          - type: object
 *        required:
 *          - catalogId
 *        properties:
 *          catalogId:
 *            type: string
 *            description: Identificador del catalogo en este aplicativo
 *            example: '5fbef941d3e800b0140b8867'
 *      Imagenes:
 *          type: object
 *          properties:
 *            locations:
 *                type: array
 *                items:
 *                  $ref: Cadena con la ruta de la imagen en el servidor ftp.
 *                description: Arreglo con las rutas de las imágenes a obtener
 *                example: ["readme.txt", "image.png"]
 *      FiltroPostRegistry:
 *         type: object
 *         properties:
 *            expPrendaria.extendedDetail.modelo:
 *                type: number
 *                description: En este ejemplo es el modelo perteneciente al catalogo de Kilometrajes
 *                example: 2020
 *            expPrendaria.extendedDetail.clase:
 *                type: string
 *                description: En este ejemplo es la clase perteneciente al catalogo de Kilometrajes
 *                example: 'A'
 */
const router = Router()

/**
 * @swagger
 *  /catalog/registry/ramos:
 *    get:
 *      summary: Obtiene los ramos disponibles.
 *      description: Obtiene los registros disponibles en el catálogo de ramos.
 *      operationId: getCatalogRamos
 *      tags:
 *          - Experiencia Prendaria
 *      parameters:
 *          - name: channel
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Sistema al cual pertenece el catalogo (SAP, CRM, API Clientes, etc)
 *          - name: parentID
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Id del registro padre, para los registros que tienen dependencia de otro catalogo.
 *          - name: parentCollection
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: 'Nombre del catalogo al cual pertenece el padre de registro de interes, cuando se tienen catalogos en jerarquia y se desea buscar en forma descendente se requiere el nombre del catalogo padre, este nombre debera ser con el que se encuentra almacenado en este sistema'
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Numero de pagina, en la primer invocacion sera la primer pagina y debera mandarse tambien la cantidad de resultados por pagina.'
 *          - name: per_page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Cantidad de resultados por pagina.'
 *      responses:
 *        '200':
 *            description: Exito en la llamada
 * @swagger
 *  /catalog/registry/subramos:
 *    get:
 *      summary: Obtiene los subramos disponibles.
 *      description: Obtiene los registros disponibles en el catálogo de subramos.
 *      operationId: getCatalogSubramos
 *      tags:
 *          - Experiencia Prendaria
 *      parameters:
 *          - name: channel
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Sistema al cual pertenece el catalogo (SAP, CRM, API Clientes, etc)
 *          - name: parentID
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Id del registro padre, para los registros que tienen dependencia de otro catalogo.
 *          - name: parentCollection
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: 'Nombre del catalogo al cual pertenece el padre de registro de interes, cuando se tienen catalogos en jerarquia y se desea buscar en forma descendente se requiere el nombre del catalogo padre, este nombre debera ser con el que se encuentra almacenado en este sistema'
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Numero de pagina, en la primer invocacion sera la primer pagina y debera mandarse tambien la cantidad de resultados por pagina.'
 *          - name: per_page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Cantidad de resultados por pagina.'
 *      responses:
 *        '200':
 *            description: Exito en la llamada
 * @swagger
 *  /catalog/registry/metales:
 *    get:
 *      summary: Obtiene los metales disponibles.
 *      description: Obtiene los registros disponibles en el catálogo de metales.
 *      operationId: getCatalogMetales
 *      tags:
 *          - Experiencia Prendaria
 *      parameters:
 *          - name: channel
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Sistema al cual pertenece el catalogo (SAP, CRM, API Clientes, etc)
 *          - name: parentID
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Id del registro padre, para los registros que tienen dependencia de otro catalogo.
 *          - name: parentCollection
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: 'Nombre del catalogo al cual pertenece el padre de registro de interes, cuando se tienen catalogos en jerarquia y se desea buscar en forma descendente se requiere el nombre del catalogo padre, este nombre debera ser con el que se encuentra almacenado en este sistema'
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Numero de pagina, en la primer invocacion sera la primer pagina y debera mandarse tambien la cantidad de resultados por pagina.'
 *          - name: per_page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Cantidad de resultados por pagina.'
 *      responses:
 *        '200':
 *            description: Exito en la llamada
 * @swagger
 *  /catalog/registry/kilates:
 *    get:
 *      summary: Obtiene los kilates disponibles.
 *      description: Obtiene los registros disponibles en el catálogo de kilates.
 *      operationId: getCatalogKilates
 *      tags:
 *          - Experiencia Prendaria
 *      parameters:
 *          - name: channel
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Sistema al cual pertenece el catalogo (SAP, CRM, API Clientes, etc)
 *          - name: parentID
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Id del registro padre, para los registros que tienen dependencia de otro catalogo.
 *          - name: parentCollection
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: 'Nombre del catalogo al cual pertenece el padre de registro de interes, cuando se tienen catalogos en jerarquia y se desea buscar en forma descendente se requiere el nombre del catalogo padre, este nombre debera ser con el que se encuentra almacenado en este sistema'
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Numero de pagina, en la primer invocacion sera la primer pagina y debera mandarse tambien la cantidad de resultados por pagina.'
 *          - name: per_page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Cantidad de resultados por pagina.'
 *      responses:
 *        '200':
 *            description: Exito en la llamada
 * @swagger
 *  /catalog/registry/monedas_rangos:
 *    get:
 *      summary: Obtiene los rangos de monedas disponibles.
 *      description: Obtiene los registros disponibles en el catálogo de rangos de monedas.
 *      operationId: getCatalogMonedasRangos
 *      tags:
 *          - Experiencia Prendaria
 *      parameters:
 *          - name: channel
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Sistema al cual pertenece el catalogo (SAP, CRM, API Clientes, etc)
 *          - name: parentID
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Id del registro padre, para los registros que tienen dependencia de otro catalogo.
 *          - name: parentCollection
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: 'Nombre del catalogo al cual pertenece el padre de registro de interes, cuando se tienen catalogos en jerarquia y se desea buscar en forma descendente se requiere el nombre del catalogo padre, este nombre debera ser con el que se encuentra almacenado en este sistema'
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Numero de pagina, en la primer invocacion sera la primer pagina y debera mandarse tambien la cantidad de resultados por pagina.'
 *          - name: per_page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Cantidad de resultados por pagina.'
 *      responses:
 *        '200':
 *            description: Exito en la llamada
 * @swagger
 *  /catalog/registry/monedas_tipos:
 *    get:
 *      summary: Obtiene los tipos de monedas disponibles.
 *      description: Obtiene los registros disponibles en el catálogo de tipos de monedas.
 *      operationId: getCatalogMonedasTipos
 *      tags:
 *          - Experiencia Prendaria
 *      parameters:
 *          - name: channel
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Sistema al cual pertenece el catalogo (SAP, CRM, API Clientes, etc)
 *          - name: parentID
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: Id del registro padre, para los registros que tienen dependencia de otro catalogo.
 *          - name: parentCollection
 *            in: query
 *            required: false
 *            schema:
 *                type: string
 *            description: 'Nombre del catalogo al cual pertenece el padre de registro de interes, cuando se tienen catalogos en jerarquia y se desea buscar en forma descendente se requiere el nombre del catalogo padre, este nombre debera ser con el que se encuentra almacenado en este sistema'
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Numero de pagina, en la primer invocacion sera la primer pagina y debera mandarse tambien la cantidad de resultados por pagina.'
 *          - name: per_page
 *            in: query
 *            required: false
 *            schema:
 *                type: number
 *            description: 'Cantidad de resultados por pagina.'
 *      responses:
 *        '200':
 *            description: Exito en la llamada
 */

// router.route('/').get(ClienteController.healthCheck)

export { router as ePRoutes }
