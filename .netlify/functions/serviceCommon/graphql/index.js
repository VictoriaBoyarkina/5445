import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLError } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import cors from "cors";
import { authGuard } from "./authGuard.js";
import { DataBase } from "./DataBase/index.js";
import gql from "graphql-tag";

const customDB = new DataBase();
const pubsub = new PubSub();

const typeDefs = gql`
  type Card {
    id: String
    owner: User
    title: String
    text: String
    createDate: String
    comments: [Comment]
    likes: [Like]
  }

  type User {
    id: String
    login: String
    username: String
    color: String
  }

  type Like {
    id: String
    owner: String
    card: String
  }

  type Comment {
    id: String
    owner: String
    card: String
    text: String
  }

  input Profile {
    username: String
    color: String
  }

  input CardPayload {
    text: String!
    title: String!
  }

  type Query {
    me: User
    users: [User]
    cards: [Card]
  }

  type Mutation {
    login(login: String!, password: String!): String
    registration(login: String!, password: String!): Boolean
    changeProfile(payload: Profile): User
    createCard(payload: CardPayload): Card
    deleteCard(cardId: String!): Boolean
    like(cardId: String!): Boolean
    addComment(cardId: String!, text: String!): Comment
  }

  type Subscription {
    cardLiked: Card
  }
`;

/**@type {import('@apollo/subgraph/dist/schema-helper/resolverMap.js').GraphQLResolverMap} */
const resolvers = {
  Query: {
    users: authGuard((_, __, { db }) => {
      return db.users.getUsers();
    }),
    cards: (_, __, { db }) => {
      return db.getCards();
    },
    me: authGuard((_, __, { auth: { id }, db }) => {
      return db.users.getUserById(id);
    }),
    // comments: (_, { cardId }, { db }) => {
    //     return db.comments.getCommentsByCardId(cardId)
    // }
  },
  Mutation: {
    login: (_, { login, password }, { db, res }) => {
      const canLogin = db.users.checkPassword(login, password);

      if (!canLogin)
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });

      const user = db.users.getUserByLogin(login);
      const token = db.auth.generateToken(user.id);

      res.setHeader("authorization", `Bearer ${token}`);

      return token;
    },
    registration: (_, { login, password }, { db }) => {
      try {
        db.users.add({
          login,
          password,
        });

        return true;
      } catch {
        return false;
      }
    },
    changeProfile: authGuard((_, { payload }, { auth: { id }, db }) => {
      const user = db.users.getPublicUserInfo(db.users.changeInfo(id, payload));

      return user;
    }),
    createCard: authGuard((_, { payload }, { auth: { id }, db }) => {
      const card = db.cards.addCard(id, payload);

      return card;
    }),
    deleteCard: authGuard((_, { cardId }, { auth: { id }, db }) => {
      return db.cards.deleteCard(cardId, id);
    }),
    like: authGuard((_, { cardId }, { auth: { id }, db }) => {
      db.likes.setLike(cardId, id);
      const card = db.getCardById(cardId);
      pubsub.publish("CARD_LIKED", { cardLiked: card });

      return true;
    }),
    addComment: authGuard((_, { cardId, text }, { db, auth: { id } }) => {
      return db.comments.addCommentByCardId(cardId, id, text);
    }),
  },
  Subscription: {
    cardLiked: {
      subscribe: () => {
        return pubsub.asyncIterator(["CARD_LIKED"]);
      },
    },
  },
};

/**
 * @param {import('express').Express} app
 * @param {import('http').Server} httpServer
 */
export async function initGraphQL(app, httpServer) {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/subscriptions",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => {
        return {
          db: customDB,
          res,
          req,
        };
      },
    })
  );
}
