import React from "react";
import Title from "../components/Title";
import Grid from "@material-ui/core/Grid";
import Editor from "@monaco-editor/react";
import FixedHeightContainer from "../components/FixedHeightContainer";
import FStemplates from "../requests/FStemplates";
import CustomForm from "../components/Form/CustomForm";

var _ = require('lodash');

export default function Preview({id}){

    const [schema, setSchema] = React.useState({});
    const [uiSchema, setUiSchema] = React.useState({});

  React.useEffect(()=>{
    FStemplates.get(id).then(data=>{
      const {formschema:{fieldschema:schema,uischema:uiSchema}}=data
      setSchema(schema)
      setUiSchema(uiSchema)
    })
    
  },[])

    return (
        <div>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>SchemaEditor</Title>
              <p>schema</p>
              <Editor
                title="Schema"
                language="json"
                value={JSON.stringify(schema, null, "\t")}
                options={{readOnly:true}}
              />
              <p>ui:schema</p>
              <Editor
                language="json"
                value={JSON.stringify(uiSchema, null, "\t")}
                options={{readOnly:true}}
              />
            </FixedHeightContainer>
          </Grid>
          <Grid item xs={6}>
            <FixedHeightContainer height={800}>
              <Title>SchemaForm</Title>
              <CustomForm
                onSubmit={({ formData }) => {
                  alert(
                    JSON.stringify(formData)
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