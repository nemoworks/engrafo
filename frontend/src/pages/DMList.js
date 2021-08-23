import React from "react"
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
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
import Form from "@rjsf/material-ui";
import FStemplates from "../requests/FStemplates";

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

  // const rows = [
  //   {
  //     id: "1000",
  //     name:"外派单",
  //     link:"/outgoing",
  //   },
  //   {
  //     id: "1001",
  //     name:"请假单",
  //     link:"/vacation",
  //   },
  // ];

export default function  DMList(){
  const [open, setOpen] = React.useState(false);
  const [schema, setSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});

  //monaco editor需要绑定ref
  const editorRef = React.useRef(null);
  const uiEditorRef = React.useRef(null);

  const [rows,setRows]=React.useState([])
  
  const classes = useStyles();
  
  React.useEffect(()=>{
    FStemplates.getAll().then(data=>{
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
                  <TableCell align="center">模型名称</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.formschema.fieldschema.title}</TableCell>
                    <TableCell align="center">
                      <Link color="inherit" href={"/dmlist/preview/"+row.id}>
                      <IconButton
                        aria-label="preview"
                        color="primary"
                        className={classes.margin}
                        onClick={() => {
                          console.log('preview',row)
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      </Link>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        className={classes.margin}
                        onClick={() => {
                          FStemplates.delete(row.id).then(data=>{
                            console.log(data)
                          })
                        }}
                      >
                        <DeleteIcon fontSize="small" />
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
              SchemaFormEditor
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                FStemplates.create({formschema:{fieldschema:schema,uischema:uiSchema}}).then(data=>{
                  console.log(data)
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
                defaultValue={JSON.stringify(schema, null, "\t")}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                }}
                onChange={(value, event) => {}}
              />
              <p>ui:schema</p>
              <Editor
                defaultLanguage="json"
                defaultValue={JSON.stringify(uiSchema, null, "\t")}
                onMount={(editor, monaco) => {
                  uiEditorRef.current = editor;
                }}
                onChange={(value, event) => {}}
              />
              <div>
                {/* 点击apply将schema与uischema传入state，通过editor的ref读取编辑器中的内容 */}
                <Button
                  className={classes.stickRight}
                  color="primary"
                  onClick={() => {
                    setSchema(JSON.parse(editorRef.current.getValue()));
                    setUiSchema(JSON.parse(uiEditorRef.current.getValue()));
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
                      uischema: uiSchema,
                    })
                  );
                }}
                schema={schema}
                uiSchema={uiSchema}
              />
              
            </FixedHeightContainer>
          </Grid>
        </Grid>
      </Dialog>
        </>
    )
}