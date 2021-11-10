import React from "react";
import FixedHeightContainer from "../components/FixedHeightContainer";
import Title from "../components/Title";
import Form from "@rjsf/material-ui";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Graph from "../components/Graph.js";
import { OutgoingReq, ContextReq } from "../requests";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from '@material-ui/core/Grid';
import { navigate } from "hookrouter";
import CustomForm from "../components/Form/CustomForm";

var _ = require('lodash');

const graphOptions = {
  physics: {},
  interaction: {
    zoomView: false,
    dragNodes: false,
  },
};

export default function FSInfo({ id }) {
  const [schema, setSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [next, setNext] = React.useState(null);
  const [nexts, setNexts] = React.useState(null);
  const [graph, setGraph] = React.useState({ nodes: [], edges: [] });

  // const [mirror,setMirror]=React.useState({ nodes: [], edges: [] })

  const [context, setContext] = React.useState(null)


  React.useEffect(() => {
    OutgoingReq.get(id).then(data => {
      const {
        formdata: formData,
        lifecycle: {
          schema: {
            fieldschema: schema,
            uischema: uiSchema
          },
          enkrino: {
            current,
            start
          }
        } } = data
      setSchema(schema)
      setUiSchema(uiSchema)
      setFormData(formData)
      handleStatusChange(data)
    })

  }, [])



  function handleStatusChange(data) {
    const {
      lifecycle: {
        enkrino: {
          current: currentid,
          start,
          graph: { nodes },
        }
      } } = data
    let newGraph = data.lifecycle.enkrino.graph;
    const currentId = currentid ? currentid : start
    newGraph.nodes = newGraph.nodes.map((item) =>
      item.id === currentId
        ? { ...item, label: item.name, color: "red" }
        : { ...item, label: item.name, color: "#CCFFFF" }
    );
    newGraph.edges = newGraph.edges.map((item) => {
      return {
        from: item.from,
        to: item.to,
        arrows: "to",
      };
    });
    setGraph(newGraph)

    let newMirror = data.lifecycle.enkrino.mirror;
    if (newMirror) {
      // newMirror.nodes = newMirror.nodes.map((item) =>
      // item.id === currentId
      //   ? { ...item, label: item.name, color: "red" }
      //   : { ...item, label: item.name, color: "#CCFFFF" }
      // );
      newMirror.edges = newMirror.edges.map((item) => {
        return {
          from: item.from,
          to: item.to,
          arrows: "to",
          color: "blue",
          dashes: true,
          smooth: { enabled: true, type: "continuous" },
        };
      });
      setGraph({ nodes: [...newGraph.nodes], edges: [...newGraph.edges, ...newMirror.edges] })

      const currentNode = data.lifecycle.enkrino.mirror.nodes.find(node => node.id === currentId)
      if (currentNode.stack) {
        if (currentNode.stack.length > 0) {
          ContextReq.get(currentNode.stack[currentNode.stack.length - 1]).then(res => {
            setContext(res)
            // setFormData(res.info.formdata?res.info.formdata:{})
          })
        }
      }
    }

    OutgoingReq.nexts(id).then(res => {
      const { forwards, backwards } = res
      const edges = [...forwards ? forwards : [], ...backwards ? backwards : []]
      let newEdges = []
      newEdges = edges.map(e => {
        for (let n of nodes) {
          if (e == n.id) {
            return {
              id: e,
              name: n.name
            }
          }
        }
        return {
          id: e,
          name: e
        }
      })
      setNexts(newEdges)
    })
  }

  return (
    <FixedHeightContainer height={800}>
      <Title>SchemaForm</Title>
      <CustomForm
        onSubmit={({ schema, uiSchema, formData }) => {
          OutgoingReq.get(id).then(data => {
            const newData = { ...data, formdata: formData }
            OutgoingReq.update(id, newData).then(res => {
              alert("更新完成")
              navigate('/businesslist', true)
            })
          })
        }}
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
      />
      <div
        style={{ height: "100px", width: "800px", marginTop: "20px" }}
      >
        <h2>progress <span style={{ color: 'blue' }}>{context ? 'timestamp:' + (new Date(parseInt(context.info.timestamp, 10)).toLocaleString()) : ''}</span></h2>

        <div>
          {/* 点击start向后台8080端口请求流程图数据，保存到组件state */}
          <Button
            color="inherit"
            onClick={() => {
              //和页面加载时行为一致，更新 graph， nexts和current
              OutgoingReq.start(id).then(data => {
                OutgoingReq.get(id).then(res => {
                  handleStatusChange(res)
                })
              })
            }}
          >
            Start
          </Button>
          {/* 读取state中的nexts，提供流程图下一步的可选项，通过Select选中的值存入state中的next */}
          <Select
            style={{ marginLeft: "50px" }}
            labelId="select-label"
            id="demo-simple-select"
            value={next ? next : undefined}
            onChange={(e) => {
              const { id } = e.target.value
              setNext(id);//更新 Next
            }}
          >
            {nexts
              ? nexts.map((item) => (
                <MenuItem key={item.id} value={item}>{item.name ? item.name : item.id}</MenuItem>
              ))
              : null}
          </Select>
          {/* 点击Go向后台8080端口发送post请求，请求前往Select中选中的步骤next，并请求新的流程图数据，更新到state */}
          <Button
            color="inherit"
            onClick={() => {
              if (next) {
                OutgoingReq.next(id, next).then(data => {
                  setNext(null)
                  OutgoingReq.get(id).then(res => {
                    handleStatusChange(res)
                  })
                })
              }
            }}
          >
            Go
          </Button>
        </div>
        {/* Graph绑定到组件的state中的graph数据 */}

      </div>
      <div
        style={{ height: "300px", width: "800px", marginTop: "20px" }}
      >
        <Graph
          identifier={"customed-flow-graph"}
          graph={graph}
          options={graphOptions}
        />
      </div>
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={6}>

        </Grid>
        {/* <Grid item xs={6}>
              <div
                style={{ height: "300px", width: "400px", marginTop: "20px"  }}
              >
                <Graph
                  identifier={"customed-flow-graph-mirror"}
                  graph={mirror}
                  options={graphOptions}
                />
              </div>
            </Grid> */}
      </Grid>
    </FixedHeightContainer>
  );
}
