import { makeAutoObservable } from "mobx";
import originList from "./originList.json";
const templateschema = {
  schema: {
    title: "Outgoing Service",
    description: "Log each service.",
    type: "object",
    properties: {
      _id: {
        title: "",
        type: "object",
        properties: {
          $oid: {
            title: "service id",
            type: "string",
          },
        },
      },
      saler: {
        title: "saler name",
        type: "string",
        enum: ["朱鸣", "许万羽", "苏井", "李倍铭", "周坚", "钱昊"],
      },
      feedback: {
        title: "service feedback",
        type: "string",
      },
    },
  },
  uischema: {
    feedback: {
      "ui:widget": "textarea",
    },
  },
};

class SchemaList {
  data = originList.map((item) =>
    item.schema && item.uischema
      ? item
      : {
          ...item,
          schema: templateschema.schema,
          uischema: templateschema.uischema,
        }
  );

  constructor() {
    makeAutoObservable(this);
  }

  add(item) {
    this.data.push(item);
  }

  delete(id){
    this.data = this.data.filter(item => item._id["$oid"]!==id);
  }
}

const schemastore = new SchemaList();

export default schemastore;
