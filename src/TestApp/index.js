import React from "react";
import * as ReactDOM from "../PublicAPI";
import { Provider, Client } from "urql";
import "bulma/css/bulma.css";
import "./index.css";
import App from "./components/App";

const client = new Client({
  url: "https://carlospaelinck.io/formidable-shopping-cart-service"
});

const AppWithProvider = () => (
  <Provider client={client}>
    <App />
  </Provider>
);

ReactDOM.render(<AppWithProvider />, document.getElementById("root"));
