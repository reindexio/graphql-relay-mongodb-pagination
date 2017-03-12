import { makeExecutableSchema } from 'graphql-tools';
import { CursorTypeDef, Cursor } from './Cursor';
import { getArticles } from './Article';
import paginatorSchema from './schema.graphql';

const resolvers = {
  Article: {
    id({ _id }) {
      return _id.toString();
    },
  },
  ArticleConnection: {
    edges({ query }) {
      return query.toArray();
    },
  },
  ArticleEdge: {
    cursor({ _id }) {
      return {
        value: _id.toString(),
      };
    },
    node(parent) {
      return parent;
    },
  },
  Viewer: {
    allArticles(parent, { sortBy, order, ...args }, { mongodb }) {
      const orderNum = order === 'ASC' ? 1 : -1;
      return getArticles(mongodb, args, sortBy, orderNum);
    },
  },
  Query: {
    viewer() {
      return {
        id: 'VIEWER_ID',
      };
    },
  },
  Cursor,
};

export default makeExecutableSchema({
  typeDefs: [paginatorSchema, CursorTypeDef],
  resolvers,
});
