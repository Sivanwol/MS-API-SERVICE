import ISchema from './ISchema';
import { PlatformSettingsSchema } from '@graphql/schemas/platformSettingsSchema';
import { AuthSchema } from '@graphql/schemas/authSchema';
import { UserSchema } from '@graphql/schemas/userSchema';

const schemas: ISchema[] = [
  new PlatformSettingsSchema,
  new AuthSchema,
  new UserSchema
];

export default schemas;
