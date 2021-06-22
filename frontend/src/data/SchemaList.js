import { makeAutoObservable } from "mobx";

class SchemaList {
  data = [{ id: 1 }];

  constructor() {
    makeAutoObservable(this);
  }
}

const schemastore = new SchemaList();

export default schemastore;
