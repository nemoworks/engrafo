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
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Dialog from "@material-ui/core/Dialog";
import { red } from "@material-ui/core/colors";
//引入mobx注册方法observer
import { observer } from "mobx-react";
import Editor from "@monaco-editor/react";
import Form from "@rjsf/material-ui";
//引入流程图组件Graph
import Graph from "../components/Graph.js";
import Select from "@material-ui/core/Select";
import startdata from "../data/startdata.json";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const graphOptions = {
  physics: {

  },
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
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 800,
    marginTop: theme.spacing(2),
  },
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
  const rows = schemalist.data;
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
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

  //通过react hook对Graph进行更新
  React.useEffect(() => {
    if (!current) {
      return;
    }
    (async () =>
      fetch("http://localhost:8080/api/flow")
        .then((res) => res.json())
        .then((res) => {
          let next = res;
          next.nodes = res.nodes.map((item) =>
            item.id === current.id
              ? { ...item, label: item.name, color: "red" }
              : { ...item, label: item.name, color: "#CCFFFF" }
          );
          next.edges = res.edges.map((item) => {
            return {
              from: item.source,
              to: item.target,
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
          <Paper className={fixedHeightPaper}>
            <React.Fragment>
              <Title>All Schemas</Title>
              {/* MaterialUI表格组件 */}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%" }}>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell style={{ width: "30%" }}>Comment</TableCell>
                    <TableCell align="center">Operation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row._id["$oid"]}>
                      <TableCell>{row._id["$oid"]}</TableCell>
                      <TableCell>{row.saler}</TableCell>
                      <TableCell>{row.feedback}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          className={classes.margin}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          color="secondary"
                          className={classes.margin}
                          onClick={() => {
                            schemalist.delete(row._id["$oid"]);
                            if (
                              preview.formData._id["$oid"] === row._id["$oid"]
                            ) {
                              setPreview({ show: false });
                            }
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
                              schema: row.schema ? row.schema : {},
                              uischema: row.uischema ? row.uischema : {},
                              formData: {
                                _id: row._id,
                                saler: row.saler,
                                feedback: row.feedback,
                              },
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
            </React.Fragment>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={fixedHeightPaper}>
            <React.Fragment>
              <Title>Preview</Title>
              {preview.show ? (
                <Form
                  onSubmit={({ formData }) => aflert(JSON.stringify(formData))}
                  schema={preview.schema}
                  uiSchema={preview.uischema}
                  formData={preview.formData}
                />
              ) : null}
            </React.Fragment>
          </Paper>
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
            <Paper className={fixedHeightPaper}>
              <React.Fragment>
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
              </React.Fragment>
            </Paper>
          </Grid>
          {/* FSList页面右侧卡片 */}
          <Grid item xs={6}>
            <Paper className={fixedHeightPaper}>
              <React.Fragment>
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
                  style={{ height: "400px", width: "400px", marginTop: "20px"}}
                >
                  <h2>progress</h2>
                  <div>
                  {/* 点击start向后台8080端口请求流程图数据，保存到组件state */}
                    <Button
                      color="inherit"
                      onClick={() => {
                        (async () => {
                          fetch("http://localhost:8080/api/start", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(startdata),
                          }).then(() => {
                            fetch("http://localhost:8080/api/current")
                              .then((res) => res.json())
                              .then((res) => setCurrent(res))
                              .then(() =>
                                fetch("http://localhost:8080/api/next")
                                  .then((res) => res.json())
                                  .then((res) => setNexts(res))
                              );
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
                        setNext(e.target.value);
                      }}
                    >
                      {nexts
                        ? nexts.map((item) => (
                            <MenuItem value={JSON.stringify(item)}>
                              {item.name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                    {/* 点击Go向后台8080端口发送post请求，请求前往Select中选中的步骤next，并请求新的流程图数据，更新到state */}
                    <Button
                      color="inherit"
                      onClick={() => {
                        (async () => {
                          fetch("http://localhost:8080/api/next", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: next,
                          }).then(() => {
                            fetch("http://localhost:8080/api/current")
                              .then((res) => res.json())
                              .then((res) => setCurrent(res))
                              .then(() =>
                                fetch("http://localhost:8080/api/next")
                                  .then((res) => res.json())
                                  .then((res) => setNexts(res))
                              );
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
              </React.Fragment>
            </Paper>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
});
