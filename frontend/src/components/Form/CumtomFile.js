import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import { OutgoingReq } from '../../requests';
import {writeFile} from 'fs'

const useStyles = makeStyles((theme) => ({
  download: {
    width: '64px'
  },
}));

export default function(props){
  const classes = useStyles();
  const {schema:{title},label:name,value:formData}=props
  const label=title?title:(name?name:'')

  const processFile = (files) => {
    const f = files[0];
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(f);
    });
  }

  const display = () =>{
    if(typeof(formData)==='string'){
      if(formData.includes('data:',0)&&formData.includes('base64')){
        return true
      }else{
        return false
      }
    }else if(formData==undefined||formData==null){
      return true
    }else{
      console.log(typeof(formData))
      return false
    }
  }

  return (
    <>
      <span style={{marginBottom:'10px',fontSize:'12px',color:'grey'}}>{label}</span>
      {display()?
        <input type="file"
          required={props.required}
          onChange={(event) => processFile(event.target.files).then(data=>{
            console.log(data)
            props.onChange(data)})} 
        />
        :<>
          <span>{formData}</span>
          <Button variant="contained" color="primary" classes={classes.download} onClick={()=>{
            OutgoingReq.downloadFile(formData).then(data=>{
              const url = window.URL.createObjectURL(data);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', formData); //or any other extension
              document.body.appendChild(link);
              link.click();
            })
            
          }}>
            下载
          </Button>
        </>
      }
    </>
  )
}