const {reachableNodes, fromString} = require('./Graph')

testcase1 = ["0->1", "0->2", "0->4", "4->3"];

testcase2 = ["0->1", "1->2", "0->3"];

console.log(reachableNodes(fromString(testcase1), '0'));
