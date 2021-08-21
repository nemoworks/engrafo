import { useRoutes } from "hookrouter";
import NotFoundPage from "./pages/NotFoundPage";
import FormSchema from "./pages/FormSchema";
import Outgoing from "./pages/outgoing/Outgoing";
import Flow from "./pages/Flow";
import FlowList from "./pages/FlowList";
import HomePage from "./pages/HomePage";
import GraphList from "./pages/GraphList"
import schemalist from "./data/SchemaList";
import React from 'react';
import FSInfo from "./pages/FSInfo";
import DMList from "./pages/DMList";
import FMList from "./pages/FMList";
import Vacation from "./pages/vacation/Vacation";
import OutGoingPreview from "./pages/outgoing/Preview"
import VacationPreview from "./pages/vacation/Preview"

const routes = {
  "/": () => <GraphList />,
  "/formschema/:id": (id) => <FormSchema id={id} />,
  "/dmlist/outgoing": () => <Outgoing schemalist={schemalist} />,
  "/dmlist/outgoing/preview": () => <OutGoingPreview />,
  "/dmlist/vacation": () => <Vacation />,
  "/dmlist/vacation/preview": () => <VacationPreview />,
  "/flow": () => <Flow />,
  "/flowlist": () => <FlowList />,
  "/fsinfo/:id": ({id}) => <FSInfo id={id}/>,
  "/dmlist": () => <DMList />,
  "/fmlist": () => <FMList />,
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
