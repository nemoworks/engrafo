import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { DatasetReq } from './requests';

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList({ open: drawerOpen }) {
  const classes = useStyles();
  const [modelChildOpen, setModelChildOpen] = React.useState(false);
  const [datasetChildOpen, setDatasetChildOpen] = useState(false)
  const [titleList, setTitleList] = useState([])

  useEffect(() => {
    DatasetReq.get().then(data => {
      var newTitleList = []
      for (var i = 0; i < data.length; i++) {
        var { formschema: { fieldschema: { title } }, id } = data[i]
        title = title ? title : id
        newTitleList.push({ title, id })
      }
      setTitleList(newTitleList)
    })
  }, [])

  useEffect(() => {
    if (!drawerOpen) {
      setModelChildOpen(false)
      setDatasetChildOpen(false)
    }
  }, [drawerOpen])


  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem button onClick={() => { if (drawerOpen) setModelChildOpen(!modelChildOpen); }}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="模型" />
        {modelChildOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={modelChildOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemLink href="/dmlist" className={classes.nested}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="数据模型" />
          </ListItemLink>
          <ListItemLink href="/fmlist" className={classes.nested}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="流程模型" />
          </ListItemLink>
        </List>
      </Collapse>

      <ListItemLink href="/businesslist">
        <ListItemIcon>
          <BusinessCenterIcon />
        </ListItemIcon>
        <ListItemText primary="业务数据" />
      </ListItemLink>

      <ListItem button onClick={() => { if (drawerOpen) setDatasetChildOpen(!datasetChildOpen); }}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="数据集合" />
        {datasetChildOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={datasetChildOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {titleList ? titleList.map(value => {
            const { title, id } = value
            return (
              <ListItemLink key={id} href={"/dataset/" + id} className={classes.nested}>
                {/* <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon> */}
                <ListItemText primary={title} />
              </ListItemLink>
            )
          }) : null}
        </List>
      </Collapse>

      <ListItemLink href="/datasheet">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="DataSheet" />
      </ListItemLink>
    </List>
  );
}