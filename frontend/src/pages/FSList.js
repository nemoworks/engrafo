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
import { observer } from "mobx-react";
import Editor from "@monaco-editor/react";
import Form from '@rjsf/material-ui';
// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

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
  }
}));

export default observer(function FSList({ schemalist }) {
  const rows = schemalist.data;
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [open, setOpen] = React.useState(false);
  const [schema, setSchema] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editorRef = React.useRef(null);

  return (
    <>
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={8}>
          <Paper className={fixedHeightPaper}>
            <React.Fragment>
              <Title>All Schemas</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell align="center">Operation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.comment}</TableCell>
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
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="preview"
                          color="primary"
                          className={classes.margin}
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
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={6} justify="center" alignItems="center">
          <Grid item xs={4}>
            <Paper className={fixedHeightPaper}>
              <React.Fragment>
                <Title>SchemaEditor</Title>
                <Editor
                  defaultLanguage="json"
                  defaultValue={JSON.stringify(schema, null, "\t")}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                  }}
                  onChange={(value, event) => console.log(value)}
                />
                <div>
                <Button className={classes.stickRight} color="primary" onClick={()=>setSchema(JSON.parse(editorRef.current.getValue()))}>
                    apply
                </Button>
                </div>
              </React.Fragment>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={fixedHeightPaper}>
              <React.Fragment>
                <Title>SchemaForm</Title>
                <Form onSubmit={({formData}) => alert(JSON.stringify(formData))} schema={schema} />
              </React.Fragment>
            </Paper>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
});
