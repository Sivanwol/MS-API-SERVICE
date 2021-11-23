import ISchema from './ISchema';
import { UserModel } from '@models/user.model';
import { authLogin } from '@utils/gqlUtils';
import { LoginUserDto, RegisterUserDto } from '@dtos/users.dto';
import { validate } from 'class-validator';
import { InputVerifyError, TwoWayAuthType } from '@utils/types';
import { find, toPairs } from 'lodash';
import { logger } from '@utils/logger';
import { Ipware } from '@fullerstack/nax-ipware';
import { isEmpty, ObjectToArray, parseValidatedErrors } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { UserNotFoundException } from '@exceptions/UserNotFoundException';
import moment from 'moment';
import { PlatformSettingsService, UsersService } from '@services/index';
import { PlatformSettings } from '@prisma/client';

export class UserSchema implements ISchema {
  readonly usersService = new UsersService();
  public platformSettingsService = new PlatformSettingsService();
  readonly ipware = new Ipware();
  type = `
    # when request forget password this the model
    type ForgetPasswordUser {
      # If request approved
      status: Boolean!
      # Any error message
      message: String
      # Security hashing for if client want do the handling
      hashing: String
    }
  `;

  query = `
    # Get User own Profile
    me: User @isAuthenticated
    # Test scope with users_modify permission
    testScopePermission: Boolean @hasScopeByPermissions(permissions: ["users_modify"], matchAll: false)
    # Test scope with users_admin role
    testScopeRole: Boolean @hasScopeByRoles(roles: ["users_admin"], matchAll: false)
    # Get boolean if has user register with this email
    hasUserWithEmail(email: String!): Boolean
  `;

  mutation = `
    # Send forget password for a user
    forgotPassword(email: String!): ForgetPasswordUser
    # Reset password for user
    resetPassword(userId: String!, oldPassword: String! , newPassword: String!, hashCode: String!): Boolean
    # Change password
    changePassword(userId: String!,oldPassword: String! , newPassword: String!, hashCode: String!): Boolean @isAuthenticated
  `;
  // verifiedRequestMobile(userId: String!, type: VerifiedType!, code: Int!): Boolean
  subscription = `
  `;

  resolver = {
    Query: {
      me: async ( root, {}, context ) => {
        const {req, res} = context
        return req.user as UserModel;
      },
      hasUserWithEmail: async ( root, {email}, context ) => {
        const {req, res} = context
        const user = await this.usersService.findUserByEmail( email, true )
        if (!user) return false
        return true
      },
      testScopePermission: async ( root, {showAll}, context ) => {
        const {req, res} = context
        return true
      },
      testScopeRole: async ( root, {showAll}, context ) => {
        const {req, res} = context
        return true
      },
    },
    Mutation: {},
    User: {
      // author: ( post ) => authorCore.getAuthor( post.authorId ),
    },
    Subscription: {}
  };
}
