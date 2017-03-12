import { makeExecutableSchema } from 'graphql-tools';
import { CursorTypeDef, Cursor } from './Cursor';
import { getArticles } from './Article';
import paginatorSchema from './schema.graphql';

const Article = {
  id(parent) {
    return parent._id.toString();
  },
};

const ArticleConnection = {
  edges(parent) {
    return parent.query.toArray();
  },
};

const ArticleEdge = {
  cursor(parent) {
    return {
      value: parent._id.toString(),
    };
  },
  node(parent) {
    return parent;
  },
};

const Viewer = {
  allArticles(parent, { sortBy, order, ...args }, { mongodb }) {
    const orderNum = order === 'ASC' ? 1 : -1;
    return getArticles(mongodb, args, sortBy, orderNum);
  },
};

const Query = {
  viewer() {
    return {
      id: 'VIEWER_ID',
    };
  },
};

const resolvers = {
  Query,
  Viewer,
  Cursor,
  Article,
  ArticleConnection,
  ArticleEdge,
};

const Schema = makeExecutableSchema({
  typeDefs: [paginatorSchema, CursorTypeDef],
  resolvers,
});

export default Schema;
