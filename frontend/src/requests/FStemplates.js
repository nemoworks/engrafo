import axios from "axios";

const api='http://localhost:8080/api/FStemplates/'

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
      const response = await fetch(api,{
        method:'POST',
        body:JSON.stringify(formschema),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(response.ok){
        const data = await response.json()
        return data
      }
      return "error"
  },
  async delete(id){
    const {data}=await axios.delete(api+id)
    return data
  },
}