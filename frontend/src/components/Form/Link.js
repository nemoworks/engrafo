import React from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useEffect, useState } from "react";
import { LinkReq } from "../../requests";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

export default function (props) {
  const classes = useStyles();
  console.log(props)
  const { schema: { title, source, key }, label: name, value: formData } = props
  const label = title ? title : (name ? name : '')

  const [value, setValue] = React.useState(formData ? formData : '');
  const [salers, setSalers] = useState([])

  const handleChange = (event) => {
    const current = event.target.value
    setValue(current);
    props.onChange(current)
  };

  useEffect(() => {
    if (source) {
      LinkReq.get(source,{key}).then(data => {
        setSalers(data)
      })
    }
  }, [source])

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
      >
        {salers.map(s => {
          return <MenuItem key={s[key]} value={s[key]}>{s[key]}</MenuItem>
        })}
      </Select>
    </FormControl>
  )
}