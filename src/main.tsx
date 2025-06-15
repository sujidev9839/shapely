import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
const key = import.meta.env.VITE_API_KEY

const httpLink = createHttpLink({
  uri: "https://staging-api.gethealthie.com/graphql",
});

const authLink = setContext((_, { headers, ...rest }) => {
  if (rest.noAuth) {
    return { headers: { ...headers } };
  }
  return {
    headers: {
      ...headers,
      Authorization: `Basic ${key}`,
      AuthorizationSource:"API"
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
  <StrictMode>
  <BrowserRouter>
  <Elements stripe={stripePromise}>
    <App />
    </Elements>
    </BrowserRouter>
  </StrictMode>
  </ApolloProvider>
)
