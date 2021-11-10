import React from "react"
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FixedHeightContainer from "../components/FixedHeightContainer";
import FStemplates from "../requests/FStemplates";
import { OutgoingReq } from "../requests";

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

export default function Dataset({ id }) {

  const [rows, setRows] = React.useState([])

  const classes = useStyles();

  React.useEffect(() => {
    OutgoingReq.getListByFStempaltesId(id).then(data=>{
      setRows(data)
    })
  }, [])
  
  return (
    <FixedHeightContainer height={800}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">
                  <Link color="inherit" href={"/business/" + row.id}>
                    <IconButton
                      aria-label="preview"
                      color="primary"
                      className={classes.margin}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    className={classes.margin}
                    onClick={() => {
                      OutgoingReq.delete(row.id).then(data=>{
                        setRows(rows.filter(r=>r.id!==row.id))
                      })
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          }) : null}
        </TableBody>
      </Table>
    </FixedHeightContainer>

  )
}