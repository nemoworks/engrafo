import React from "react";
import Title from "../../components/Title";
import Grid from "@material-ui/core/Grid";
import Editor from "@monaco-editor/react";
import Form from "@rjsf/material-ui";
import FixedHeightContainer from "../../components/FixedHeightContainer";

  const outgoingSchema={
    schema:{
      "title": "外派单",
      "description": "外派单记录",
      "type": "object",
      "properties": {
        "manager": {
            "title": "管理员",
            "type": "string",
            "enum": ["张三", "李四", "吴九"]
        },
        "saler": {
          "title": "销售员",
          "type": "string",
          "enum": ["田七", "谢八", "周廿"]
        },
        "engineer": {
          "title": "工程师",
          "type": "string",
          "enum": ["赵五", "郑六", "庞十"]
        },
        "status": {
          "title": "工程师接单",
          "type": "boolean"
        },
        "feedback": {
          "title": "客户反馈",
          "type": "string"
        }
      }
    },
    uiSchema:{
      "feedback":{
          "ui:widget": "textarea"
      }
  }
  }

export default function Preview(){
    const [schema, setSchema] = React.useState({});
    const [uiSchema, setUiSchema] = React.useState({});

  React.useEffect(()=>{
    setSchema(outgoingSchema.schema)
    setUiSchema(outgoingSchema.uiSchema)
  },[])

    return (
        <div>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>SchemaEditor</Title>
              <p>schema</p>
              <Editor
                title="Schema"
                defaultLanguage="json"
                defaultValue={JSON.stringify(schema, null, "\t")}
              />
              <p>ui:schema</p>
              <Editor
                defaultLanguage="json"
                defaultValue={JSON.stringify(uiSchema, null, "\t")}
              />
            </FixedHeightContainer>
          </Grid>
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>SchemaForm</Title>
              <Form
                onSubmit={({ formData }) => {
                  alert(
                    JSON.stringify({
                      ...formData,
                      schema: schema,
                      uischema: uiSchema,
                    })
                  );
                }}
                schema={schema}
                uiSchema={uiSchema}
              />
            </FixedHeightContainer>
          </Grid>
        </Grid>
        </div>
    )
}