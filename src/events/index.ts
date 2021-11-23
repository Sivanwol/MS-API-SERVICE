import { PingEvent } from '@/events/utils/ping';
import { PongEvent } from '@/events/utils/pong';
import { ServicesRoute } from '@/constraints/knownservices';

export const loadEvents = () => {
  // general event handling
  new PingEvent
  new PongEvent
  // here we will handle case by case for now this a template
  switch (process.env.MICROSERVICE_Name) {
    case ServicesRoute.APIGateWay:{
    }
  }
}
