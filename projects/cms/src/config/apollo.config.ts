import { ClientOptions } from "@lavax-helper/next-js";
import {
  GRAPHQL_ENDPOINT,
  GRAPHQL_SUBSCRIPTION_ENDPOINT
} from "config/constant";

const isProduction = process.env.NODE_ENV === "production";
const options: ClientOptions = {
  graphqlRequest: {
    uri: GRAPHQL_ENDPOINT,
    credentials: "same-origin"
  },
  websocketRequest: {
    uri: GRAPHQL_SUBSCRIPTION_ENDPOINT,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: {}
    }
  },
  resolvers: {},
  typeDefs: {},
  connectToDevTools: !isProduction && typeof window !== "undefined",
  getAuthToken: null // getTokenFromCookies from "@lavax-helper/next-js"
};

export default options;
