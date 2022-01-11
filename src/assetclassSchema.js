const { makeExecutableSchema } = require('@graphql-tools/schema');

const assetData = [{ id: 'ID0001', assetClass: 'GRP_T1' }, { id:'ID0002', assetClass: 'GRP_T2'}]

const assetclassData = [
    {
        id: 'GRP_T1',
        name: 'ГРП 4А 2Д type2',
        description: 'ГРП 2Аналога 2Дискрета',
        updatedAt: (new Date()).toISOString(),
        createdAt: (new Date()).toISOString(),
        createdById: 'ck5mf70jj00004cnpse6wpqyr',
        deleted: false
    },
    {
        id: 'GRP_T2',
        name: 'ГРП 4А 8Д',
        description: 'ГРП 4Аналога 8Дискрета',
        updatedAt: (new Date()).toISOString(),
        createdAt: (new Date()).toISOString(),
        createdById: 'ck5mf70jj00004cnpse6wpqyr',
        deleted: false
    }
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
            assetClass: AssetClass
        }

        type AssetWithoutAssetClass {
            id: ID!
        }

        input AssetFilter {
            q: String
            id: ID
            ids: [ID!]
        }

        input AssetSort {
            id: Order
        }

        input AssetWhereUniqueInput {
            id: ID
        }

        type AssetClass {
            id: ID!
            name: String!
            description: String
            updatedAt: DateTime!
            createdAt: DateTime!
            createdById: String!
            deleted: Boolean!
            assets: [AssetWithoutAssetClass!]!
        }

        input AssetClassFilter {
            q: String
            id: ID
            ids: [ID!]
            deleted: Boolean
            assetId: ID
            assetIds: [ID!]
            assets: AssetFilter
        }

        input AssetClassSort {
            id: Order
            name: Order
            description: Order
            createdAt: Order
            updatedAt: Order
        }

        input AssetClassWhereUniqueInput {
            id: ID
        }

        type Query {
            getAssetMany(ids: [ID!]!): [Asset!]!
            getAssetClassOne(where: AssetClassWhereUniqueInput!): AssetClass 
            getAssetClassList(filter: AssetClassFilter = {} sort: [AssetClassSort! ] = [{id: asc}] page: Int = 1 perPage: Int = 100): [AssetClass!]!
            getAssetClassMany(ids: [ID!]): [AssetClass!]!
        }
    `,
    resolvers: {     
        Query: {
            getAssetMany: async (root, args) => {
                const { ids } = args;
                return assetData.filter(ad => ids.indexOf(ad.id) > -1).map(ad => ({ ...ad, assetClass: assetclassData.find(acd => acd.id == ad.assetClass) })); 
            },
            getAssetClassOne: async (root, args) => {
                const { where: { id } } = args               
                return assetclassData.map(acd => ({ ...acd, assets: assetData.filter(ad => ad.assetClass == acd.id).map(ad => ({ id: ad.id})) })).find(acd => acd.id == id)
            },
            getAssetClassList: async (root, args) => {
                return assetclassData.map(acd => ({ ...acd, assets: assetData.filter(ad => ad.assetClass == acd.id).map(ad => ({ id: ad.id})) }))
            },
            getAssetClassMany: async (root, args) => {
                const { ids } = args;
                return assetclassData.filter(acd => ids.indexOf(acd.id) > -1).map(acd => ({ ...acd, assets: assetData.filter(ad => ad.assetClass == acd.id).map(ad => ({ id: ad.id})) }))
            }
        }
    }
  });
  
  module.exports = assetSchema
  