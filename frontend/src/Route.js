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
import FSInfo from "./pages/FSInfo";

const routes = {
  "/": () => <GraphList />,
  "/formschema/:id": (id) => <FormSchema id={id} />,
  "/fslist": () => <FSList schemalist={schemalist} />,
  "/flow": () => <Flow />,
  "/flowlist": () => <FlowList />,
  "/fsinfo/:id": ({id}) => <FSInfo id={id}/>,
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
