import express from 'express';
import ngrok from 'ngrok';
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { createSubscriptionServer, createSchema } from 'decorated-graphql';

const schema = createSchema(`${__dirname}/..`);
const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/', graphiqlExpress(req => {
  return {
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://${req.get('host')}/subscriptions`,
  }
}));

const server = createSubscriptionServer(app, schema, '/subscriptions');

server.listen(3000, () => {
  ngrok.connect(3000, (err, url) => {
    console.log('Go visit', url.replace('https', 'http'));
  });
});
