const { default: axios } = require("axios")

async function  authentication(Authorization){
  console.log('Authorization',Authorization)
  const {data} = await axios.request({
    url:'http://localhost:8123/',
    method:'GET',
    headers:{
      'Authorization':Authorization
    }
  })
  return data
}

module.exports = {
  authentication
}