import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs, resolvers } from 'graphql-scalars';
import ISchema from './schemas/ISchema';
import directives from './directives';
import allSchemas from './schemas';
import { merge } from 'lodash';
import { logger } from '@utils/logger';

const combine = ( schemas, property ) => {
  return schemas
    .map( schema => {
      return schema[property] ? schema[property] : '';
    } )
    .reduce( ( res, value ) => {
      return `${res}${value}`;
    }, '' );
};

const combineType = ( schemas: ISchema[] ) => combine( schemas, 'type' );
const combineQuery = ( schemas: ISchema[] ) => combine( schemas, 'query' );
const combineMutation = ( schemas: ISchema[] ) => combine( schemas, 'mutation' );
const combineSubscriptions = ( schemas: ISchema[] ) => combine( schemas, 'subscription' );

const typeSystemDefs = `
  scalar Date
  ${directives.schema}
  ${combineType( allSchemas )}
  # The schema allows the following query:
  type Query {
    ${combineQuery( allSchemas )}
  }

  # This schema allows the following mutation:
  type Mutation {
    ${combineMutation( allSchemas )}
  }

  # This schema allows the following subscriptions:
  type Subscription {
    ${combineSubscriptions( allSchemas )}
  }
`;
const AllResolvers = {...resolvers,...merge({},...allSchemas.map( schema => schema.resolver )) };
const AllTypeDef = merge( typeDefs, [typeSystemDefs] ).reverse()
logger.info("Schema GQL ")
logger.info(AllTypeDef.join("") )
const schema: GraphQLSchema = makeExecutableSchema( {
  typeDefs: AllTypeDef,
  resolvers: AllResolvers,
} );
const schemaWithCustomDirectives: GraphQLSchema = directives.attachDirectives( schema );

export default schemaWithCustomDirectives;
