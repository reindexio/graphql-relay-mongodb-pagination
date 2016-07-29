import express from 'express';
import graphqlHTTP from 'express-graphql';
import { MongoClient } from 'mongodb';
import Schema from './Schema';

const app = express();
const mongodb = MongoClient.connect(
  'mongodb://localhost:27017/relaypagination'
);

app.use('/graphql', graphqlHTTP(async () => ({
  schema: Schema,
  graphiql: true,
  context: {
    mongodb: await mongodb,
  },
})));

app.listen(3000);
