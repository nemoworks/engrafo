import React from "react";
import Grid from "@material-ui/core/Grid";
import FixedHeightContainer from "../components/FixedHeightContainer";
import Title from "../components/Title";
import Editor from "@monaco-editor/react";
import CustomForm from "../components/Form/CustomForm";
import Button from "@material-ui/core/Button";
import DataSheet from "../components/DataSheet/DataSheet";

export default function () {
  const [schema, setSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});

  const editorRef = React.useRef(null);
  const uiEditorRef = React.useRef(null);

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      <Grid item xs={6}>
        <FixedHeightContainer height={700}>
          <Title>SchemaEditor</Title>
          <p>schema</p>
          {/* monaco editor的onchange函数不够灵活，此处在创建时onMount中绑定到ref，以便后续查询editor中的value */}
          <Editor
            title="Schema"
            language="json"
            value={JSON.stringify(schema, null, "\t")}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
            }}
            onChange={(value, event) => { }}
          />
          <p>ui:schema</p>
          <Editor
            language="json"
            value={JSON.stringify(uiSchema, null, "\t")}
            onMount={(editor, monaco) => {
              uiEditorRef.current = editor;
            }}
            onChange={(value, event) => { }}
          />
          <div>
            {/* 点击apply将schema与uischema传入state，通过editor的ref读取编辑器中的内容 */}
            <Button
              color="primary"
              onClick={() => {
                setSchema(JSON.parse(editorRef.current.getValue()));
                setUiSchema(JSON.parse(uiEditorRef.current.getValue()));
              }}
            >
              apply
            </Button>
          </div>
        </FixedHeightContainer>
      </Grid>
      {/* FSList页面右侧卡片 */}
      <Grid item xs={6}>
        <FixedHeightContainer height={700}>
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
      <Grid item xs={12}>
        <FixedHeightContainer height={700}>
          <Title>DataSheet</Title>
          <DataSheet schema={schema} uiSchema={uiSchema} />
        </FixedHeightContainer>
      </Grid>
    </Grid>
  )
}