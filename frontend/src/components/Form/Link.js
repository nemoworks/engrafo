import React from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useEffect, useState } from "react";
import { LinkReq } from "../../requests";
import Button from '@material-ui/core/Button';
import CustomForm from "./CustomForm";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

const sche = {
  "type": "object",
  "title": "未确认款项",
  "properties": {
    "amount": {
      "type": "number",
      "title": "到账金额(元)"
    },
    "company": {
      "enum": [
        "杰世欣",
        "骏岭",
        "其他"
      ],
      "type": "string",
      "title": "公司名称"
    },
    "appendix": {
      "type": "string",
      "title": "备注"
    },
    "customer": {
      "type": "string",
      "title": "客户单位"
    },
    "tradeDate": {
      "type": "string",
      "title": "交易时间"
    }
  }
}
const addNewElement = 'AddNewElement'

export default function (props) {
  const classes = useStyles();
  console.log(props)
  const { schema: { title, source, key, schemaSource }, label: name, value: formData } = props
  const label = title ? title : (name ? name : '')

  const [value, setValue] = React.useState(formData ? formData : '');
  const [sourceData, setSourceData] = useState([])

  const [linkSchema, setLinkSchema] = useState(null)
  const [isAddModel, setIsAddModel] = useState(false)

  const handleChange = (event) => {
    const current = event.target.value
    if (current === addNewElement) {
      setIsAddModel(true)
      if (!linkSchema) {
        LinkReq.get(schemaSource).then(data => {
          setLinkSchema(data)
        })
      }
    } else {
      setValue(current);
      props.onChange(current)
    }
  };

  useEffect(() => {
    if (source) {
      LinkReq.get(source).then(data => {
        setSourceData(data)
      })
    }
  }, [source])

  // useEffect(() => {
  //   if (schemaSource) {
  //     LinkReq.get(schemaSource).then(data => {
  //       setLinkSchema(data)
  //       console.log(data)
  //     })
  //   }
  // }, [schemaSource])

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
        >
          {sourceData.map(s => {
            return <MenuItem key={s[key]} value={s[key]}>{s[key]}</MenuItem>
          })}
          <MenuItem key={addNewElement} value={addNewElement}>添加新数据</MenuItem>
        </Select>
      </FormControl>
      {isAddModel && linkSchema ?
        <Paper elevation={2} style={{ marginTop: '10px', padding: '20px' }}>
          <CustomForm
            onSubmit={(data) => {
              console.log(data)
            }}
            schema={linkSchema.formschema.fieldschema}
            uiSchema={linkSchema.formschema.uischema}
          ></CustomForm>
        </Paper>
        : null}
    </>
  )
}