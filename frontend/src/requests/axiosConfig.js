import axios from 'axios';
import {Oauth2Req} from "../requests";

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token=window.sessionStorage.getItem("oauth2Token")
  if(token){
    if(config.headers.Authorization==null||config.headers.Authorization==undefined){
      config.headers.Authorization = 'Bearer '+JSON.parse(token).accessToken;
    }
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.status==200&&(response.data.accessToken==null||response.data.accessToken==undefined)){
    // const token=window.sessionStorage.getItem("oauth2Token")
    // if(token){
    //   const refresh_token = JSON.parse(token).refreshToken;
    //   Oauth2Req.refresh(refresh_token).then(data=>{
    //     if(data.accessToken!=undefined){
    //       window.sessionStorage.setItem('oauth2Token', JSON.stringify(data));
    //     }
    //   })
    // }
  }else if(response.status==200&&response.data.accessToken){
    window.location.href = `/`;
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  if (error.response) {
    const err={...error}
    if(err.response.status===401){
      window.sessionStorage.setItem('oauth2Token', '');
      // window.location.href = `/login`;
    }
    
  }
  return Promise.reject(error);
});

export default axios