
import fetch from "@/adapter/fetch";
import websocket from "@/adapter/websocket";
import { execute, makePromise } from "apollo-link";
import { setContext } from 'apollo-link-context';
import { HttpLink } from "apollo-link-http";
import store from '../store';
import { SubscriptionClient } from "subscriptions-transport-ws";

const uri = process.env.API_BASE_URL;
const httpLink = new HttpLink({
  uri,
  fetch
});

class ApolloClient {

  constructor() {
    this.client = null;
    this.initSubscriptionClient();
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      const token = store.state.auth.token;
      console.log('APOLLO AUTH LINK TOKEN', token)
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    });
    this.link = authLink.concat(httpLink)
  }

  initSubscriptionClient() {
    if (this.client) this.client.close();

    if (store.state.auth.token) {
      this.client = new SubscriptionClient(
        process.env.SUBSCRIPTION_BASE_URL,
        {
          reconnect: true,
          connectionParams: {
            token: store.state.auth.token
          }
        },
        websocket
      );
    } else {
      console.log("No auth token provided in subscription client")
    }
  }

  async query(operation) {
    const res = await makePromise(execute(this.link, operation))
    return res;
  }

  subscribe(operation, next, err, complete) {
    if (!this.client) {
      console.log("Init subscription client");
      this.initSubscriptionClient();
    }

    console.log("Subscribing to: ", operation)
    // this.client.close()
    this.client.request(operation).subscribe({
      next,
      error: err || (error => error),
      complete: complete || (() => {})
    });
  }
}

const apolloClient = new ApolloClient();
export default apolloClient;


