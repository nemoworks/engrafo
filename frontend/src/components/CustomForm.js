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
		  "ui:field": "customMonth"   （*）
    }
  }

  customDate,customMonth,customFile唯一区别就是（*）行的区别

*/}

export default function(props){
  const fields={
    "customDate":CustomDate,
    "customMonth":CustomMonth,
    "customFile":CustomFile
  }
  return(
    <Form
      onSubmit={props.onSubmit}
      schema={props.schema}
      uiSchema={props.uiSchema}
      formData={props.formData}
      fields={fields}
    />
  )
}