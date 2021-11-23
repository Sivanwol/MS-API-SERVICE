import { Controller, Get, Req, Param } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { TwoWayAuthType } from '@utils/types';
import { Ipware } from '@fullerstack/nax-ipware';
import { find } from 'lodash';
import { HttpException } from '@exceptions/HttpException';
import { PlatformSettingsService, UsersService } from '@services/index';

@Controller()
export class IndexController {
  readonly userService = new UsersService();
  readonly platformSettingsService = new PlatformSettingsService();
  readonly ipware = new Ipware();

  @Get( '/' )
  index() {
    return 'OK';
  }

  @Get( '/email_confirm/:hashVerifyRequestId/:hashUserId/:hashCode' )
  @OpenAPI( {summary: 'confirm user email'} )
  public async confirmEmail(
    @Param( 'hashVerifyRequestId' ) hashVerifyRequestId: string,
    @Param( 'hashUserId' ) hashUserId: string,
    @Param( 'hashCode' ) hashCode: string,
    @Req() request: any ) {
    const ip = this.ipware.getClientIP( request )
    const settings = await this.platformSettingsService.GetGlobalSettings();
    const setting = find(settings, {key: 'url_mapping'})
    if (!setting) throw new HttpException(500, "Server Settings not matched")
    const status = await this.userService.confirmVerifyRequest( TwoWayAuthType.Email, hashVerifyRequestId, hashUserId, hashCode, ip )
    return {status};
  }
}
