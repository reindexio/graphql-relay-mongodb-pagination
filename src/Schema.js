import { makeExecutableSchema } from 'graphql-tools';
import { CursorTypeDef, Cursor } from './Cursor';
import { getArticles } from './Article';
import paginatorSchema from './schema.graphql';


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
  allArticles(parent, args, { mongodb }) {
    const articles = getArticles(mongodb, args, 'text', -1);
    console.log(articles);
    return articles;
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
  ArticleEdge,
  Cursor,
  ArticleConnection,
};

const Schema = makeExecutableSchema({
  typeDefs: [paginatorSchema, CursorTypeDef],
  resolvers,
});

export default Schema;
