import amqp, { Channel, Connection } from 'amqplib/callback_api'
import { logger } from '@utils/logger';
import { Message, Options, Replies } from 'amqplib/properties';
import { knownServices, knownServicesEvents, ServicesEvents, ServicesRoute } from '@/constraints/knownservices';
import { find } from 'lodash';
import moment from 'moment';
import { PingMessage } from '@/events/utils/ping';

interface ValidateService {
  serviceName: string
  totalServices: number
}

export class RabbitMQConnection {
  private readonly validateServices: ValidateService[];
  private serverServiceName: string;
  private connection: Connection;
  private channel: Channel;
  private static instance: RabbitMQConnection;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {

    for (const serviceName of knownServices) {
      this.validateServices.push( {
        serviceName,
        totalServices: 0
      } )
    }
  }

  public FormatLogMessage( message: string ) {
    const ip = require( 'ip' );
    return `MicroService ${process.env.MICROSERVICE_Name}:${ip.address()} - ${message}`
  }

  public markCurrentService() {
    const locateService = find( this.validateServices, {serviceName: process.env.MICROSERVICE_Name} )
    if (!locateService) throw new Error( `unknown service ${process.env.MICROSERVICE_Name}` )
    locateService.totalServices++;
  }

  public HasAllServicesLoaded() {
    const locateService = find( this.validateServices, {totalServices: 0} )
    if (!locateService) return true
    return false;
  }

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  public async OpenConnection() {
    try {
      const serviceName = knownServices.find( service => service === process.env.MICROSERVICE_Name )
      if (!serviceName) throw new Error( 'Unknown service group' )
      this.serverServiceName = serviceName;
      this.connection = await this.connect( process.env.MICROSERVICE_MSG_WORKER_EXCHANGE )
      this.channel = await this.createChannel()
      this.channel.assertExchange( process.env.MICROSERVICE_MSG_WORKER_EXCHANGE, 'direct', {durable: true} );
      await this.AssertQueues()
    } catch (e) {
      logger.warn( 'Rabbit MQ Handle Failed System Shot down ...' )
      logger.error( e )
      throw new Error( 'Rabbit MQ Failed , ' + e.message );
    }
  }

  public async AssertQueues() {
    for (const knownServicesEvent of knownServicesEvents) {
      const queueName = this.formatQueueName( knownServicesEvent )
      this.channel.bindQueue( queueName, process.env.MICROSERVICE_MSG_WORKER_EXCHANGE, '' )
      await this.assertQueue( queueName )
    }
  }

  public Ack( message: Message, allUpTo?: boolean ) {
    this.channel.ack( message, allUpTo )
  }

  public Consume( queueName: string, callback: Function, fromService?: string, options?: Options.Consume ) {
    if (this.connection && this.channel) {
      this.channel.consume( this.formatQueueName( queueName, fromService ), ( message ) => callback( message ), options )
    }
  }

  public SendValidateCheckOnServers() {
    for (const serviceName of knownServices) {
      if (serviceName !== process.env.MICROSERVICE_Name) {
        const pingMessage: PingMessage = {
          fromService: serviceName,
          content: 'ping'
        }
        this.SendToQueue( this.formatQueueName( ServicesEvents.Ping, serviceName ), Buffer.from( JSON.stringify( pingMessage ) ) )
      }
    }
  }

  public SendToQueue( queueName: string, buffer: Buffer, fromService?: string, options?: Options.Publish ) {
    const logMessage = RabbitMQConnection.getInstance().FormatLogMessage( JSON.stringify( {
      sendCommand: queueName,
      timestamp: moment().unix()
    } ) )
    logger.info( logMessage )
    return this.channel.sendToQueue( this.formatQueueName( queueName, fromService ), buffer, options )
  }


  public async CloseConnection() {
    if (this.connection) {
      await this.close();
    }
  }

  private formatQueueName( queueName: string, fromService?: string ) {
    const queueNameFormat = process.env.MICROSERVICE_MSG_QUE_NAME_FORMAT
      .replace( '##DestSericeGroupName##', (fromService) ? fromService : this.serverServiceName )
      .replace( '##EventName##', queueName )
    return queueNameFormat;
  }

  private async assertQueue( queueName: string, queueOption?: Options.AssertQueue ): Promise<Replies.AssertQueue> {
    return new Promise( ( resolve, reject ) => {
      this.channel.assertQueue( queueName, queueOption, ( err, reply ) => {
        if (err) {
          reject( err )
        } else {
          resolve( reply )
        }
      } )
    } )
  }

  private async createChannel(): Promise<Channel> {

    return new Promise( ( resolve, reject ) => {
      this.connection.createChannel( ( err, channel ) => {
        if (err) {
          reject( err )
        } else {
          resolve( channel )
        }
      } )
    } );
  }

  private async close(): Promise<{ err: any }> {
    return new Promise( ( resolve, reject ) => {
      this.connection.close( ( err ) => {
        if (err) {
          reject( err )
          return;
        }
        resolve( null )
      } );
    } )
  }

  private async connect( host ): Promise<Connection> {
    return new Promise( ( resolve, reject ) => {
      amqp.connect( host, ( conn: Connection ) => {
        resolve( conn );
      } );
    } );
  }
}
