import { DbService } from './';
import { Roles } from '@prisma/client';
import { logger } from '@utils/logger';

export class RolesService {
  public async getByGrendNames( grendNames: string[] ): Promise<Roles[]> {
    logger.info( "received service request => getByGrendNames" )
    return await DbService.getInstance().connection.roles
      .findMany( {
        where: {
          guradName: {
            in: grendNames
          },
          isEnabled: true
        }
      } )

  }

  public async findByGrundName( grundName: string ): Promise<Roles> {
    logger.info( "received service request => findByGrundName" )
    return await DbService.getInstance().connection.roles
      .findFirst( {
        where: {
          guradName: grundName,
          isEnabled: true
        }
      } )
  }
}
