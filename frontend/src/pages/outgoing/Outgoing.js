import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "../../components/Title";
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
import Graph from "../../components/Graph.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FixedHeightContainer from "../../components/FixedHeightContainer";
import { OutgoingReq } from "../../requests";
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
  const [next, setNext] = React.useState(null);
  const [graph, setGraph] = React.useState({ nodes: [], edges: [] });
  const [current, setCurrent] = React.useState(null);
  const [nexts, setNexts] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  //通过react hook对Graph进行更新，页面加载时执行一次
  React.useEffect(() => {
    OutgoingReq.getList().then((res) => setRows(res));
    (async () =>
      //1000为id
      fetch("http://localhost:8080/api/outgoing/1000")
        .then((res) => res.json())
        .then((res) => {
          //获取图数据
          let next = res.lifecycle.enkrino.graph;
          //把流程引擎的current节点标记为红色
          const currentid = res.lifecycle.enkrino.current
            ? res.lifecycle.enkrino.current
            : res.lifecycle.enkrino.start;
          next.nodes = next.nodes.map((item) =>
            item.id === currentid
              ? { ...item, label: item.name, color: "red" }
              : { ...item, label: item.name, color: "#CCFFFF" }
          );
          //把流程图中的边添加箭头
          next.edges = next.edges.map((item) => {
            return {
              from: item.from,
              to: item.to,
              arrows: "to",
            };
          });
          //把graph数据设置到state
          setGraph(next);
          //setCurrent(res.lifecycle.enkrino.current) 更新current
        }))();
    // .then(()=>fetch("")) 执行get nexts接口，更新nexts
  }, []);

  //这个不需要写
  React.useEffect(() => {
    if (!current) {
      return;
    }
    (async () =>
      fetch("http://localhost:8080/api/outgoing/1000")
        .then((res) => res.json())
        .then((res) => {
          let next = res.lifecycle.enkrino.graph;
          next.nodes = next.nodes.map((item) =>
            item.id === current
              ? { ...item, label: item.name, color: "red" }
              : { ...item, label: item.name, color: "#CCFFFF" }
          );
          next.edges = next.edges.map((item) => {
            return {
              from: item.from,
              to: item.to,
              arrows: "to",
            };
          });
          setGraph(next);
        }))();
  }, [current]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //monaco editor需要绑定ref
  const editorRef = React.useRef(null);
  const uiEditorRef = React.useRef(null);

  return (
    <>
      {/* MaterialUI中布局采用Grid组件 */}
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {/* MaterialUI中的基本卡片组件为Paper */}
          {/* FSList页面左侧卡片 */}
          <FixedHeightContainer height={800}>
            <Title>外派单</Title>
            {/* MaterialUI表格组件 */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "10%" }}>单号</TableCell>
                  <TableCell style={{ width: "12%" }}>经理</TableCell>
                  <TableCell style={{ width: "12%" }}>销售员</TableCell>
                  <TableCell style={{ width: "12%" }}>工程师</TableCell>
                  <TableCell style={{ width: "30%" }} align="center">
                    反馈
                  </TableCell>
                  <TableCell style={{ width: "24%" }} align="center">
                    操作
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.formdata.manager}</TableCell>
                    <TableCell>{row.formdata.saler}</TableCell>
                    <TableCell>{row.formdata.engineer}</TableCell>
                    <TableCell>{row.formdata.feedback}</TableCell>
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
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                if (entry.toSave) {
                  schemalist.add({
                    ...entry.formData,
                    schema: entry.schema,
                    uischema: entry.uischema,
                  });
                } else {
                  alert("no form data submitted");
                }
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
                defaultValue={JSON.stringify(schema, null, "\t")}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                }}
                onChange={(value, event) => console.log(value)}
              />
              <p>ui:schema</p>
              <Editor
                defaultLanguage="json"
                defaultValue={JSON.stringify(uischema, null, "\t")}
                onMount={(editor, monaco) => {
                  uiEditorRef.current = editor;
                }}
                onChange={(value, event) => console.log(value)}
              />
              <div>
                {/* 点击apply将schema与uischema传入state，通过editor的ref读取编辑器中的内容 */}
                <Button
                  className={classes.stickRight}
                  color="primary"
                  onClick={() => {
                    setSchema(JSON.parse(editorRef.current.getValue()));
                    setUischema(JSON.parse(uiEditorRef.current.getValue()));
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
                  setEntry({
                    formData: formData,
                    schema: schema,
                    uischema: uischema,
                    toSave: true,
                  });
                }}
                schema={schema}
                uiSchema={uischema}
                formData={entry.formData ? entry.formData : {}}
              />
              <div
                style={{ height: "400px", width: "400px", marginTop: "20px" }}
              >
                <h2>progress</h2>
                <div>
                  {/* 点击start向后台8080端口请求流程图数据，保存到组件state */}
                  <Button
                    color="inherit"
                    onClick={() => {
                      //和页面加载时行为一致，更新 graph， nexts和current
                      (async () => {
                        fetch("http://localhost:8080/api/outgoing/start/1000", {
                          method: "POST",
                        })
                          .then((res) => res.json())
                          .then((res) => {
                            setCurrent(res.lifecycle.enkrino.current);
                            fetch("localhost:8080/api/outgoing/nexts/1000")
                              .then((res) => res.json())
                              .then((nexts) => {
                                let res = [];
                                nexts.forwards.map((item) => res.push(item));
                                nexts.backwards.map((item) => res.push(item));
                                setNexts(res);
                              });
                          });
                      })();
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
                      setNext(e.target.value); //更新 Next
                    }}
                  >
                    {nexts
                      ? nexts.map((item) => (
                          <MenuItem value={item}>{item}</MenuItem>
                        ))
                      : null}
                  </Select>
                  {/* 点击Go向后台8080端口发送post请求，请求前往Select中选中的步骤next，并请求新的流程图数据，更新到state */}
                  <Button
                    color="inherit"
                    onClick={() => {
                      (async () => {
                        // 访问Go Next接口 解析过程和start一致，更新graph， nexts和current
                        fetch(`localhost:8080/api/outgoing/next/1000/${next}`, {
                          method: "POST",
                        })
                          .then((res) => res.json())
                          .then((res) => {
                            setCurrent(res.lifecycle.enkrino.current);
                            // get Nexts数据解析
                            fetch("localhost:8080/api/outgoing/nexts/1000")
                              .then((res) => res.json())
                              .then((nexts) => {
                                let res = [];
                                nexts.forwards.map((item) => res.push(item));
                                nexts.backwards.map((item) => res.push(item));
                                setNexts(res);
                              });
                          });
                      })();
                    }}
                  >
                    Go
                  </Button>
                </div>
                {/* Graph绑定到组件的state中的graph数据 */}
                <Graph
                  identifier={"customed-flow-graph-demo"}
                  graph={graph}
                  options={graphOptions}
                />
              </div>
            </FixedHeightContainer>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
});
