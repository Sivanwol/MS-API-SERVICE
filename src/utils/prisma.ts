import {PrismaClient} from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
import * as dotenv from 'dotenv'

dotenv.config()
console.log(`The connection URL is ${process.env.DATABASE_URL}`)
let prisma = new PrismaClient({
  log: ['query'],
})


if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
}
export default prisma as PrismaClient
