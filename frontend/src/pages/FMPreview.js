import React from "react"
import { LCtemplatesReq } from "../requests";
import FixedHeightContainer from "../components/FixedHeightContainer";
import Graph from "../components/Graph.js";
import Grid from "@material-ui/core/Grid";
import Title from "../components/Title";
import Editor from "@monaco-editor/react";
import { makeStyles } from "@material-ui/core/styles";

const graphOptions = {
  physics: {},
  interaction: {
    zoomView: false,
    dragNodes: false,
  },
};


export default function FMPreview({id}){

  const [graph, setGraph] = React.useState({ nodes: [], edges: [] });
  const [editor,setEditor] =  React.useState({});

  //monaco editor需要绑定ref
  const editorRef = React.useRef(null);

  React.useEffect(()=>{
    LCtemplatesReq.get(id).then(data=>{
      const {lifecycle:{enkrino:{graph,start}}}=data
      let newGraph={...graph}
      newGraph.nodes = newGraph.nodes.map((item) =>({ 
        ...item, label: item.name, color: "#CCFFFF" 
      }));
      newGraph.edges = newGraph.edges.map((item) => ({
        from: item.from,
        to: item.to,
        arrows: "to",
      }));
      setGraph(newGraph)
      setEditor({graph,start})
    })
  },[])

  return (
    <Grid container>
      <Grid item xs={6}>
            <FixedHeightContainer height={650}>
              <Title>FlowEditor</Title>
              {/* monaco editor的onchange函数不够灵活，此处在创建时onMount中绑定到ref，以便后续查询editor中的value */}
              <Editor
                title="Schema"
                language="json"
                value={JSON.stringify(editor, null, "\t")}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                }}
                onChange={(value, event) => {}}
                options={{readOnly:true}}
              />
            </FixedHeightContainer>
          </Grid>
          {/* FSList页面右侧卡片 */}
          <Grid item xs={6}>
            <FixedHeightContainer height={650}>
              <Title>graph</Title>
              <Graph
                  identifier={"customed-flow-graph-demo"}
                  graph={graph}
                  options={graphOptions}
                />
            </FixedHeightContainer>
          </Grid>
          </Grid>
  )
}