const permissions = [{
  name: 'Users Modify',
  guradName: 'users_modify',
  description: 'allow modify internal users data (not payment or any private info basically manly meta data)',
  isDeletable: false
},{
  name: 'Users Login As',
  guradName: 'users_login_as',
  description: 'allow login as any user',
  isDeletable: false
},{
  name: 'Users Delete',
  guradName: 'users_delete',
  description: 'allow delete of users',
  isDeletable: false
}]

export async function generatePermissions( prisma ) {
  console.log( `Generate roles seeding ...` )
  await prisma.permissions.createMany({
    data: permissions,
    skipDuplicates: true
  })
  console.log( `Generate roles finished.` )
}
