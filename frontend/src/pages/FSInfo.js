import React from "react";
import FixedHeightContainer from "../components/FixedHeightContainer";
import Title from "../components/Title";
import Form from "@rjsf/material-ui";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Graph from "../components/Graph.js";
import { OutgoingReq } from "../requests";
import MenuItem from "@material-ui/core/MenuItem";
import { keys2disabled } from "../utils/schema";
import Grid from '@material-ui/core/Grid';

var _ = require('lodash');

const graphOptions = {
    physics: {},
    interaction: {
      zoomView: false,
      dragNodes: false,
    },
  };

export default function FSInfo({id}) {
    const [schema, setSchema] = React.useState({});
    const [uiSchema, setUiSchema] = React.useState({});
    const [entry, setEntry] = React.useState({ toSave: false });
    const [next, setNext] = React.useState(null);
    const [nexts, setNexts] = React.useState(null);
    const [graph, setGraph] = React.useState({ nodes: [], edges: [] });
    const [current, setCurrent] = React.useState(null);

    const [currentAccount,setCurrentAccount]=React.useState({})
    const [constraints,setConstraints]=React.useState({})

    const [mirror,setMirror]=React.useState({ nodes: [], edges: [] })

    React.useEffect(()=>{
      const sessionStorage=window.sessionStorage.getItem("currentAccount")
      setCurrentAccount(JSON.parse(sessionStorage?sessionStorage:'{}'))
    },[])

    React.useEffect(()=>{
      if(currentAccount.role&&constraints.steps&&current){
        const {steps}=constraints
        if(steps[current].auth!='@'+currentAccount.role){
          const keys =  [
            "manager",
            "engineer",
            "status",
            "feedback",
            "saler"
          ]
          setUiSchema(_.merge(keys2disabled(keys),uiSchema))
        }else{
          const keys=[...steps[current].disable]
          setUiSchema(_.merge(keys2disabled(keys),uiSchema))
        }
      }else if(currentAccount.role==undefined&&current){
        const keys =  [
          "manager",
          "engineer",
          "status",
          "feedback",
          "saler"
        ]
        setUiSchema(_.merge(keys2disabled(keys),uiSchema))
      }
    },[currentAccount,constraints,current])

    React.useEffect(()=>{
      OutgoingReq.get(id).then(data=>{
        const {
            formdata:formData,
            lifecycle:{
                schema:{
                    fieldschema:schema,
                    uischema:uiSchema
                },
                enkrino:{
                    constraints,
                    current,
                    start
                }
            }}=data
        setSchema(schema)
        setUiSchema(uiSchema)
        setEntry({...entry,schema,uiSchema,formData})
        setConstraints(constraints)
        setCurrent(current?current:start)
        handleStatusChange(data)
      })

    },[])
    


  function handleStatusChange(res){
    const {
      lifecycle:{
          enkrino:{
              current:currentid,
              start,
              graph:{nodes},
          }
      }}=res
    let newGraph=res.lifecycle.enkrino.graph;
    const currentId=currentid?currentid:start
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

    let newMirror=res.lifecycle.enkrino.mirror;
    newMirror.nodes = newMirror.nodes.map((item) =>
      item.id === currentId
        ? { ...item, label: item.name, color: "red" }
        : { ...item, label: item.name, color: "#CCFFFF" }
      );
      newMirror.edges = newMirror.edges.map((item) => {
      return {
        from: item.from,
        to: item.to,
        arrows: "to",
      };
    });
    setMirror(newMirror)

    OutgoingReq.nexts(id).then(data=>{
      const {forwards,backwards}=data
      const edges=[...forwards,...backwards]
      let newEdges=[]
      newEdges=edges.map(e=>{
        for(let n of nodes){
          if(e==n.id){
            return {
              id:e,
              name:n.name
            }
          }
        }
        return{
          id:e,
          name:e
        }
      })
      setNexts(newEdges)
    })
  }


    return (
        <FixedHeightContainer height={800}>
            <Title>SchemaForm</Title>
            <Form
            onSubmit={({schema,uiSchema,formData}) => {
                alert(
                    JSON.stringify(formData)+`\n`+
                    JSON.stringify(schema)+`\n`+
                    JSON.stringify(uiSchema)
                  );

                setEntry({
                    formData,
                    schema,
                    uiSchema,
                    toSave: true,
                });
            }}
            schema={schema}
            uiSchema={uiSchema}
            formData={entry.formData ? entry.formData : {}}
        />
            <div
                style={{ height: "100px", width: "400px", marginTop: "20px" }}
            >
                <h2>progress</h2>
                <div>
                  {/* 点击start向后台8080端口请求流程图数据，保存到组件state */}
                  <Button
                    color="inherit"
                    onClick={() => {
                      //和页面加载时行为一致，更新 graph， nexts和current
                        OutgoingReq.start(id).then(data=>{
                            setCurrent(data.lifecycle.enkrino.current)
                            OutgoingReq.get(id).then(res=>{
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
                      const {id}=e.target.value
                      setNext(id);//更新 Next
                    }}
                  >
                    {nexts
                      ? nexts.map((item) => (
                          <MenuItem value={item}>{item.name}</MenuItem>
                        ))
                      : null}
                  </Select>
                  {/* 点击Go向后台8080端口发送post请求，请求前往Select中选中的步骤next，并请求新的流程图数据，更新到state */}
                  <Button
                    color="inherit"
                    onClick={() => {
                      if(next){
                        OutgoingReq.next(id,next).then(data=>{
                          setCurrent(data.lifecycle.enkrino.current)
                          setNext(null)
                          OutgoingReq.get(id).then(res=>{
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
          <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item xs={6}>
              <div
                style={{ height: "300px", width: "400px", marginTop: "20px"  }}
              >
                <Graph
                  identifier={"customed-flow-graph"}
                  graph={graph}
                  options={graphOptions}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{ height: "300px", width: "400px", marginTop: "20px"  }}
              >
                <Graph
                  identifier={"customed-flow-graph-mirror"}
                  graph={mirror}
                  options={graphOptions}
                />
              </div>
            </Grid>
          </Grid>
        </FixedHeightContainer>
  );
}
