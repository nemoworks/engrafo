import React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker'

export default function(props){
  console.log(props)
  const {schema:{title},label:name,value:formData}=props
  const label=title?title:(name?name:'')
  const [value, setValue] = React.useState(formData?new Date(formData+'-01T00:00:00'):null);

  return(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
          views={['year','month']}
          label={label}
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
            const newDate=new Date(newValue)
            const currentMonth=newDate.getMonth()+1
            const dateStr = newDate.getFullYear()+'-'+(currentMonth>=10?currentMonth:'0'+currentMonth)
            props.onChange(dateStr)
          }}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
    </LocalizationProvider>
  ) 
}