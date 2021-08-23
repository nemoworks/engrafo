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

  const rows = [
    {
      id: "1000",
      name:"外派单",
      link:"/outgoing",
    },
    {
      id: "1001",
      name:"请假单",
      link:"/vacation",
    },
  ];

export default function  BusinessList(){
  const [open, setOpen] = React.useState(false);
  const [schema, setSchema] = React.useState({});
  const [uischema, setUischema] = React.useState({});
  const [entry, setEntry] = React.useState({ toSave: false });
  //monaco editor需要绑定ref
  const editorRef = React.useRef(null);
  const uiEditorRef = React.useRef(null);

  // const [rows,setRows]=React.useState([])
  
  const classes = useStyles();
    
  // React.useEffect(()=>{
  //   FStemplates.getAll().then(data=>{
  //     setRows(data)
  //   })
  // },[])

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return(
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
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      <Link color="inherit" href={"/businesslist"+row.link}>
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
                          console.log('delete',row)
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
        </Table>
      </FixedHeightContainer>
      
    )
}