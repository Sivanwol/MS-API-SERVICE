import moment from 'moment'
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const createUser = async ( prisma, password ) => {
  const user = {
    email: 'sivan+admin@wolberg.pro',
    verifiedAccessAt: moment().toDate(),
    verifiedAccessMethod: 'Email',
    emailVerified: moment().toDate(),
    mobileVerified: moment().toDate(),
    mobile: "0541234567",
    password
  }
  const record = await prisma.user.create( {
    data: user
  } )
  const insertId = record.id
  console.log( `Created user with id: ${insertId}` )

  const recordProfile = await prisma.userProfile.create( {
    data: {
      userId: insertId,
      firstName: 'admin',
      lastName: 'admin'
    }
  } )
  const insertProfileId = recordProfile.id
  console.log( `Created user profile with id: ${insertProfileId}` )
  return insertId;
}

export async function bindUserToRoleOrPermissions( prisma: PrismaClient,userId: string, roles: string[], permissions: string[] ) {
  console.log( `Generate roles Binding seeding ...` )
  const data = []
  for(const roleName of roles) {
    const role = await prisma.roles.findFirst( {
      where: {
        guradName: roleName
      }
    } )
    data.push({
      userId,
      roleId: role.id,
      assignedById: userId
    })
  }
  for(const permission of permissions) {
    const permissionIns = await prisma.permissions.findFirst({
      where: {
        guradName: permission
      }
    })
    data.push({
      userId,
      permissionId: permissionIns.id,
      assignedById: userId
    })
  }
  console.log("User Binding",data)
  await prisma.userOnRolesOrPermissions.createMany({
    data,
    skipDuplicates: true
  })
  console.log( `Generate roles Binding finished.` )
}
export async function generateUsers(prisma) {
  console.log( `Generate Users seeding ...` )
  const hashedPassword = await bcrypt.hash( "cp@12345-Admin", 10 );
  const adminUserId = await createUser( prisma, hashedPassword )
  console.log( `Generate Users finished.` )
  return {
    adminUserId
  }
}
