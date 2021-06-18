import Editor from "@monaco-editor/react";
import { createForm } from "@formily/core";
import { createSchemaField } from "@formily/react";
import { useState, useEffect, useRef } from "react";
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
  DatePicker,
  Submit,
  FormGrid,
  Upload,
  ArrayItems,
  Editable,
  FormButtonGroup,
} from "@formily/antd";
import { action } from "@formily/reactive";
import { Card, Button, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "@formily/antd/dist/antd.css";

const form = createForm({
  validateFirst: true,
});

const IDUpload = (props) => {
  return (
    <Upload
      {...props}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      headers={{
        authorization: "authorization-text",
      }}
    >
      <Button icon={<UploadOutlined />}>上传复印件</Button>
    </Upload>
  );
};

var SchemaField = {
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker,
    Cascader,
    Select,
    IDUpload,
    ArrayItems,
    Editable,
  },
  scope: {
    fetchAddress: (field) => {
      const transform = (data = {}) => {
        return Object.entries(data).reduce((buf, [key, value]) => {
          if (typeof value === "string")
            return buf.concat({
              label: value,
              value: key,
            });
          const { name, code, cities, districts } = value;
          const _cities = transform(cities);
          const _districts = transform(districts);
          return buf.concat({
            label: name,
            value: code,
            children: _cities.length
              ? _cities
              : _districts.length
              ? _districts
              : undefined,
          });
        }, []);
      };

      fetch("//unpkg.com/china-location/dist/location.json")
        .then((res) => res.json())
        .then(
          action((data) => {
            field.dataSource = transform(data);
          })
        );
    },
  },
};

var schema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      title: "用户名",
      required: true,
      "x-decorator": "FormItem",
      "x-component": "Input",
    },
    name: {
      type: "void",
      title: "姓名",
      "x-decorator": "FormItem",
      "x-decorator-props": {
        asterisk: true,
        feedbackLayout: "none",
      },
      "x-component": "FormGrid",
      properties: {
        firstName: {
          type: "string",
          required: true,
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-component-props": {
            placeholder: "姓",
          },
        },
        lastName: {
          type: "string",
          required: true,
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-component-props": {
            placeholder: "名",
          },
        },
      },
    },
    email: {
      type: "string",
      title: "邮箱",
      required: true,
      "x-decorator": "FormItem",
      "x-component": "Input",
      "x-validator": "email",
    },
    gender: {
      type: "string",
      title: "性别",
      enum: [
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 2,
        },
        {
          label: "第三性别",
          value: 3,
        },
      ],
      "x-decorator": "FormItem",
      "x-component": "Select",
    },
    birthday: {
      type: "string",
      required: true,
      title: "生日",
      "x-decorator": "FormItem",
      "x-component": "DatePicker",
    },
    address: {
      type: "string",
      required: true,
      title: "地址",
      "x-decorator": "FormItem",
      "x-component": "Cascader",
      "x-reactions": "{{fetchAddress}}",
    },
    idCard: {
      type: "string",
      required: true,
      title: "身份证复印件",
      "x-decorator": "FormItem",
      "x-component": "IDUpload",
    },
    contacts: {
      type: "array",
      required: true,
      title: "联系人信息",
      "x-decorator": "FormItem",
      "x-component": "ArrayItems",
      items: {
        type: "object",
        "x-component": "ArrayItems.Item",
        properties: {
          sort: {
            type: "void",
            "x-decorator": "FormItem",
            "x-component": "ArrayItems.SortHandle",
          },
          popover: {
            type: "void",
            title: "完善联系人信息",
            "x-decorator": "Editable.Popover",
            "x-component": "FormLayout",
            "x-component-props": {
              layout: "vertical",
            },
            "x-reactions": [
              {
                fulfill: {
                  schema: {
                    title: '{{$self.query(".name").value() }}',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: "string",
                title: "姓名",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  style: {
                    width: 300,
                  },
                },
              },
              email: {
                type: "string",
                title: "邮箱",
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-validator": [{ required: true }, "email"],
                "x-component-props": {
                  style: {
                    width: 300,
                  },
                },
              },
              phone: {
                type: "string",
                title: "手机号",
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-validator": [{ required: true }, "phone"],
                "x-component-props": {
                  style: {
                    width: 300,
                  },
                },
              },
            },
          },
          remove: {
            type: "void",
            "x-decorator": "FormItem",
            "x-component": "ArrayItems.Remove",
          },
        },
      },
      properties: {
        addition: {
          type: "void",
          title: "新增联系人",
          "x-component": "ArrayItems.Addition",
        },
      },
    },
  },
};

function SchemaBoard() {
  const [formSchema, setForm] = useState({
    schema: schema,
    SchemaField: createSchemaField(SchemaField),
  });

  useEffect(() => {
    form.setInitialValues({
      username: "Aston Martin",
      firstName: "Aston",
      lastName: "Martin",
      email: "aston_martin@aston.com",
      gender: 1,
      birthday: "1836-01-03",
      address: ["110000", "110000", "110101"],
      idCard: [
        {
          name: "this is image",
          thumbUrl:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          uid: "rc-upload-1615825692847-2",
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
      ],
      contacts: [
        { name: "张三", phone: "13245633378", email: "zhangsan@gmail.com" },
        { name: "李四", phone: "16873452678", email: "lisi@gmail.com" },
      ],
    });
  }, []);
  const editorRef = useRef(null);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          width: "45%",
          height: "90%",
          top: "20px",
          justifyContent: "center",
          background: "#eee",
          padding: "40px 0",
        }}
      >
        <Card
          title="Schema"
          style={{
            width: "100%",
            height: "80%",
          }}
          extra={
            <div style={{ justifyContent: "align-left" }}>
              <Switch
                checkedChildren="文本"
                unCheckedChildren="生成"
                defaultChecked
                onChange={() => console.log("switching")}
                style={{ right: "20px" }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setForm({
                    ...formSchema,
                    schema: schema,
                  });
                }}
              >
                应用
              </Button>
            </div>
          }
        >
          <Editor
            height="70vh"
            defaultLanguage="json"
            defaultValue={JSON.stringify(schema, null, "\t")}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
            }}
            onChange={(value, event) => (schema = JSON.parse(value))}
          />
        </Card>
      </div>
      <div
        style={{
          display: "flex",
          width: "45%",
          height: "90%",
          top: "20px",
          justifyContent: "center",
          background: "#eee",
          padding: "40px 0",
        }}
      >
        <Card
          title="编辑用户"
          style={{
            width: "100%",
            height: "80%",
          }}
          extra={
            <Button type="primary" size="small" onClick={() => {}}>
              保存
            </Button>
          }
        >
          <Form
            style={{
              height: "70vh",
            }}
            form={form}
            labelCol={5}
            wrapperCol={16}
            onAutoSubmit={console.log}
          >
            <formSchema.SchemaField schema={formSchema.schema} />
            <FormButtonGroup.FormItem>
              <Submit block size="large">
                提交
              </Submit>
            </FormButtonGroup.FormItem>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default SchemaBoard;
