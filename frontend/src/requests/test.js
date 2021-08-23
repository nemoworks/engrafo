const fetch = require("node-fetch")
fetch("http://localhost:8080/api/FStemplates/", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    formschema: {
      "data": "testfetch"
    }
  })
}).then(res => res.json()).then(res => console.log(res))

