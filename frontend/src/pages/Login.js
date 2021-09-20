import React from "react";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {Oauth2Req} from "../requests";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 5,
  },
}));

export default function(){
  const classes = useStyles();
  const [username,setUsername] = React.useState('')
  const [password,setPassword] = React.useState('')

  React.useEffect(()=>{
    const token=window.sessionStorage.getItem("oauth2Token")
    console.log(token)
  },[])

  return(
    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <TextField 
          id="outlined-basic" 
          label="用户名" 
          variant="outlined" 
          onChange={(event)=>{
            setUsername(event.target.value)
          }
        }/>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="outlined-password-input"
          label="密码"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          onChange={(event)=>{
            setPassword(event.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={()=>{
            Oauth2Req.login(username,password).then(data=>{
              // console.log(data)
              if(data.accessToken!=undefined){
                window.sessionStorage.setItem('oauth2Token', JSON.stringify(data));
              }
            })
          }}
        >
          登录
        </Button>
      </Grid>
    </Grid>
  )
}