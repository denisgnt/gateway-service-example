const { makeExecutableSchema } = require('@graphql-tools/schema');

const assetsData = [
  { 
    id: 'ID0001',
    name: 'First asset',
    description: 'First asset description',
    updatedAt: (new Date()).toISOString(),
    createdAt: (new Date()).toISOString(),
    createdById: 'ck5mf70jj00004cnpse6wpqyr',
    deleted: false,
    address: 'Moscow',
    lat: 55.755793,
    lon: 37.617134 
  },
  { 
    id: 'ID0002',
    name: 'Second asset',
    description: 'Second asset description',
    updatedAt: (new Date()).toISOString(),
    createdAt: (new Date()).toISOString(),
    createdById: 'ck5mf70jj00004cnpse6wpqyr',
    deleted: false,
    address: 'Moscow',
    lat: 55.844,
    lon: 37.62 
  },
]

const assetSchema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    
    type BatchPayload {
      count: Int!
    }

    type PaginationInfo {
      totalPages: Int
      totalItems: Int!
      page: Int
      perPage: Int
      hasNextPage: Boolean
      hasPreviousPage: Boolean
    }

    enum Order {
      asc
      desc
    }

    scalar DateTime
    scalar Latitude
    scalar Longitude
    
    type Asset {
        id: ID!
        name: String!
        description: String
        updatedAt: DateTime!
        createdAt: DateTime!
        createdById: String!
        deleted: Boolean!
        address: String
        lat: Latitude
        lon: Longitude
    }

    input AssetFilter {
        q: String
        id: ID
        ids: [ID!]
        deleted: Boolean
    }

    input AssetSort {
        id: Order
        name: Order
        description: Order
        createdAt: Order
        updatedAt: Order
        address: Order
    }

    type AssetPayload {
        item: Asset
    }

    type AssetsPayload {
        items: [Asset!]
        pageInfo: PaginationInfo
    }

    input AssetWhereUniqueInput {
        id: ID
    }

    input AssetCreateInput {
        id: ID!
        name: String!
        description: String
        address: String
        lat: Latitude
        lon: Longitude
    }

    input AssetUpdateInput {
        name: String
        description: String
        address: String
        lat: Latitude
        lon: Longitude
    }

    type AssetQuery {
        getOne(where: AssetWhereUniqueInput!): AssetPayload!
        getList(filter: AssetFilter = {} sort: [AssetSort! ] = [{id: asc}] page: Int = 1 perPage: Int = 100): AssetsPayload!
        getMany(ids: [ID!]!): AssetsPayload!
    }

    type AssetMutation {
        create(input: AssetCreateInput!): AssetPayload! 
        update( where: AssetWhereUniqueInput! input: AssetUpdateInput!): AssetPayload!       
    }

    type Query {
        Asset: AssetQuery
    }

    type Mutation {
        Asset: AssetMutation
    }
  `,
  resolvers: {
    AssetQuery: {
        getOne: async (root, args) => {
          const { where: { id } } = args
          return { item : assetsData.find(ad => ad.id == id)}
        },
        getList: async (root, args) => {
          return { items: assetsData };
        },
        getMany: async (root, args) => {
          const { ids } = args;
          return { items: assetsData.filter(ad => ids.indexOf(ad.id) > -1) };
        },
    },
    AssetMutation: {
        create: async (root, args) => {
          const { input = {} } = args
          const item = {
              ...input,
              updatedAt: (new Date()).toISOString(),
              createdAt: (new Date()).toISOString(),
              createdById: 'ck5mf70jj00004cnpse6wpqyr',
              deleted: false
          }
          assetsData.push(item);
          return { item }
        },
        update: async (root, args) => {
          const { where : { id }, input = {} } = args
          const item = assetsData.find(ad => ad.id == id);
          if(item) {
            for (const key in input) {
              item[key] = input[key];
            }
            item.updatedAt = (new Date()).toISOString();           
          } else {
            throw new Error('Not found asset');
          }
          return { item };
        }    
    },
    Query: {
        Asset: () => ({}),
    },
    Mutation: {
        Asset: () => ({}),
    }
  }
});

module.exports = assetSchema
