import axios from "axios";
import { update } from "lodash";

const HOST=process.env.NODE_ENV==="production"?'localhost:21081':'localhost:8080'

const api=`http://${HOST}/api/outgoing/`

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
  async create(business){
    const {data} = await axios.request({
      url:api,
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      data:business
    })
    return data
  },
  async update(id,newData){
    const {data} = await axios.request({
      url:api+id,
      method:'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      data:newData
    })
  },
  async getFromAuth(auth){
    if(!auth) return [];
    const { data } = await axios.get(api + "authedlist/" + auth);
    return data;
  }
};
