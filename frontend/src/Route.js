import { useRoutes } from "hookrouter";
import NotFoundPage from "./pages/NotFoundPage.js";
import FormSchema from "./pages/FormSchema.js";
import FSList from "./pages/FSList.js";
import Flow from "./pages/Flow.js";
import FlowList from "./pages/FlowList.js";
import HomePage from "./pages/HomePage.js";
import schemalist from './data/SchemaList.js'

const routes = {
  "/": () => <HomePage />,
  "/formschema/:id": (id) => <FormSchema id={id} />,
  "/fslist": () => <FSList schemalist={schemalist}/>,
  "/flow": () => <Flow />,
  "/flowlist": () => <FlowList />,
};

const Route = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <NotFoundPage />;
};

export default Route;
