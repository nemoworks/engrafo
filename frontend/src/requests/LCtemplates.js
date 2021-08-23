import axios from "axios";

const api='http://localhost:8080/api/LCtemplates/'

export default{
  async getAll(){
    const {data}=await axios.get(api+'list')
    return data
  },
  async get(id){
    const {data}=await axios.get(api+id)
    return data
  }
}