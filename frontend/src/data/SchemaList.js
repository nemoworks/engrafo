import { makeAutoObservable } from "mobx";
import originList from "./originList.json";
import templateschema from "./simpleForm.json";

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

  delete(id) {
    this.data = this.data.filter((item) => item._id["$oid"] !== id);
  }
}

const schemastore = new SchemaList();

export default schemastore;
