import { User, UserProfile } from '@prisma/client';
import { TokenData } from '@models/auth.model';

export class UserModel {
  id: string
  email: string
  emailVerified: Date | null
  verifiedAccessAt: Date | null
  access_token?: TokenData
  mobile: string | null
  mobileVerified: Date | null
  image: string | null
  profile: UserProfileModel
  disabledAt: Date | null
  createdAt: Date
  updatedAt: Date

  static toModel( user: User, userProfile: UserProfile ): UserModel {
    const userProfileModel: UserProfileModel = {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName
    }
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      mobile: user.mobile,
      verifiedAccessAt: user.verifiedAccessAt,
      mobileVerified: user.mobileVerified,
      image: user.image,
      profile: userProfileModel,
      disabledAt: user.disabledAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

}

export interface UserProfileModel {
  firstName: string
  lastName: string
}
