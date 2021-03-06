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
import DataSheetPage from "./pages/DataSheetPage";
import Dataset from "./pages/Dataset";

const routes = {
  "/": () => <DMList />,
  "/dmlist": () => <DMList />,
  "/dmlist/preview/:id": ({id}) => <DMPreview id={id}/>,
  "/fmlist": () => <FMList />,
  "/fmlist/preview/:id": ({id}) => <FMPreview id={id}/>,
  "/businesslist": (schemalist) => <BusinessList schemalist={schemalist} />,
  "/business/:id": ({id}) => <Bussiness id={id}/>,
  "/login": () => <Login/>,
  "/datasheet": () => <DataSheetPage/>,
  "/dataset/:id": ({id}) => <Dataset id={id}/>
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
