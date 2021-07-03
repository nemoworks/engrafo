import Graph from "../components/Graph.js";
import Select from "@material-ui/core/Select";
import startdata from "../data/startdata.json";
import Form from "@rjsf/material-ui";
import Button from "@material-ui/core/Button";
import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
const graphOptions = {
  physics: {},
  interaction: {
    zoomView: false,
    dragNodes: false,
  },
};

const schema = {
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
      enum: ["sam", "amily", "fragile"],
    },
    feedback: {
      title: "service feedback",
      type: "string",
    },
  },
};

const uischema = {
  feedback: {
    "ui:widget": "textarea",
  },
};

export default function Flow() {
  const [next, setNext] = React.useState(null);
  const [graph, setGraph] = React.useState({ nodes: [], edges: [] });
  const [current, setCurrent] = React.useState(null);
  const [nexts, setNexts] = React.useState(null);

  React.useEffect(() => {
    if (!current) {
      return;
    }
    (async () =>
      fetch("http://localhost:8080/api/flow")
        .then((res) => res.json())
        .then((res) => {
          let next = res;
          next.nodes = res.nodes.map((item) =>
            item.id === current.id
              ? { ...item, label: item.name, color: "red" }
              : { ...item, label: item.name, color: "#CCFFFF" }
          );
          next.edges = res.edges.map((item) => {
            return {
              from: item.source,
              to: item.target,
              arrows: "to",
            };
          });
          setGraph(next);
        }))();
  }, [current]);

  return (
    <div>
      {" "}
      <Form
        onSubmit={({ formData }) => {
          alert(
            JSON.stringify({
              ...formData,
              schema: schema,
              uischema: uischema,
            })
          );
        }}
        schema={schema}
        uiSchema={uischema}
      />
      <div style={{ height: "400px", width: "400px", marginTop: "20px" }}>
        <h2>progress</h2>
        <div>
          <Button
            color="inherit"
            onClick={() => {
              (async () => {
                fetch("http://localhost:8080/api/start", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(startdata),
                }).then(() => {
                  fetch("http://localhost:8080/api/current")
                    .then((res) => res.json())
                    .then((res) => setCurrent(res))
                    .then(() =>
                      fetch("http://localhost:8080/api/next")
                        .then((res) => res.json())
                        .then((res) => setNexts(res))
                    );
                });
              })();
            }}
          >
            Start
          </Button>
          <Select
            style={{ marginLeft: "50px" }}
            labelId="select-label"
            id="demo-simple-select"
            value={next ? next : undefined}
            onChange={(e) => {
              setNext(e.target.value);
            }}
          >
            {nexts
              ? nexts.map((item) => (
                  <MenuItem value={JSON.stringify(item)}>{item.name}</MenuItem>
                ))
              : null}
          </Select>
          <Button
            color="inherit"
            onClick={() => {
              (async () => {
                fetch("http://localhost:8080/api/next", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: next,
                }).then(() => {
                  fetch("http://localhost:8080/api/current")
                    .then((res) => res.json())
                    .then((res) => setCurrent(res))
                    .then(() =>
                      fetch("http://localhost:8080/api/next")
                        .then((res) => res.json())
                        .then((res) => setNexts(res))
                    );
                });
              })();
            }}
          >
            Go
          </Button>
        </div>
        <Graph
          identifier={"customed-flow-graph-demo"}
          graph={graph}
          options={graphOptions}
        />
      </div>
    </div>
  );
}
