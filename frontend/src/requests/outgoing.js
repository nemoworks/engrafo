import axios from "axios";

const api='http://localhost:8080/api/outgoing/'

export default{
    async get(id){
        const {data} = await axios.get(api+id)
        return data
    },
    async start(id){
        const {data} = await axios.post(api+'start/'+id)
        return data
    },
    async nexts(id){
        const {data} = await axios.get(api+'nexts/'+id)
        return data
    },
    async next(id,next){
        const {data} = await axios.post(api+'next/'+id+'/'+next)
        return data
    },
}