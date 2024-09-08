// booksApi.js
import { get, post, del, patch } from "../../apiServices";
import { BOOK_BASE_URL } from "../../apiConstants";





export const fetchBooks = async (page = 0, size = 7, searchTerm = "") => {
  try {

    const response = await get(`${BOOK_BASE_URL}/list`, { page, size, search: searchTerm });
  
    
    return response;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error; 
  }
};


export const fetchTotalBookCount = async () => {
  try {
    const response =await get(`${BOOK_BASE_URL}/count`);
    return  response;
  } catch (error) {
    console.error("Failed to fetch total book count:", error);
    throw error;
  }
};


export const createBook = async (book) => {
  try {

    const response = await post(`${BOOK_BASE_URL}/create`, [book]);
    return response;
  } catch (error) {
    console.error("Failed to create book:", error);
    throw error; 
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await del(`${BOOK_BASE_URL}/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to delete book:", error);
    throw error;
  }
};


export const updateBook = async (id, updatedBook) => {
  try {


    const response =await patch(`${BOOK_BASE_URL}/update/${id}`, updatedBook);
   
    return response;
  } catch (error) {
    console.error("Failed to update book:", error);
    throw error; 
  }
};


export const findBookByTitle = async (title) => {
  try {

    const response = await get(`${BOOK_BASE_URL}/getByTitle/${title}`);
   
    return  response;
  } catch (error) {
    console.error("Failed to get the book details:", error);
    throw error; 
  }
};


export const findBookSuggestions = async (searchTerm) => {
  try {

    const response = await get(`${BOOK_BASE_URL}/suggestions`, { searchTerm });
    return response;
  } catch (error) {
    console.error("Failed to fetch book suggestions:", error);
    throw error;
  }
};