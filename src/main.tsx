import React from "react";
import './main.css';
import ReactDOM from "react-dom/client";
import { Provider } from "urql";
import { createClient } from "urql";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PersonPage from "./pages/PersonPage";
import HomePage from "./pages/HomePage";
import { ChakraProvider } from '@chakra-ui/react'

const client = createClient({
  url: "https://swapi-graphql.netlify.app/.netlify/functions/index",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/person/:personId",
    element: <PersonPage />,
  },
  {
    path: "*",
    element: <h1>404 NOT FOUND</h1>,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
     <ChakraProvider>
    <Provider value={client}>
      <RouterProvider router={router} />
    </Provider>
    </ChakraProvider>
  </React.StrictMode>,
);
