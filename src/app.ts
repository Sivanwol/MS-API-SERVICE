import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { createServer } from 'http';

import passport from 'passport';
import morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { RabbitMQConnection } from '@utils/RabbitMQConnection';
import { loadEvents } from '@/events';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor( Controllers: Function[] ) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMessageBrokerHandling()
    this.initializeMiddlewares();
    this.initializeMiddlewaresPassport()
    this.initializeRoutes( Controllers );
    this.initializeSwagger( Controllers );
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen( this.port, () => {
      logger.info( `=================================` );
      logger.info( `======= ENV: ${this.env} =======` );
      logger.info( `🚀 App listening on the port ${this.port}` );
      logger.info( `=================================` );
    } );
  }

  public getServer() {
    return this.app;
  }

  private async initializeMessageBrokerHandling() {
    await RabbitMQConnection.getInstance().OpenConnection()
    process.on('beforeExit', async () => {
      await RabbitMQConnection.getInstance().CloseConnection()
    })
    loadEvents()
  }

  private initializeMiddlewaresPassport() {
    // this.app.use( session() )
    this.app.use( passport.initialize() );
    // this.app.use(passport.session());
  }
  private initializeMiddlewares() {
    this.app.use( morgan( process.env.LOGFormat, {stream} ) );
    this.app.use( hpp() );
    this.app.use( helmet() );
    this.app.use( compression() );
    this.app.use( express.json() );
    this.app.use( express.urlencoded( {extended: true} ) );
    this.app.use( cookieParser() );
  }

  private initializeRoutes( controllers: Function[] ) {
    useExpressServer( this.app, {
      cors: {
        origin: process.env.CORSOrigin,
        credentials: process.env.CORSCredentials,
      },
      controllers: controllers,
      defaultErrorHandler: false,
    } );
  }

  private initializeSwagger( controllers: Function[] ) {
    const {defaultMetadataStorage} = require( 'class-transformer/cjs/storage' );

    const schemas = validationMetadatasToSchemas( {
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    } );

    const routingControllersOptions = {
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec( storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-ACCESS-KEY',
          },
        },
      },
      info: {
        description: 'Party Tickets System Api System',
        title: 'Party Tickets System',
        version: '1.0.0',
      },
    } );

    if (process.env.NODE_ENV === 'development')
      this.app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( spec ) );
  }

  private initializeErrorHandling() {
    this.app.use( errorMiddleware );
  }
}

export default App;
