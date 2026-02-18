import axios from "axios";

const client = axios.create({
  baseURL: "https://scenic-start-node-ten.vercel.app/api",
});

export default client;
