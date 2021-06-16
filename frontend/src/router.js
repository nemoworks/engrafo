import App from './App.js'
import OutgoingList from './pages/OutgoingList.js'
import Outgoing from './pages/Outgoing.js'

const routes = [{
    path: "/",
    exact: true,
    component: App
}, {
    path: "/outgoinglist",
    component: OutgoingList,
}, {
    path: "/outgoing",
    component: Outgoing
}]

export default routes;