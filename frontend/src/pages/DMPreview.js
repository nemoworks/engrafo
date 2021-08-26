import React from "react";
import Title from "../components/Title";
import Grid from "@material-ui/core/Grid";
import Editor from "@monaco-editor/react";
import Form from "@rjsf/material-ui";
import FixedHeightContainer from "../components/FixedHeightContainer";
import FStemplates from "../requests/FStemplates";
import { keys2disabled } from "../utils/schema";
var _ = require('lodash');

export default function Preview({id}){

    const [schema, setSchema] = React.useState({});
    const [uiSchema, setUiSchema] = React.useState({});

  React.useEffect(()=>{
    FStemplates.get(id).then(data=>{
      const {formschema:{fieldschema:schema,uischema:uiSchema}}=data
      setSchema(schema)
      setUiSchema(uiSchema)

      // const keys =  [
      //   "manager",
      //   "engineer",
      //   "status",
      //   "feedback",
      //   "saler"
      // ]
      // setUiSchema(_.merge(keys2disabled(keys),uiSchema))
    })
    
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
                options={{readOnly:true}}
              />
              <p>ui:schema</p>
              <Editor
                defaultLanguage="json"
                defaultValue={JSON.stringify(uiSchema, null, "\t")}
                options={{readOnly:true}}
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