import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import Cursor from './Cursor';
import { getArticles } from './Article';

export const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    hasNextPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    hasPreviousPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

export function createConnectionArguments() {
  return {
    first: {
      type: GraphQLInt,
    },
    last: {
      type: GraphQLInt,
    },
    before: {
      type: Cursor,
    },
    after: {
      type: Cursor,
    },
  };
}

const Article = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve(parent) {
        return parent._id.toString();
      },
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const ArticleConnection = new GraphQLObjectType({
  name: 'ArticleConnection',
  fields: () => ({
    edges: {
      type: new GraphQLList(ArticleEdge),
      resolve(parent) {
        return parent.query.toArray();
      },
    },
    pageInfo: {
      type: new GraphQLNonNull(PageInfo),
    },
  }),
});

const ArticleEdge = new GraphQLObjectType({
  name: 'ArticleEdge',
  fields: () => ({
    cursor: {
      type: Cursor,
      resolve(parent) {
        return {
          value: parent._id.toString(),
        };
      },
    },
    node: {
      type: Article,
      resolve(parent) {
        return parent;
      },
    },
  }),
});

const Viewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    allArticles: {
      type: ArticleConnection,
      args: createConnectionArguments(),
      resolve(parent, args, { mongodb }) {
        return getArticles(mongodb, args, 'text', -1);
      },
    },
  }),
});

const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      viewer: {
        type: Viewer,
        resolve() {
          return {
            id: 'VIEWER_ID',
          };
        },
      },
    },
  }),
});

export default Schema;
