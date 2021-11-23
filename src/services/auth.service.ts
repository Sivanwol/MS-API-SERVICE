import bcrypt from 'bcrypt';
import { logger } from '@utils/logger';
import jwt from 'jsonwebtoken';
import { DbService } from './';
import { UserNotFoundException } from '@exceptions/UserNotFoundException';
import { UserPasswordNotMatchedException } from '@exceptions/UserPasswordNotMatchedException';
import { DataStoredInToken, TokenData } from '@models/auth.model';
import { UserModel } from '@models/user.model';

export class AuthService {

  // public async signup(userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
  //
  //   const findUser: User = this.users.find(user => user.email === userData.email);
  //   f (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);
  //
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   const createUserData: User = { id: this.users.length + 1, ...userData, password: hashedPassword };
  //
  //   return createUserData;
  // }

  public async login( userId: string, password: string ): Promise<UserModel> {

    logger.info( "received service request => login" )
    const findUser = await DbService.getInstance().connection
      .user.findFirst( {
        where: {
          id: userId
        },
        include: {
          userProfile: true
        }
      } )
    if (!findUser) throw new UserNotFoundException( userId );

    const isPasswordMatching: boolean = await bcrypt.compare( password, findUser.password );
    if (!isPasswordMatching) throw new UserPasswordNotMatchedException( userId );

    const tokenData = this.createToken( userId );
    const user: UserModel = UserModel.toModel( findUser, findUser.userProfile );
    user.access_token = tokenData
    return user;
  }

  public createToken( userId: string ): TokenData {
    const dataStoredInToken: DataStoredInToken = {user_id: userId};
    const secretKey: string = process.env.SECRET;
    const expiresIn: number = 60 * parseInt( process.env.JWT_EXPIRE || '60' );
    return {
      expiresIn, token: jwt.sign( dataStoredInToken, secretKey, {
        issuer: process.env.ISSUER,
        audience: process.env.Audience,
        expiresIn
      } )
    };
  }

  //
  // public createCookie(tokenData: TokenData): string {
  //   return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  // }
}

