import React from "react"
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import FixedHeightContainer from "../components/FixedHeightContainer";
import Title from "../components/Title";
import Editor from "@monaco-editor/react";
import LCtemplates from "../requests/LCtemplates";
import Graph from "../components/Graph.js";

const graphOptions = {
  physics: {},
  interaction: {
    zoomView: false,
    dragNodes: false,
  },
};


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

export default function  FMList(){
  const [open, setOpen] = React.useState(false);
  const [graph, setGraph] = React.useState({ nodes: [], edges: [] });
  const [graphEdit,setGraphEdit] = React.useState({graph:{ nodes: [], edges: [] },start:''});

  //monaco editor需要绑定ref
  const editorRef = React.useRef(null);
  
  const classes = useStyles();
  
  const [rows,setRows]=React.useState([])

  React.useEffect(()=>{
    LCtemplates.getAll().then(data=>{
      setRows(data)
    })
  },[])

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return(
      <>
        <FixedHeightContainer height={800}>
        <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length>0?rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">
                      <Link color="inherit" href={"/fmlist/preview/"+row.id}>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        className={classes.margin}
                      >
                        {/* {编辑按钮，需要添加跳转详情页} */}
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      </Link>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        className={classes.margin}
                        onClick={() => {
                          LCtemplates.delete(row.id).then(data=>{
                            setRows(rows.filter(r=>r.id!=row.id))
                          })
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )):null}
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              <AddIcon fontSize="medium" />
            </Button>
            </FixedHeightContainer>
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
              FlowEditor
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                LCtemplates.create({enkrino:graphEdit}).then(data=>{
                  handleClose();
                  LCtemplates.getAll().then(data=>{
                    setRows(data)
                  })
                })
                
              }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>FlowEditor</Title>
              {/* monaco editor的onchange函数不够灵活，此处在创建时onMount中绑定到ref，以便后续查询editor中的value */}
              <Editor
                title="Schema"
                language="json"
                value={JSON.stringify(graphEdit, null, "\t")}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                }}
                onChange={(value, event) => {}}
              />
              <div>
                {/* 点击apply将schema与uischema传入state，通过editor的ref读取编辑器中的内容 */}
                <Button
                  className={classes.stickRight}
                  color="primary"
                  onClick={() => {
                    setGraphEdit(JSON.parse(editorRef.current.getValue()))
                    let newGraph=JSON.parse(editorRef.current.getValue()).graph
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
    )
}