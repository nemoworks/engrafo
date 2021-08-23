import { useRoutes } from "hookrouter";
import NotFoundPage from "./pages/NotFoundPage";
import FormSchema from "./pages/FormSchema";
import Outgoing from "./pages/business/Outgoing";
import Flow from "./pages/Flow";
import FlowList from "./pages/FlowList";
import HomePage from "./pages/HomePage";
import GraphList from "./pages/GraphList"
import schemalist from "./data/SchemaList";
import React from 'react';
import FSInfo from "./pages/FSInfo";
import DMList from "./pages/DMList";
import FMList from "./pages/FMList";
import Vacation from "./pages/business/Vacation";
import BusinessList from "./pages/BusinessList";
import DMPreview from "./pages/DMPreview";
import FMPreview from "./pages/FMPreview";

const routes = {
  "/": () => <GraphList />,
  "/formschema/:id": (id) => <FormSchema id={id} />,
  "/flow": () => <Flow />,
  "/flowlist": () => <FlowList />,
  "/fsinfo/:id": ({id}) => <FSInfo id={id}/>,
  "/dmlist": () => <DMList />,
  "/dmlist/preview/:id": ({id}) => <DMPreview id={id}/>,
  "/fmlist": () => <FMList />,
  "/fmlist/preview/:id": ({id}) => <FMPreview id={id}/>,
  "/businesslist": () => <BusinessList />,
  "/businesslist/outgoing": () => <Outgoing schemalist={schemalist} />,
  "/businesslist/vacation": () => <Vacation />,
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
