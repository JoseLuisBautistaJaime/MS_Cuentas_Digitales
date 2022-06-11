# MS CUENTAS DIGITALES ( MS_CUENTAS_DIGITALES )

Este API se encarga de definir las operaciones relacionadas con la gestión de catálogos de los diferentes canales de Nacional Monte de Piedad.

Los diagramas asociados a cada una de las operaciones se encuentra en: [API Catalogo]()

## Capacidades :books:

- Gestión de Catálogos
- Gestión de Registros
- Traducción

## Repositorio 🚀

_En caso de necesitar realizar cambios en el código, solicitar acceso a la siguiente ubicación del repositorio en GIT_

https://github.com/MontePiedadMx/Plataforma_Pagos_Catalogos

Ver la sección **Despliegue** para conocer cómo desplegar el proyecto.

### Pre-requisitos :bookmark_tabs:

_Es necesario tener las siguientes herramientas_

- node versión 10.15.3 o superior
- node package manager versión 6.4.1 o superior

verificar con los siguientes comandos:

```
node --version
```

Y también

```
npm --version
```

### Variables de entorno :clipboard:

Para los diferentes ambientes es necesario especificar las urls a redireccionar

```
NODE_ENV: Ambiente en donde se despliega la aplicación [ LOCAL ,DEV , TEST, PROD ]
CONTEXT_NAME: Contexto del API [api]/[cuentadigital]
CONTEXT_VERSION: Versión del API
LOG_LEVEL: Nivel del Log para la escritura de las Trazas
URI: URL de conexión a la Base de Datos MongoDB

```

Para análisis de pruebas Sonar

```
SONAR_HOST_URL: URL del Sonarqube
SONAR_PROJECT_NAME=Project name del proyecto
SONAR_PROJECT_KEY: Project key del proyecto
SONAR_PROJECT_LOGIN: Login generado para este proyecto
```

### Instalación :wrench:

_Instalación de los paquetes necesarios para despliegue y pruebas_

```
npm install
```

## Ejecutando las pruebas ⚙️

_Para la ejecución de las pruebas, no es nesaria la instalacción de otra herramienta diferentes a las instaladas en la **Instalación**, ejecutar_

```
npm run test
npm run test:mongodb
npm run test:ctrl
npm run test:service
npm run test:dao
```

### Análisis del código :nut_and_bolt:

_Para la ejecución del análisis del código, no es nesaria la instalacción de otra herramienta diferentes a las instaladas en la **Instalación**, ejecutar_

```
npm run sonar
```

## Despliegue :package:

_Para el despliegue, basta con ejecutar la sentencia_

```
npm start
```

## Documentación para consumo :book:

Para el consumo de servicios sobre el manejo de los catálogos ver [API-Catalogo]().

## CD/CI

Para CD/CI se hace mediante [Jenkins](http://dev1775-devops.apps.pcf.nmp.com.mx/job/dev1775-api-riesgos/) y ejecutar PASO [Manual de Instalacion]()

## Autores :black_nib:

Desarrollado para Nacional Monte de Piedad por

- [**Softtek**](<(https://www.softtek.com/)>) - [**Carlos Alberto García Salazar**](https://github.com/CarlosAlbertoGarciaSalazar)

## Bitácora :heavy_check_mark:

- Versión Inicial