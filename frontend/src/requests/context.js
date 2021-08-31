import axios from "axios";

const HOST=process.env.NODE_ENV==="production"?'114.212.80.19:21081':'localhost:8080'

const api=`http://${HOST}/api/context/`

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