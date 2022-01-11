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
        Asset {
            getList {
                items {
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
        }
    }
```

