import { useRoutes } from "hookrouter";
import NotFoundPage from "./pages/NotFoundPage";
import FormSchema from "./pages/FormSchema";
import FSList from "./pages/FSList";
import Flow from "./pages/Flow";
import FlowList from "./pages/FlowList";
import HomePage from "./pages/HomePage";
import GraphList from "./pages/GraphList"
import schemalist from "./data/SchemaList";
import React from 'react';

const routes = {
  "/": () => <GraphList />,
  "/formschema/:id": (id) => <FormSchema id={id} />,
  "/fslist": () => <FSList schemalist={schemalist} />,
  "/flow": () => <Flow />,
  "/flowlist": () => <FlowList />,
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
