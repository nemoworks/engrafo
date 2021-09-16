import Form from "@rjsf/material-ui";
import React from "react";
import CustomDate from "./CustomDate";
import CustomMonth from "./CustomMonth";
import CustomFile from "./CumtomFile"

{/**usage

  schema = {
	  "type": "object",
    "properties": {
      "currenMonth": {
        "type": "string"
      }
    }
  }

  uiSchema = {
	  "currenMonth": {
		  "ui:widget": "customMonth"   （*）
    }
  }

  customDate,customMonth,customFile唯一区别就是（*）行的区别

*/}

export default function(props){
  const widgets={
    "year-month-date":CustomDate,
    "month-date":CustomMonth,
    "base64-file":CustomFile
  }
  return(
    <Form
      onSubmit={props.onSubmit}
      schema={props.schema}
      uiSchema={props.uiSchema}
      formData={props.formData}
      widgets={widgets}
    />
  )
}