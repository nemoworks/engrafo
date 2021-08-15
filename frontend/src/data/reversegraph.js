
var graph = require('./startdata.json')

var mirror = {
    nodes: graph.nodes,
    edges: graph.edges.map(e => {
        return {
            from: e.to,
            to: e.from
        }
    })
}

console.log(JSON.stringify(mirror))