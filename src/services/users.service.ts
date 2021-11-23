import { UserNotFoundException } from '@exceptions/UserNotFoundException';
import { User } from '@prisma/client';
import { logger } from '@utils/logger';
import { CacheKeys } from '@/constraints/CacheKeys';
import { UserModel } from '@models/user.model';
import { RegisterUserDto } from '@dtos/users.dto';
import { UserFoundException } from '@exceptions/UserFoundException';
import { totp } from 'otplib';
import { v5 as uuidv5 } from 'uuid';
import bcrypt from 'bcrypt';
import { TwoWayAuthType } from '@utils/types';
import { EmailService, RolesService, PermissionsService, DbService } from './';
import { IMailerData } from '@/constraints/mailerData';
import moment from 'moment';
import { IpwareIpInfo } from '@fullerstack/nax-ipware/src/lib/ipware.model';
import { includes } from 'lodash';

export class UsersService {
  readonly emailService = new EmailService();
  readonly rolesService = new RolesService();
  readonly permissionsService = new PermissionsService();
  public async findAllUser(): Promise<User[]> {
    logger.info( "received service request => findAllUser" )
    const users: User[] = await DbService.getInstance().connection.user
      .findMany( {} );
    return users;
  }

  public async findUserById( userId: string, notFilters?: boolean ): Promise<UserModel> {
    logger.info( "received service request => findUserById" )
    const cacheKey = CacheKeys.LocateUser( userId )
    let locateUser = null
    if (!notFilters) {
      const status = await DbService.getInstance().HasCache( cacheKey )
      if (!status) {
        locateUser = await DbService.getInstance().connection.user
          .findFirst( {
            where: {
              id: userId,
              disabledAt: null,
              NOT: {
                emailVerified: null
              }
            },
            include: {
              userProfile: true,
              access: true
            }
          } );
        if (!locateUser) return null;
        await DbService.getInstance().CacheResult<User>( cacheKey, locateUser );
      } else {
        locateUser = await DbService.getInstance().GetCacheQuery( cacheKey ) as User
      }
    } else {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            id: userId
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
      if (!locateUser) throw new UserNotFoundException( userId );
    }
    return UserModel.toModel( locateUser, locateUser.userProfile );
  }

  public async hasUserHaveRoles( userId: string, roles: string[], matchAll: boolean ): Promise<boolean> {
    const locateUser = await DbService.getInstance().connection.user
      .findFirst( {
        where: {
          id: userId,
        },
        include: {
          userProfile: true,
          access: true
        }
      } );
    if (!locateUser) return false;
    const user_access = locateUser.access
    let returnValue = (matchAll)
    const fetchedRoles = await this.rolesService.getByGrendNames(roles)
    if (!fetchedRoles || fetchedRoles.length <= 0) return false
    const roleIds = fetchedRoles.map(role => role.id)
    for (const entry of user_access) {
      if (matchAll) {
        if (!includes( roleIds, entry.roleId )) {
          returnValue = false
          break
        }

      } else {
        if (includes( roleIds, entry.roleId )) {
          returnValue = true
          break
        }
      }
    }
    return returnValue
  }

  public async hasUserHavePermissions(userId: string, permissions: string[], matchAll: boolean ): Promise<boolean> {
    const locateUser = await DbService.getInstance().connection.user
      .findFirst( {
        where: {
          id: userId,
        },
        include: {
          userProfile: true,
          access: true
        }
      } );
    if (!locateUser) return false;
    const user_access = locateUser.access
    let returnValue = (matchAll)
    const fetchPermissions = await this.permissionsService.getByGrendNames(permissions)
    if (!fetchPermissions || fetchPermissions.length <= 0) return false
    const permissionIds = fetchPermissions.map(role => role.id)
    // fetch user roles and check the permissions within them

    for (const entry of user_access) {
      if (matchAll) {
        let status = true
        for( const permissionId of permissionIds) {
          const hasPerm = await this.permissionsService.hasRoleOnPermissions(entry.roleId, permissionId)
          if (!hasPerm) {
            status = false
            break
          }
        }
        if (!status) {
          returnValue = false
          break
        }
      } else {
        let status = false
        for( const permissionId of permissionIds) {
          const hasPerm = await this.permissionsService.hasRoleOnPermissions(entry.roleId, permissionId)
          if (hasPerm) {
            status = true
            break
          }
        }
        if (status) {
          returnValue = true
          break
        }
      }
    }
    if (matchAll && !returnValue) return false // if we have all match and we found match in role perm not match then we return false
    if (!matchAll && returnValue) return true // if we have any match and we found match in role perm so no need more checks so we just return true
    // go the user permission and check if there any relevents
    for (const entry of user_access) {
      if (matchAll) {
        if (!includes( permissionIds, entry.permissionId )) {
          returnValue = false
          break
        }

      } else {
        if (includes( permissionIds, entry.permissionId )) {
          returnValue = true
          break
        }
      }
    }
    return returnValue
  }
  public async registerUser( registerUserDto: RegisterUserDto ): Promise<UserModel> {
    logger.info( "received service request => registerUser" )
    const locateUser = await this.findUserByEmail( registerUserDto.email, true )
    if (locateUser) throw new UserFoundException( locateUser.id )
    const hashedPassword = await bcrypt.hash( registerUserDto.password, 10 );
    const user = {
      email: registerUserDto.email,
      password: hashedPassword
    }
    const record = await DbService.getInstance().connection.user.create( {
      data: user
    } )
    const userId = record.id
    await DbService.getInstance().connection.userProfile.create( {
      data: {
        userId: userId,
        firstName: registerUserDto.firstName || '',
        lastName: registerUserDto.lastName || ''
      }
    } )
    logger.info( `Created user with id: ${userId}` )
    return await this.findUserById( userId, true )
  }

  public async findUserByEmail( email: string, noFilters?: boolean ): Promise<UserModel> {
    logger.info( "received service request => findUserByEmail" )
    let locateUser = null
    if (!noFilters) {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            email: email,
            disabledAt: null,
            NOT: {
              emailVerified: null
            }
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
    } else {
      locateUser = await DbService.getInstance().connection.user
        .findFirst( {
          where: {
            email: email,
          },
          include: {
            userProfile: true,
            access: true
          }
        } );
    }
    if (!locateUser) return null;
    return UserModel.toModel( locateUser, locateUser.userProfile );
  }

  public async sendTwoWayAuthToken( userId: string, ip: IpwareIpInfo, type: TwoWayAuthType, reauth?: boolean ): Promise<void> {
    const user = await this.findUserById( userId, true );
    if (!user) throw new UserNotFoundException( userId );
    switch (type) {
      case TwoWayAuthType.Email: {
        if (user.emailVerified !== null) return;
        await this.sendUserConfirmEmail( user, ip, null, true, reauth )
      }
      default: {
        if (user.emailVerified !== null) return;
        await this.sendUserConfirmEmail( user, ip, null, true, reauth )
      }
    }
  }

  public async resentVerifyRequest( userId: string, ip: IpwareIpInfo, type: TwoWayAuthType ) {
    const user = await this.findUserById( userId, true )
    const record = await DbService.getInstance().connection.verificationRequest.findFirst( {
      where: {
        status: 0,
        userId
      }
    } )
    if (!record || !user) throw new Error( "No verify request under this request param" )
    const verifyRequestId = record.id
    switch (type) {
      case TwoWayAuthType.Email: {
        if (user.emailVerified !== null) return;
        await this.sendUserConfirmEmail( user, ip, verifyRequestId )
      }
      default: {
        if (user.emailVerified !== null) return;
        await this.sendUserConfirmEmail( user, ip, verifyRequestId )
      }
    }
  }

  public async confirmVerifyRequest( type: TwoWayAuthType, hashVerifyRequestId: string, hashUserId: string, hashCode: string, ip: IpwareIpInfo ): Promise<boolean> {
    try {
      const verifyRequestId = parseInt( DbService.getInstance().decrypt( hashVerifyRequestId ) )
      const userId = DbService.getInstance().decrypt( hashUserId )
      const code = DbService.getInstance().decrypt( hashCode )
      const user = await this.findUserById( userId, true )
      const verifyRequest = await DbService.getInstance().connection.verificationRequest.findFirst( {
        where: {
          id: verifyRequestId,
          userId,
          status: 0
        }
      } )
      if (!verifyRequest) throw new Error( 'Verify Request Closed' )
      if (!user ||
        (user && user.emailVerified) ||
        (verifyRequest.metaData && !verifyRequest.metaData['authLogin'])) throw new UserNotFoundException( userId );
      const secret = DbService.getInstance().decrypt( verifyRequest.temp_secret )
      const tokenValidates = totp.verify( {
        token: code, secret
      } );
      if (!tokenValidates) throw new Error( 'Token not valid' )
      await DbService.getInstance().connection.verificationRequest.update( {
        where: {
          id: verifyRequestId,
        },
        data: {
          status: 1
        }
      } )
      const updateData = {
        emailVerified: moment().toDate(),
        verifiedAccessAt: moment().toDate()
      }

      await DbService.getInstance().connection.user.update( {
        where: {
          id: userId
        },
        data: updateData
      } )

      await DbService.getInstance().connection.activityLog.create( {
        data: {
          userId,
          referalIp: ip.ip,
          message: "email confirmation - pass",
          action: 'TwoAuthVerify',
          metaData: {
            status: 2
          }
        }
      } )
      return true
    } catch (e) {

      logger.info( `confirm Verify request failed` )
      logger.error( e )
    }
    return false
  }

  private async sendUserConfirmEmail( user: UserModel, ip: IpwareIpInfo, verifyRequestId?: bigint, isFirstMail?: boolean, reauth?: boolean ): Promise<void> {
    const userId = user.id
    const hashUserId = DbService.getInstance().encrypt( user.id )
    const temp_secret = uuidv5( process.env.SECRET, userId )
    totp.resetOptions()
    totp.options = {digits: 12, epoch: moment().add( 2, 'days' ).unix()};
    const code = totp.generate( temp_secret );
    let hashVerifyRequestId = null
    if (isFirstMail && !verifyRequestId) {
      const metaData: any = {}
      if (reauth) metaData.authLogin = true
      const record = await DbService.getInstance().connection.verificationRequest.create( {
        data: {
          temp_secret: DbService.getInstance().encrypt( temp_secret ),
          type: 'Email',
          userId: user.id,
          metaData
        }
      } )
      verifyRequestId = record.id
      hashVerifyRequestId = DbService.getInstance().encrypt( record.id.toString() )
    } else {
      hashVerifyRequestId = DbService.getInstance().encrypt( verifyRequestId.toString() )
    }
    await DbService.getInstance().connection.activityLog.create( {
      data: {
        userId,
        referalIp: ip.ip,
        message: `${isFirstMail ? 'Resent ' : ''}email confirmation - pending`,
        action: 'TwoAuthRequest',
        metaData: {
          status: 0
        }
      }
    } )
    try {
      const confirmMailLink = `${process.env.LINK_DOMAIN}/email_confirm/${hashVerifyRequestId}/${hashUserId}/${DbService.getInstance().encrypt( code )}`
      const params: IMailerData = {
        titleParams: [{key: 'firstName', value: user.profile.firstName}],
        dataParams: [
          {key: 'firstName', value: user.profile.firstName},
          // {key: 'code', value: code},
          {key: 'confirmMailLink', value: confirmMailLink}
        ]
      }
      await this.emailService.sendEmail( user.email, 'confirm_new_user', params )
    } catch (e) {
      await DbService.getInstance().connection.verificationRequest.update( {
        where: {id: verifyRequestId},
        data: {status: 2}
      } )
      await DbService.getInstance().connection.activityLog.create( {
        data: {
          userId,
          referalIp: ip.ip,
          message: "email confirmation - failed",
          action: 'TwoAuthRequest',
          metaData: {
            status: 2
          }
        }
      } )
      logger.error( `Error in sending email ${e.message}` )
      throw new Error( 'Failed sent email' )
    }
  }
}
