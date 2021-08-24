import axios from "axios";

const HOST=process.env.NODE_ENV==="production"?'app':'localhost'

const api=`http://${HOST}:8080/api/outgoing/`

export default {
  async get(id) {
    const { data } = await axios.get(api + id);
    return data;
  },
  async getList() {
    const { data } = await axios.get(api + "list");
    return data;
  },
  async delete(id) {
    const { data } = await axios.delete(api + id);
    return data;
  },
  async start(id) {
    const { data } = await axios.post(api + "start/" + id);
    return data;
  },
  async nexts(id) {
    const { data } = await axios.get(api + "nexts/" + id);
    return data;
  },
  async next(id, next) {
    const { data } = await axios.post(api + "next/" + id + "/" + next);
    return data;
  },
  async getDataList() {
    const { data } = await axios.get(api + "formdata/list");
    return data;
  },
};
