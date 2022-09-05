import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
  // link: httpLink,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: "http://localhost:4000/graphql",
  }),
});

const ApolloClientWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientWrapper;
