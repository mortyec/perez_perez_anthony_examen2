import axios from "axios";



// Configuracion axios

const axiosRequest = axios.create();
axiosRequest.defaults.headers.post["Content-Type"] = "application/json";

const API = "http://omilec.com:3000/api/v1";


const AuthLogin = async (body) => {
  try {
    const rta = await axiosRequest.post(`${API}/auth/login`, body);
    return rta.data;
  } catch (error) {
    console.log(error);
  }
};

const AuthSingup = async (body) => {
  try {
    const rta = await axiosRequest.post(`${API}/auth/signup`, body);
    return rta.data;
  } catch (error) {
    console.log(error);
  }
};

// 

const getOrders = async (token) => {
  try {
    axiosRequest.defaults.headers.common["x-access-token"] = token;
    const rta = await axiosRequest.get(`${API}/orders`);
    return rta.data;
  } catch (error) {
    console.log(error);
  }
};


const getOrdersByUserId = async (token, id) => {
  try {
    axiosRequest.defaults.headers.common["x-access-token"] = token;
    const rta = await axiosRequest.get(`${API}/orders/${id}`);
    return rta.data;
  } catch (error) {
    console.log(error);
  }
};




const getProducts = async (token) => {
  try {
    axiosRequest.defaults.headers.common["x-access-token"] = token;
    const rta = await axiosRequest.get(`${API}/products`)
    return rta.data
  } catch (error) {
    console.log(error);
  }
}

const getUserbyId = async (token, id) => {
  try {
    axiosRequest.defaults.headers.common["x-access-token"] = token;
    const endpoint = `${API}/users/${id}`
    const rta = await axiosRequest.get(endpoint)
    // console.log(rta.data);
    return rta.data
  } catch (error) {
    console.log(error);
  }
}

const createOrder = async (token, body) => {
  try {

    axiosRequest.defaults.headers.common["x-access-token"] = token;
    const rta = await axiosRequest.post(`${API}/orders`, body)
    console.log(token);
    return rta

  } catch (error) {
    console.log(error);
  }
}

export { createOrder, getOrders, getProducts, AuthLogin, AuthSingup, getUserbyId, getOrdersByUserId };


