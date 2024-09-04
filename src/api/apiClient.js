

import { BASE_URL } from "./apiConstants";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text(); 
    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text(); 
};


export const get = async (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}${url}?${queryString}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
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
