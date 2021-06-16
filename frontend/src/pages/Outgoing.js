import Form from "@rjsf/fluent-ui";
import { Label } from "@fluentui/react/lib/Label";
import Graph from "../components/Graph.js";
// const data = {
//     "saler": "鲁智深",
//     "engineer": "张飞",
//     "deliver" : "大华摄像头*1+D-LINK24口百兆交换机*1+上次大华摄像头*11",
//     "debug" : "",
//     "visit" : "",
//     "install": "需要从天花板连线，安装摄像头",
//     "feedback": "",
//     "client": {
//       "company": "金陵学院",
//       "name": "韩梅梅",
//       "phone_no": "19900605345",
//       "address": "九乡河街道123号"
//     },
// }

const graphData = {
  nodes: [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
    { id: 6, label: "Node 6" },
    { id: 7, label: "Node 7" },
    { id: 8, label: "Node 8" },
  ],
  edges: [
    { from: 1, to: 8, arrows: "to", dashes: true },
    { from: 1, to: 3, arrows: "to" },
    { from: 1, to: 2, arrows: "to, from" },
    { from: 2, to: 4, arrows: "to, middle" },
    { from: 2, to: 5, arrows: "to, middle, from" },
    { from: 5, to: 6, arrows: { to: { scaleFactor: 2 } } },
    {
      from: 6,
      to: 7,
      arrows: { middle: { scaleFactor: 0.5 }, from: true },
    },
  ],
};

const graphOptions = {
  physics: true
}

const schema = {
  title: "Outgoing",
  type: "object",
  required: ["saler", "engineer", "client"],
  properties: {
    saler: {
      type: "string",
      title: "销售员",
      enum: ["鲁智深", "史进", "李逵"],
    },
    engineer: {
      type: "string",
      title: "工程师",
      enum: ["张飞", "许褚", "典韦"],
    },
    client: {
      type: "string",
      title: "客户",
      enum: ["李雷", "韩梅梅", "南希"],
    },
    state: {
      type: "object",
      title: "状态",
      properties: {
        uri: {
          type: "string",
          title: "udo-ref",
        },
      },
    },
  },
};

// register custom fields
const fields = {
  apmn: (props) => {
    const { id, classNames, required, disabled, schema, uiSchema } = props;
    console.log(props)
    return (
      <div className={classNames} style={{height: '400px'}}>
        <Label required={required} htmlFor={id} disabled={disabled}>
          {schema.title||uiSchema["ui:title"]||null}
        </Label>
        <Graph identifier={id} graph={graphData} options={graphOptions}/>
      </div>
    );
  }
};

const uiSchema = {
  state: {
    "ui:field": "apmn",
    "ui:container": {
      height: '100px'
    } 
  },
};

function Outgoing() {
  return (
    <div style={{ width: "500px", margin: "auto" }}>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        fields={fields}
        onChange={(data) => console.log(data)}
      />
    </div>
  );
}

export default Outgoing;
