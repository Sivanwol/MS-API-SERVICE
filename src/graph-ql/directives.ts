import { GraphQLSchema } from 'graphql';
import { addDirectiveResolveFunctionsToSchema } from 'graphql-directive';
import { logger } from '@utils/logger';
import { AuthorizationError } from '@exceptions/AuthorizationError';
import { UsersService } from '@services/index';
import { authJWT } from '@utils/gqlUtils';
import { get, includes } from 'lodash';
import { UserModel } from '@models/user.model';
// schema for all custom directives
const customDirectivesSchema = `
  # Checking if user is Authenticated
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  # Checking if user has matching roles (work in two mods matchAll = true mean all roles must be including , matchAll = false mean any role need be include)
  directive @hasScopeByRoles(roles: [String]!, matchAll:Boolean) on QUERY | FIELD_DEFINITION
  # Checking if user has matching permissions (work in two mods matchAll = true mean all permissions must be including , matchAll = false mean any permissions need be include)
  directive @hasScopeByPermissions(permissions: [String]) on QUERY | FIELD_DEFINITION

`;

// attaches the custom directives resolvers to the schema
const attachDirectives = ( schema: GraphQLSchema ): GraphQLSchema => {
  const userService = new UsersService();
  addDirectiveResolveFunctionsToSchema( schema, {
    async isAuthenticated( resolve, source, args, context ) {
      const {req, res} = context

      const loggedUser = await authJWT( req, res )
      try {
        if (!loggedUser)
          throw new AuthorizationError( "authorization not found user" );
        req.user = loggedUser;
        return resolve();
      } catch (err) {
        logger.warn( `user auth not passing ${err.message}` )
        throw new Error( 'Unauthorized' );
      }
    },
    async hasScopeByRoles( resolve, source, args, context ) {
      const {req, res} = context
      const loggedUser = await authJWT( req, res )
      try {
        if (!loggedUser)
          throw new AuthorizationError( "authorization not found user" );
        req.user = loggedUser;
        const user = loggedUser as UserModel
        logger.debug( 'required route roles:', args.roles );
        if (user) {
          const roles = get( args, 'roles', [] )
          const matchAll = get( args, 'matchAll', false )
          if (roles.length > 0) {
            const hasMatched = await userService.hasUserHaveRoles( user.id, roles, matchAll )
            if (hasMatched)
              return resolve();
          }
        }
        logger.error( 'Error: insufficient permissions' );
        throw new AuthorizationError( "insufficient permissions" );
      } catch (err) {
        logger.warn( `user auth not passing ${err.message}` )
        throw new Error( 'Unauthorized' );
      }
    },
    async hasScopeByPermissions( resolve, source, args, context ) {
      const {req, res} = context
      const loggedUser = await authJWT( req, res )
      try {
        if (!loggedUser)
          throw new AuthorizationError( "authorization not found user" );
        req.user = loggedUser;
        logger.debug( 'required route permissions:', args.permissions );
        const user = loggedUser as UserModel
        if (user) {
          const permissions = get( args, 'permissions', [] )
          const matchAll = get( args, 'matchAll', false )
          if (permissions.length > 0) {
            const hasMatched = await userService.hasUserHavePermissions( user.id, permissions, matchAll )
            if (hasMatched)
              return resolve();
          }
        }
        logger.error( 'Error: insufficient permissions' );
        throw new AuthorizationError( "insufficient permissions" );
      } catch (err) {
        logger.warn( `user auth not passing ${err.message}` )
        throw new Error( 'Unauthorized' );
      }
    },


    deprecated( resolve ) {
      return resolve();
    },
  } );
  return schema;
};

export default {
  attachDirectives,
  schema: customDirectivesSchema,
};
