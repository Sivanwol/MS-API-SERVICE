import { PrismaClient, Prisma } from "@prisma/client";
import { generatePlatformSettings } from './GeneratePlatformSettings';
import { bindUserToRoleOrPermissions, generateUsers } from './GenerateFewUsers';
import { generatePermissions } from './GenerateFewPremissions';
import { bindRoleToPermissions, generateRoles } from './GenerateFewRules';

const prisma = new PrismaClient()

async function main() {
  console.log( `Start seeding ...` )
  console.log( `The connection URL is ${process.env.DATABASE_URL}` )
  await generatePlatformSettings( prisma )
  const users = await generateUsers( prisma )
  await generatePermissions( prisma )
  await generateRoles( prisma )
  await bindRoleToPermissions( prisma,
    users.adminUserId,
    'users_admin',
    ['users_modify', 'users_login_as', 'users_delete']
  )
  await bindUserToRoleOrPermissions( prisma,
    users.adminUserId,
    ['users_admin'],
    []
  )
  console.log( `Seeding finished.` )
}

main()
  .catch( ( e ) => {
    console.error( e )
    process.exit( 1 )
  } )
  .finally( async () => {
    await prisma.$disconnect()
  } )

