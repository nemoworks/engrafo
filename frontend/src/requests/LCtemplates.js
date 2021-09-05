import axios from "axios";

const HOST=process.env.NODE_ENV==="production"?'221.228.66.83:21081':'localhost:8080'

const api=`http://${HOST}/api/LCtemplates/`

export default{
  async getAll(){
    const {data}=await axios.get(api+'list')
    return data
  },
  async get(id){
    const {data}=await axios.get(api+id)
    return data
  },
  async create(lifecycle){
    const res = axios.request({
      url:api,
      method:'POST',
      data:{
        lifecycle
      },
      headers:{
        'Content-Type': 'application/json'
      }
    })
    return res
  },
  async delete(id){
    const {data}=await axios.delete(api+id)
    return data
  },
}