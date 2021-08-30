import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Layout from "./Layout";
function disableReactDevTools() {
  // Check if the React Developer Tools global hook exists
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== "object") {
    return;
  }

  for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    if (prop === "renderers") {
      // this line will remove that one console error

      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] = new Map()
    } else {
      // Replace all of its properties with a no-op function or a null value
      // depending on their types

      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] =
        typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] === "function"
          ? () => {}
          : null;
    }
  }
}

if (
  process.env.NODE_ENV === "production" &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__
) {
  disableReactDevTools()
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Layout />
  </ThemeProvider>,
  document.querySelector("#root")
);
