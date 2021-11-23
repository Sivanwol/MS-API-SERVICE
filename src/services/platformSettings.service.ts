import { DbService } from './';
import { PlatformSettings } from '@prisma/client';
import { CacheKeys } from '@/constraints/CacheKeys';
import moment from 'moment';
import { logger } from '@utils/logger';
import { find } from 'lodash';
import { EntityNotExistException } from '@exceptions/EntityNotExistException';

export class PlatformSettingsService {
  public async GetGlobalSettings(): Promise<PlatformSettings[]> {
    logger.info( "received service request => GetGlobalSettings" )
    const status = await DbService.getInstance().HasCache( CacheKeys.GlobalSettings )
    if (status) {
      return await DbService.getInstance().GetCacheQuery( CacheKeys.GlobalSettings ) as PlatformSettings[];
    } else {
      logger.info( "fetching Data from PlatformSettings" )
      const playformSettings: PlatformSettings[] = await DbService.getInstance().connection.platformSettings
        .findMany( {
          where: {
            isEnabled: true,
          }
        } )
      await DbService.getInstance().CacheResults<PlatformSettings>( CacheKeys.GlobalSettings, playformSettings )
      return playformSettings;
    }
  }

  public async getAllSettings() {
    logger.info( "fetching Data from getAllSettings" )
    const playformSettings: PlatformSettings[] = await DbService.getInstance().connection.platformSettings
      .findMany( )
    return playformSettings;
  }

  public async HasGlobalSettingKey( keyName: string ) {
    logger.info( "received service request => HasGlobalSettingKey" )
    const status = await DbService.getInstance().HasCache( CacheKeys.GlobalSettings )
    if (!status) {
      const playformSettings: PlatformSettings = await DbService.getInstance().connection.platformSettings
        .findFirst( {
          where: {
            key: keyName,
            isEnabled: true,
          }
        } )
      if (!playformSettings)
        return false;
    } else {
      // we need verify if it on cache
      const playformSettings: PlatformSettings[] = await DbService.getInstance().GetCacheQuery( CacheKeys.GlobalSettings ) as PlatformSettings[]
      const locateSettings = find( playformSettings, {key: keyName} );
      if (!locateSettings) {
        const playformSettings: PlatformSettings = await DbService.getInstance().connection.platformSettings
          .findFirst( {
            where: {
              key: keyName,
              isEnabled: true,
            }
          } )
        if (!playformSettings)
          return false;
      }
    }
    return true;
  }


  public async HasGlobalSettingCacheKey( keyName: string ) {
    logger.info( "received service request => HasGlobalSettingCacheKey" )
    const status = await DbService.getInstance().HasCache( CacheKeys.GlobalSettings )
    if (status) {
      // we need verify if it on cache
      const playformSettings: PlatformSettings[] = await DbService.getInstance().GetCacheQuery( CacheKeys.GlobalSettings ) as PlatformSettings[]
      const locateSettings = find( playformSettings, {key: keyName} );
      if (!locateSettings) {
        return false;
      }
    }
    return true;
  }

  public async UpdateGlobalSettings( keyName: string, valueObj: any ) {
    logger.info( "received service request => UpdateGlobalSettings" )
    if (await this.HasGlobalSettingKey(keyName)) {
      if (await this.HasGlobalSettingKey( keyName )) {
        await DbService.getInstance().ForceClearCache();
      }
      const setting = await DbService.getInstance().connection.platformSettings.update( {
        where: {key: keyName},
        data: {value: valueObj ,  updatedAt: moment().format()},
      } )
      logger.info( "re save cache Data for PlatformSettings" )
      const playformSettings: PlatformSettings[] = await DbService.getInstance().connection.platformSettings
        .findMany( {
          where: {
            isEnabled: true,
          }
        } )
      await DbService.getInstance().CacheResults<PlatformSettings>( CacheKeys.GlobalSettings, playformSettings )

      return setting;
    }
    else
      throw new EntityNotExistException(keyName)
  }
  public async ToggleSettingStatus(keyName: string) {
    logger.info( "received service request => ToggleSettingStatus" )

    if (await this.HasGlobalSettingKey(keyName)) {

      const playformSettings: PlatformSettings = await DbService.getInstance().connection.platformSettings
        .findFirst( {
          where: {
            key: keyName,
          }
        } )
      const status = !playformSettings.isEnabled
      const setting = await DbService.getInstance().connection.platformSettings.update( {
        where: {key: keyName},
        data: {isEnabled: status ,  updatedAt: moment().format()},
      } )
      return setting;
    }
    else
      throw new EntityNotExistException(keyName)
  }
}
