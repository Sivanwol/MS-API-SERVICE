import { PrismaClient} from '@prisma/client';

const roles = [{
  name: 'Users Admin',
  guradName: 'users_admin',
  description: 'platform admin role (have access to anywhere)',
  isDeletable: false
}]

export async function bindRoleToPermissions( prisma: PrismaClient,userId: string, roleGuradName: string, permissions: string[] ) {
  console.log( `Generate roles Binding seeding ...` )
  const data = []
  const role = await prisma.roles.findFirst({
    where: {
      guradName: roleGuradName
    }
  })
  for(const permission of permissions) {
    const permissionIns = await prisma.permissions.findFirst({
      where: {
        guradName: permission
      }
    })
    data.push( {
      roleId: role.id,
      permissionId: permissionIns.id,
      assignedById: userId
    })
  }
  await prisma.rolesOnPermissions.createMany({
    data,
    skipDuplicates: true
  })
  console.log( `Generate roles Binding finished.` )
}

export async function generateRoles( prisma: PrismaClient ) {
  console.log( `Generate roles seeding ...` )
  await prisma.roles.createMany( {
    data: roles,
    skipDuplicates: true
  } )
  console.log( `Generate roles finished.` )
}
