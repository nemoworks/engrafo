import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "../components/Title";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Dialog from "@material-ui/core/Dialog";
//引入mobx注册方法observer
import { observer } from "mobx-react";
import Editor from "@monaco-editor/react";
import Form from "@rjsf/material-ui";
//引入流程图组件Graph
import Graph from "../components/Graph.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FixedHeightContainer from "../components/FixedHeightContainer";
import { OutgoingReq,FStemplatesReq } from "../requests";


const graphOptions = {
  physics: {},
  interaction: {
    zoomView: false,
    dragNodes: false,
  },
};

//点击see more order时调用，未来分页时需修改
function preventDefault(event) {
  event.preventDefault();
}

//JSS格式样式表，使用makeStyle
const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  operation: {
    display: "flex",
  },
  margin: {
    margin: theme.spacing(0),
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  stickRight: {
    marginRight: theme.spacing(0),
  },
}));

//通过Observer将schemalist传入FSList
export default observer(function FSList({ schemalist }) {
  const classes = useStyles();
  // 通过react hook定义state变量和set函数
  const [open, setOpen] = React.useState(false);
  const [schema, setSchema] = React.useState({});
  const [uischema, setUischema] = React.useState({});
  const [preview, setPreview] = React.useState({
    show: false,
    schema: {},
    uischema: {},
  });
  const [entry, setEntry] = React.useState({ toSave: false });
  const [rows, setRows] = React.useState([]);
  const [dataModels,setDataModels] = React.useState([])
  const [graph,setGraph]= React.useState({ nodes: [], edges: [] });
  const graphEditorRef = React.useRef(null);

  //通过react hook对Graph进行更新，页面加载时执行一次
  React.useEffect(() => {
    OutgoingReq.getList().then((res) => setRows(res));
  }, []);

  React.useEffect(()=>{
    FStemplatesReq.getAll().then(data=>{
      setDataModels(data)
    })
  },[])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <>
      {/* MaterialUI中布局采用Grid组件 */}
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {/* MaterialUI中的基本卡片组件为Paper */}
          {/* FSList页面左侧卡片 */}
          <FixedHeightContainer height={800}>
            <Title>业务</Title>
            {/* MaterialUI表格组件 */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Schema</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.lifecycle.schema.fieldschema.title?row.lifecycle.schema.fieldschema.title:''}</TableCell>
                    <TableCell align="center">
                      <Link color="inherit" href={"/fsinfo/" + row.id}>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          className={classes.margin}
                        >
                          {/* {编辑按钮，需要添加跳转详情页} */}
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        className={classes.margin}
                        onClick={() => {
                          OutgoingReq.delete(row.id).then(() =>
                            OutgoingReq.getList().then((res) => setRows(res))
                          );
                          setPreview({ show: false });
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="preview"
                        color="primary"
                        className={classes.margin}
                        onClick={() => {
                          setPreview({
                            schema: row.lifecycle.schema.fieldschema,
                            uischema: row.lifecycle.schema.uischema,
                            formData: row.formdata,
                            show: true,
                          });
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              <AddIcon fontSize="default" />
            </Button>
            <div className={classes.seeMore}>
              <Link color="primary" href="#" onClick={preventDefault}>
                See more orders
              </Link>
            </div>
          </FixedHeightContainer>
        </Grid>
        <Grid item xs={4}>
          <FixedHeightContainer height={800}>
            <Title>预览</Title>
            {preview.show ? (
              <Form
                onSubmit={({ formData }) => aflert(JSON.stringify(formData))}
                schema={preview.schema}
                uiSchema={preview.uischema}
                formData={preview.formData}
              />
            ) : null}
          </FixedHeightContainer>
        </Grid>
      </Grid>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              SchemaFormEditor
            </Typography>
            <Select
              native
              onChange={(e)=>{
                const dataModel=dataModels.find(dataModel=>dataModel.id==e.target.value)
                if(dataModel){
                  setSchema(dataModel.formschema.fieldschema)
                  setUischema(dataModel.formschema.uischema)
                }else{
                  setSchema({})
                  setUischema({})
                }
              }}
              inputProps={{
                name: 'schema',
                id: 'age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              {dataModels.map(dataModel=>{
                const {id:dataModelId,formschema:{fieldschema:{title:dataModelTitle}}}=dataModel
                return (<option value={dataModelId}>{dataModelTitle?dataModelTitle:dataModelId}</option>)
              })}
            </Select>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                const business={formdata:{},lifecycle:{schema:{uischema:uischema,fieldschema:schema},enkrino:{graph}}}
                OutgoingReq.create(business).then(data=>{
                  OutgoingReq.getList().then(res=>{
                    setRows(res)
                  })
                })
                handleClose();
              }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>SchemaEditor</Title>
              <p>schema</p>
              {/* monaco editor的onchange函数不够灵活，此处在创建时onMount中绑定到ref，以便后续查询editor中的value */}
              <Editor
                title="Schema"
                defaultLanguage="json"
                value={JSON.stringify(schema, null, "\t")}
                onChange={(value, event) => {}}
                options={{
                  readOnly:true
                }}
              />
              <p>ui:schema</p>
              <Editor
                defaultLanguage="json"
                value={JSON.stringify(uischema, null, "\t")}
                onChange={(value, event) => {}}
                options={{
                  readOnly:true
                }}
              />
            </FixedHeightContainer>
          </Grid>
          {/* FSList页面右侧卡片 */}
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>SchemaForm</Title>
              <Form
                onSubmit={({ formData }) => {
                  alert(
                    JSON.stringify({
                      ...formData,
                      schema: schema,
                      uischema: uischema,
                    })
                  );
                }}
                schema={schema}
                uiSchema={uischema}
              />
            </FixedHeightContainer>
          </Grid>
          {/*graph*/}
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>FlowEditor</Title>
              {/* monaco editor的onchange函数不够灵活，此处在创建时onMount中绑定到ref，以便后续查询editor中的value */}
              <Editor
                title="Schema"
                defaultLanguage="json"
                defaultValue={JSON.stringify(graph, null, "\t")}
                onMount={(editor, monaco) => {
                  graphEditorRef.current = editor;
                }}
                onChange={(value, event) => {}}
              />
              <div>
                {/* 点击apply将schema与uischema传入state，通过editor的ref读取编辑器中的内容 */}
                <Button
                  className={classes.stickRight}
                  color="primary"
                  onClick={() => {
                    let newGraph=JSON.parse(graphEditorRef.current.getValue())
                    newGraph.nodes = newGraph.nodes.map((item) =>({ 
                      ...item, label: item.name, color: "#CCFFFF" 
                    }));
                    newGraph.edges = newGraph.edges.map((item) => ({
                            from: item.from,
                            to: item.to,
                            arrows: "to",
                        }));
                    setGraph(newGraph)
                  }}
                >
                  apply
                </Button>
              </div>
            </FixedHeightContainer>
          </Grid>
          {/* FSList页面右侧卡片 */}
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>graph</Title>
              <Graph
                  identifier={"customed-flow-graph-demo"}
                  graph={graph}
                  options={graphOptions}
                />
            </FixedHeightContainer>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
});
