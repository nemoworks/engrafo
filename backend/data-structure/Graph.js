/**
    node: {
        id: String,
        name: String
    }

    edge: {
        from: String,
        to: String
    }
 */

export default {
  /**
        @param graph {nodes:[],edges[]}
        @param id String
     */
  successors: (graph, id) => {
    let result = [];
    graph.edges.forEach((element) => {
      if (element.from === id) {
        result.push(element.to);
      }
    });
  },

  reachableNodes: (graph, id) => {
    let adj = {};
    graph.edges.forEach((element) => {
      if (!adj[element.from]) {
        adj[element.from] = [];
      }
      adj[element.from].push(element.to);
    });
    if (!adj[id]) {
      return [];
    }
    let queue = [id];
    let visited = new Set();
    visited.add(id);
    let res = [];
    while (queue.size > 0) {
      v = queue.pop();
      if (!adj[v]) {
        continue;
      }
      adj[v].forEach((element) => {
        if (!visited.has(element)) {
          visited.add(element);
          queue.push(element);
          res.push(element);
        }
      });
    }
    return res;
  },

  fromString: (strlist) => {
    let graph = {
      nodes: [],
      edges: [],
    };
    let adj = {};
    strlist.forEach((str) => {
      [from, to] = str.split("->");
      if (!adj[from]) {
        adj[from] = [];
        graph.nodes.push({
          id: from,
          name: `node-${from}`,
        });
      }
      if (!adj[to]) {
        adj[to] = [];
        graph.nodes.push({
          id: to,
          name: `node-${to}`,
        });
      }
      graph.edges.push({
        from: from,
        to: to,
      });
    });
    return graph;
  },
};
