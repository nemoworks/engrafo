import axios from "axios";

const HOST=process.env.NODE_ENV==="production"?'app':'localhost'

const api=`http://${HOST}:8080/api/account/`

export default{
    async get(id){
        const {data} = await axios.get(api+id)
        return data
    },
    async getAll(){
        const {data} = await axios.get(api+'list')
        return data
    }
}