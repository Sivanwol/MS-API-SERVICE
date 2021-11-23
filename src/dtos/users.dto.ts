import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @MinLength( 8 )
  @MaxLength( 32 )
  @Matches( /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'} )
  @IsString()
  public password: string;
}

export class RegisterUserDto {
  @IsEmail()
  public email: string;

  @MinLength( 8 )
  @MaxLength( 32 )
  @Matches( /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'} )
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  @MinLength( 2 )
  @MaxLength( 40 )
  public firstName: string;
  @IsOptional()
  @IsString()
  @MinLength( 2 )
  @MaxLength( 40 )
  public lastName: string;
}
