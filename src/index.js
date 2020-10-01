/**
 * Code for Wordpress rest api
 *
 * @package             Basic wordpress/react rest api
 * @author              Vedran Bejatovic
 * @copyright           2020 Vedran Bejatovic
 * @license             GPL-2.0-or-later
 * @version             1.0.0
 */

/*
 * Import remote dependancies
 */
import React from "react";
import ReactDOM from "react-dom";

/*
 * Import local dependancies
 */
import "./styles.css";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
