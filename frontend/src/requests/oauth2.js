import axios from "axios";
var querystring = require('querystring');

const base64='ZW5ncmFmbzplbmdyYWZv'  //engrafo:engrafo

export default{
  async login(username,password){
    const {data} = await axios.post(
      'http://localhost:8123/oauth/token',
      querystring.stringify({
        grant_type:'password',
        username:username,
        password:password
      }),
      {
        headers:{
          'Authorization': 'Basic '+base64,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    )
    return data
  },
  async refresh(refresh_token){
    const {data} = await axios.post(
      'http://localhost:8123/oauth/token',
      querystring.stringify({
        grant_type:'refresh_token',
        refresh_token:refresh_token,
      }),
      {
        headers:{
          'Authorization': 'Basic '+base64,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    )
    return data
  }
}


// axios.interceptors.request.use(function (config) {
//   const sessionStorage=window.sessionStorage.getItem("oauth2Token")
//   const token=JSON.parse(sessionStorage?sessionStorage:'{}')
//   const auth = token.accessToken
//   console.log(auth)
//   config.headers.Authorization =  auth;
//   return config;
// });