import { DbService } from './';
import { Permissions } from '@prisma/client';
import { logger } from '@utils/logger';

export class PermissionsService {
  public async getByGrendNames( grendNames: string[] ): Promise<Permissions[]> {
    logger.info( "received service request => getByGrendNames" )
    return await DbService.getInstance().connection.permissions
      .findMany( {
        where: {
          guradName: {
            in: grendNames
          },
          isEnabled: true
        }
      } )
  }

  public async hasRoleOnPermissions( roleId: string, permissionId: string ): Promise<boolean> {
    logger.info( "received service request => hasRoleOnPermissions" )
    const res = await DbService.getInstance().connection.rolesOnPermissions.findFirst( {
      where: {
        roleId,
        permissionId
      }
    } )
    if (!res) return false
    return true
  }

  public async findByGrundName( grundName: string ): Promise<Permissions> {
    logger.info( "received service request => findByGrundName" )
    return await DbService.getInstance().connection.permissions
      .findFirst( {
        where: {
          guradName: grundName,
          isEnabled: true
        }
      } )
  }
}
