# gateway-service-example

## Installation 

```bash
# Yarn
yarn install
yarn start
```
## Example

```js
    query { 
        getAssetList {  
            id
            description
            createdAt
            assetClass {
                id
                name
                description
            }  
        }
    }
```

