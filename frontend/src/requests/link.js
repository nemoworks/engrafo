import axios from './axiosConfig'

const HOST = process.env.NODE_ENV === "production" ? 'localhost:21081' : 'localhost:8080'

const api = `http://${HOST}/api/link/`

export default {
    async get(source) {
        const { data } = await axios.request({
            url: source,
            method: 'get',
            headers:{
                "Content-Type":"application/json"
            }
        })

        return data
    },
}