const { default: axios } = require("axios")
const {Base64} = require('js-base64');

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

const getUsernameFromAccessToken = (accessToken) => {
  const decodedAccessToken = Base64.decode(accessToken)
  const info = decodedAccessToken.split(':')
  return info[0]
}

module.exports = {
  authentication,
  getUsernameFromAccessToken
}