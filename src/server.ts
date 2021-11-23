import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
function main () {

  validateEnv();

  const app = new App([IndexController]);
  app.listen();

}
main();
