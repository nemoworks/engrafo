import axios from "axios";

const HOST=process.env.NODE_ENV==="production"?'app':'localhost'

const api=`http://${HOST}:8080/api/FStemplates/`

export default{
  async getAll(){
    const {data}=await axios.get(api+'list')
    return data
  },
  async get(id){
    const {data}=await axios.get(api+id)
    return data
  },
  async create(formschema){
    console.log(formschema)
    const res = axios.request({
      url:api,
      method:'POST',
      data:{
        formschema
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