import App from "./App.js";
import OutgoingList from "./pages/OutgoingList.js";
import Outgoing from "./pages/Outgoing.js";
import SchemaBoard from "./pages/SchemaBoard.js";

const routes = [
  {
    path: "/",
    exact: true,
    component: App,
  },
  {
    path: "/outgoinglist",
    component: OutgoingList,
  },
  {
    path: "/outgoing",
    component: Outgoing,
  },
  {
    path: "/schemaboard",
    component: SchemaBoard,
  },
];

export default routes;
