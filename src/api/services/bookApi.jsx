// booksApi.js
import { get, post, del, patch } from "../apiClient";
import { BOOK_BASE_URL } from "../apiConstants";





export const fetchBooks = async (page = 0, size = 7, searchTerm = "") => {
  try {
    
    return await get(`${BOOK_BASE_URL}/list`, { page, size, search: searchTerm });
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error; 
  }
};


export const fetchTotalBookCount = async () => {
  try {
    return await get(`${BOOK_BASE_URL}/count`);
  } catch (error) {
    console.error("Failed to fetch total book count:", error);
    throw error;
  }
};


export const createBook = async (book) => {
  try {

    console.log(book);
    
    return await post(`${BOOK_BASE_URL}/create`, [book]);
  } catch (error) {
    console.error("Failed to create book:", error);
    throw error; 
  }
};

export const deleteBook = async (id) => {
  try {
    
    return await del(`${BOOK_BASE_URL}/delete/${id}`);
  } catch (error) {
    console.error("Failed to delete book:", error);
    throw error;
  }
};


export const updateBook = async (id, updatedBook) => {
  try {
   
    return await patch(`${BOOK_BASE_URL}/update/${id}`, updatedBook);
  } catch (error) {
    console.error("Failed to update book:", error);
    throw error; 
  }
};


export const findBookByTitle = async (title) => {
  try {
   
    return await get(`${BOOK_BASE_URL}/getByTitle/${title}`);
  } catch (error) {
    console.error("Failed to get the book details:", error);
    throw error; 
  }
};
