import axios from './axiosConfig'

const HOST=process.env.NODE_ENV==="production"?'localhost:21081':'localhost:8080'

const api=`http://${HOST}/api/dataset/`

export default {
  async get(id) {
    const { data } = await axios.get(api);
    return data;
  }
};
