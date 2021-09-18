import { useRoutes } from "hookrouter";
import NotFoundPage from "./pages/NotFoundPage";
import GraphList from "./pages/GraphList"
import React from 'react';
import BusinessList from "./pages/BusinessList";
import Bussiness from "./pages/Bussiness";
import DMList from "./pages/DMList";
import FMList from "./pages/FMList";
import DMPreview from "./pages/DMPreview";
import FMPreview from "./pages/FMPreview";
import Login from "./pages/Login";

const routes = {
  "/": () => <DMList />,
  "/dmlist": () => <DMList />,
  "/dmlist/preview/:id": ({id}) => <DMPreview id={id}/>,
  "/fmlist": () => <FMList />,
  "/fmlist/preview/:id": ({id}) => <FMPreview id={id}/>,
  "/businesslist": (schemalist) => <BusinessList schemalist={schemalist} />,
  "/business/:id": ({id}) => <Bussiness id={id}/>,
  "/login": () => <Login/>
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
