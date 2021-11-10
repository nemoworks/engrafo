import React from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

const months=[
  {value:'1',label:'一月'},
  {value:'2',label:'二月'},
  {value:'3',label:'三月'},
  {value:'4',label:'四月'},
  {value:'5',label:'五月'},
  {value:'6',label:'六月'},
  {value:'7',label:'七月'},
  {value:'8',label:'八月'},
  {value:'9',label:'九月'},
  {value:'10',label:'十月'},
  {value:'11',label:'十一月'},
  {value:'12',label:'十二月'},
]

export default function(props){
  const classes = useStyles();
  const {schema:{title},label:name,value:formData}=props
  const label=title?title:(name?name:'')

  const [value, setValue] = React.useState(formData?formData:'');

  const handleChange = (event) => {
    const current=event.target.value
    setValue(current);
    props.onChange(current)
  };

  return(
    <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
        >
          {months.map(m=>{
            return <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
          })}
        </Select>
      </FormControl>
  )
}