import { BaseEvent, BaseMessage } from '@/events/BaseEvent';
import { Message } from 'amqplib/properties';
import { RabbitMQConnection } from '@utils/RabbitMQConnection';
import { ServicesEvents } from '@/constraints/knownservices';

export interface PingMessage extends BaseMessage {
  content: string
}

export class PingEvent extends BaseEvent {
  public constructor() {
    super( ServicesEvents.Ping )
  }

  protected handleEvent( dataMessage: Message ) {
    const msg = JSON.parse( dataMessage.content.toString() ) as PingMessage;

    if (msg.content === 'ping') {
      RabbitMQConnection.getInstance().SendToQueue(
        ServicesEvents.Pong,
        Buffer.from( `${process.env.MICROSERVICE_Name}:ok` ),
        msg.fromService
      )
      RabbitMQConnection.getInstance().Ack(dataMessage,true);
    }
  }
}
