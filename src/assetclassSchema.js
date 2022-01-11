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

        input AssetCreateNestedInput {  
            connect: [AssetWhereUniqueInput!]
        }

        input AssetUpdateNestedInput {  
            disconnect: [AssetWhereUniqueInput!]
            connect: [AssetWhereUniqueInput!]
        }

        type AssetsPayload {
            items: [Asset!]
            pageInfo: PaginationInfo
        }


        type AssetQuery {
            getMany(ids: [ID!]!): AssetsPayload!
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

        type AssetClassPayload {
            item: AssetClass
        }

        type AssetClassesPayload {
            items: [AssetClass!]
            pageInfo: PaginationInfo
        }

        input AssetClassWhereUniqueInput {
            id: ID
        }

        input AssetClassCreateInput {
            id: ID!
            name: String!
            description: String
            assets: AssetCreateNestedInput
        }

        input AssetClassUpdateInput {
            name: String
            description: String
            assets: AssetUpdateNestedInput
        }

        type AssetClassQuery {
            getOne(where: AssetClassWhereUniqueInput!): AssetClassPayload! 
            getList(filter: AssetClassFilter = {} sort: [AssetClassSort! ] = [{id: asc}] page: Int = 1 perPage: Int = 100): AssetClassesPayload!
            getMany(ids: [ID!]): AssetClassesPayload!
        }

        type AssetClassMutation {
            create(input: AssetClassCreateInput!): AssetClassPayload!
            update( where: AssetClassWhereUniqueInput! input: AssetClassUpdateInput!): AssetClassPayload!    
        }

        type Query {
            Asset: AssetQuery
            AssetClass: AssetClassQuery
        }

        type Mutation {    
            AssetClass: AssetClassMutation
        }
    `,
    resolvers: {
        AssetQuery: {
            getMany: async (root, args) => {
                const { ids } = args;
                return { items: assetData.filter(ad => ids.indexOf(ad.id) > -1).map(ad => ({ ...ad, assetClass: assetclassData.find(acd => acd.id == ad.assetClass) })) }; 
            },
        },
        AssetClassQuery: {
            getOne: async (root, args) => {
                const { where: { id } } = args               
                return { item : assetclassData.map(acd => ({ ...acd, assets: assetData.filter(ad => ad.assetClass == acd.id).map(ad => ({ id: ad.id})) })).find(acd => acd.id == id) }
            },
            getList: async (root, args) => {
                return { items : assetclassData.map(acd => ({ ...acd, assets: assetData.filter(ad => ad.assetClass == acd.id).map(ad => ({ id: ad.id})) })) }
            },
            getMany: async (root, args) => {
                const { ids } = args;
                return { items : assetclassData.filter(acd => ids.indexOf(acd.id) > -1).map(acd => ({ ...acd, assets: assetData.filter(ad => ad.assetClass == acd.id).map(ad => ({ id: ad.id})) })) }
            }
        },
        AssetClassMutation: {
            create: async (root, args) => {
                const { input: { assets, ...assetclassinput } } = args
                const item = {
                    ...assetclassinput,
                    updatedAt: (new Date()).toISOString(),
                    createdAt: (new Date()).toISOString(),
                    createdById: 'ck5mf70jj00004cnpse6wpqyr',
                    deleted: false
                }
                assetclassData.push(item);
                
                const item_assets = []
                if(assets?.connect) {
                    const ac_items = assets.connect.map(ac => ({ id: ac.id,  assetClass: item.id }))
                    assetData.push(...ac_items);
                    item_assets.push(...ac_items.map(ac => ({ id: ac.id })));
                }
                              
                return { 
                    item: {
                        ...item,
                        assets: item_assets
                    } 
                }
            },
            update: async (root, args, context, info) => {
                
                const { where : { id }, input: { assets, ...assetclassinput } } = args
                
                const item = assetclassData.find(ad => ad.id == id);

                if(item) {
                    for (const key in assetclassinput) {
                      item[key] = input[key];
                    }
                    item.updatedAt = (new Date()).toISOString(); 
                                       
                    if(assets?.connect) {
                        const ac_items = assets.connect.map(ac => ({ id: ac.id,  assetClass: id }))
                        assetData.push(...ac_items);                      
                    }
                   
                } else {
                    throw new Error('Not found asset');
                }
                  
                return { item };
            }
        },
        Query: {
            Asset: () => ({}),
            AssetClass: () => ({}),     
        },
        Mutation: {
            AssetClass: () => ({}),
        }
    }
  });
  
  module.exports = assetSchema
  