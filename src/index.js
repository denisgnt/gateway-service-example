const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground  } = require('apollo-server-core');
const { makeGatewaySchema } = require('./makeGatewaySchema');
const APP_PORT = 9900

const start = async () => {

    const schema = await makeGatewaySchema();
    
    const server = new ApolloServer({
      schema,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({})
      ] 
    });
  
    server.listen({
      port: APP_PORT,
    }).then(({ url }) => {
      console.log(`🚀 exec at ${url}`);
    }).catch(err => { console.error(err) });
  }
  
  start()