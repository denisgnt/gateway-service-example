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

    input AssetWhereUniqueInput {
        id: ID
    }


    type Query {
      getAssetOne(where: AssetWhereUniqueInput!): Asset!
      getAssetList(filter: AssetFilter = {} sort: [AssetSort! ] = [{id: asc}] page: Int = 1 perPage: Int = 100): [Asset!]!
      getAssetMany(ids: [ID!]!): [Asset!]!
    }
  `,
  resolvers: {
    Query: {
        getAssetOne: async (root, args) => {
          const { where: { id } } = args
          return assetsData.find(ad => ad.id == id)
        },
        getAssetList: async (root, args) => {
          return assetsData;
        },
        getAssetMany: async (root, args) => {
          const { ids } = args;
          return assetsData.filter(ad => ids.indexOf(ad.id) > -1);
        },
    }
  }
});

module.exports = assetSchema
