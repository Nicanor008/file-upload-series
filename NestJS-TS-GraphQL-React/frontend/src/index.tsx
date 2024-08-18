import React from 'react';
import { ApolloClient, ApolloLink, ApolloProvider, from, InMemoryCache } from '@apollo/client'
import ReactDOM from 'react-dom/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const uploadLink = createUploadLink({
  uri: `http://localhost:4000/graphql`,
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
})

const apolloClient = new ApolloClient({
  link: from([uploadLink as unknown as ApolloLink]),
  cache: new InMemoryCache(),
  uri: `http://localhost:4000/graphql`,
})

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
