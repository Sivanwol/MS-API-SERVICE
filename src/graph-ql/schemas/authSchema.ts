import ISchema from './ISchema';
import { UserModel } from '@models/user.model';
import { authLogin } from '@utils/gqlUtils';
import { LoginUserDto, RegisterUserDto } from '@dtos/users.dto';
import { validate } from 'class-validator';
import { InputVerifyError, TwoWayAuthType } from '@utils/types';
import { find } from 'lodash';
import { logger } from '@utils/logger';
import { Ipware } from '@fullerstack/nax-ipware';
import { parseValidatedErrors } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { UserNotFoundException } from '@exceptions/UserNotFoundException';
import moment from 'moment';
import { AuthService, PlatformSettingsService, UsersService, } from '@services/index';
import { PlatformSettings } from '@prisma/client';

export class AuthSchema implements ISchema {
  readonly userService = new UsersService();
  readonly authService = new AuthService();
  public platformSettingsService = new PlatformSettingsService();
  readonly ipware = new Ipware();
  type = `
    # User Access Token
    type UserToken {
      # When token will be expire
      expiresIn: Int!
      # The Token
      token: JWT!
    }

    # User Auth Code
    type UserTwoWayAuthRequest {
      # Auth code
      authCode: String!

      # Expire In (unit in seconds)
      expiredIn: Int!
    }
    # User Profile model
    type UserProfile {

      # User first name
      firstName: String

      # User last name
      lastName: String
    }
    # Return user or error
    type UserResponse {
      # Return User object if all verify and actions been process and pass
      user: User
      # return Errors list
      errors: [VerifiedErrorNode]
    }
    # Error node message
    type VerifiedErrorNode {
      # If verify object is Nested the error will be within the children else be null
      children: [VerifiedErrorNode]
      # Type of the Field Verify (Max, Min and more)
      type: String!
      # Error message
      message: String!
      # What property name (input values) the error happened
      property: String
    }
    # User model
    type User {
      # user id
      id: ID!

      # User email
      email: String

      # Two way auth of mobile
      emailVerified: Date

      # User mobile number
      mobile: String

      # Two way auth of mobile
      mobileVerified: Date

      # API Token of the user (will be null unless request is login or refresh)
      access_token: UserToken

      # Verified Request (will be null unless requested)
      verifiedRequest: UserTwoWayAuthRequest

      # user profile
      profile: UserProfile!
    }
    enum VerifiedType {
      Email
      Mobile
    }
  `;

  query = `
  `;

  mutation = `
    # User login
    login(email: String, password: String): UserResponse
    register(email: String!, password: String!, firstName: String, lastName: String): UserResponse
    resendVerifiedRequestEmail(email: String!): Boolean
  `;
  // verifiedRequestMobile(userId: String!, type: VerifiedType!, code: Int!): Boolean
  subscription = `
  `;

  resolver = {
    Query: {
    },
    Mutation: {
      login: async ( root, {email, password}, context ) => {
        const {req, res} = context
        const responseObject: { user?: UserModel, errors?: InputVerifyError[] } = {
          user: null, errors: null
        }
        const ip = this.ipware.getClientIP( req )
        const settings:PlatformSettings[] = await this.platformSettingsService.GetGlobalSettings()

        const setting = find( settings, {key: 'users_auth_settings'} )
        if (!setting) throw new HttpException( 500, "Server Settings not matched" )
        req.body.password = password;
        const userDto: LoginUserDto = new LoginUserDto
        userDto.email = email
        userDto.password = password

        const errors = await validate( userDto, {validationError: {target: false, value: false}} );
        if (errors.length > 0) {
          responseObject.errors = parseValidatedErrors( errors )
          return responseObject;
        } else {
          const locateUser = await this.userService.findUserByEmail( userDto.email );
          if (!locateUser) throw new UserNotFoundException( email )
          req.body.userId = locateUser.id;
          if (setting.value['revalidate_two_way_auth']) {
            const now = moment()
            if (now.diff( moment( locateUser.verifiedAccessAt ), setting.value['revalidate_two_way_auth_period_unit'] ) > setting.value['revalidate_two_way_auth_period']) {
              await this.userService.sendTwoWayAuthToken( locateUser.id, ip, TwoWayAuthType.Email )
              responseObject.errors.push( {
                message: 'Send Verify Mail Via Email',
                type: 'server',
                property: 'verify'
              } )
              return responseObject;
            }
          }
          const loggedUser = await authLogin( req, res )
          if (loggedUser) {
            locateUser.access_token = this.authService.createToken(locateUser.id)
            responseObject.user = locateUser
          }
          return responseObject;
        }
      },
      register: async ( root, {email, password, firstName, lastName}, context ) => {
        const {req, res} = context
        const responseObject: { user?: UserModel, errors?: InputVerifyError[] } = {
          user: null, errors: null
        }
        const userDto: RegisterUserDto = new RegisterUserDto;
        userDto.email = email
        userDto.password = password
        userDto.firstName = firstName
        userDto.lastName = lastName
        const errors = await validate( userDto, {validationError: {target: false, value: false}} );
        if (errors.length > 0) {
          responseObject.errors = parseValidatedErrors( errors )
          return responseObject;
        } else {
          const ip = this.ipware.getClientIP( req )
          const user = await this.userService.registerUser( userDto )
          // we soft catch error from this part as if has any error the client in this area not need know about it
          try {
            await this.userService.sendTwoWayAuthToken( user.id, ip, TwoWayAuthType.Email )
          } catch (e) {
            logger.warn( `failed sent email (${user.email}) to user` )
            logger.error( e )
          }
        }
      },
      resendVerifiedRequestEmail: async ( root, {email}, context ) => {
        const {req, res} = context
        const ip = this.ipware.getClientIP( req )
        const user = await this.userService.findUserByEmail( email, true )
        await this.userService.sendTwoWayAuthToken( user.id, ip, TwoWayAuthType.Email )
      }
    },
    User: {
      // author: ( post ) => authorCore.getAuthor( post.authorId ),
    },
    Subscription: {}
  };
}
