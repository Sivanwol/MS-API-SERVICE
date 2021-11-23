import { PrismaClient } from '@prisma/client';

const settings = [{
  key: "url_mapping",
  value: {
    confirm_new_user_failed: '',
    confirm_new_user_pass: '',
  },
  isEnabled: true
},{
  key: "users_auth_settings",
  value: {
    revalidate_two_way_auth: true,
    revalidate_two_way_auth_period: 14,
    revalidate_two_way_auth_period_unit: 'days'
  },
  isEnabled: true
}]

export async function generatePlatformSettings( prisma: PrismaClient ) {
  console.log( `Generate Users seeding ...` )
  await prisma.platformSettings.createMany({
    data: settings,
    skipDuplicates: true
  })
  console.log( `Generate Users finished.` )
}
