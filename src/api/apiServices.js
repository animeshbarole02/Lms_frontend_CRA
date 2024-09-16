import { BASE_URL } from "./apiConstants";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");


  if (contentType && contentType.includes("application/json")) {
    const responseBody = await response.json(); 

    return {
      status: response.status,
      message: responseBody.message, 
    };
  }


  return {
    status: response.status,
    message: await response.text(), 
  };
};


export const get = async (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}${url}${queryString ? ("?" + queryString) : ''}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return response.json();
};


export const post = async (url, body = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
};


export const put = async (url, body = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
};


export const patch = async (url, body = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
  
    return handleResponse(response);
  };


export const del = async (url) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  
  return handleResponse(response);
};

