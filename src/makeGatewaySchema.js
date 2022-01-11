const { stitchSchemas } = require('@graphql-tools/stitch');
const assetSchema = require('./assetSchema');
const assetclassSchema = require('./assetclassSchema');

//https://www.graphql-tools.com/docs/schema-stitching/stitch-type-merging

const makeGatewaySchema = async() => {
   
    return stitchSchemas({
        subschemas: [
            {
                schema: assetSchema,
                merge: { 
                    Asset: {
                        fieldName: 'getAssetMany',
                        selectionSet: '{ id }',
                        key: ({ id }) => id,
                        argsFromKeys: ids => ({ ids })
                    },
                    Query: { canonical: true } 
                }
            },
            {
                schema: assetclassSchema,
                merge: {
                    Asset: {
                      fieldName: 'getAssetMany',
                      selectionSet: '{ id }',
                      key: ({ id }) => id,
                      argsFromKeys: ids => ({ ids })
                    }
                }
            }
        ],      
        typeMergingOptions: {
            validationScopes: { 
                'AssetFilter.deleted': { validationLevel: "off" },
                'AssetSort.name': { validationLevel: "off" },
                'AssetSort.description': { validationLevel: "off" },
                'AssetSort.createdAt': { validationLevel: "off" },
                'AssetSort.updatedAt': { validationLevel: "off" },
                'AssetSort.address': { validationLevel: "off" }     
            }
        }
    });
}

module.exports = {
    makeGatewaySchema
};