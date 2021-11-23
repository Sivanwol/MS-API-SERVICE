import { RabbitMQConnection } from '@utils/RabbitMQConnection';
import { Message } from 'amqplib/properties';

export interface BaseMessage {
  fromService: string
}

export abstract class BaseEvent {
  private readonly eventName: string

  public constructor( eventName: string, fromService?: string ) {
    this.eventName = eventName;
    this.wiredEvent( fromService )
  }

  protected abstract handleEvent( message: Message )

  private wiredEvent( fromService?: string ) {
    RabbitMQConnection.getInstance().Consume( this.eventName, this.handleEvent.bind( this ), fromService, {noAck: false} )
  }
}
