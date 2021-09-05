import axios from "axios";

const HOST=process.env.NODE_ENV==="production"?'221.228.66.83:21081':'localhost:8080'

const api=`http://${HOST}/api/account/`

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