// BooksContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const BooksContext = createContext();
export const useBooks = () => useContext(BooksContext);

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) throw new Error("No ID token");

        const response = await fetch(
          'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/books',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': idToken
            }
          }
        );
        const raw = await response.json();
        const books = Array.isArray(raw) ? raw : raw.books || [];
        setBooks(books);
        console.log("Books Loaded:", books);
      } catch (err) {
        console.error("❌ Failed to load books:", err);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  // 🔧 Utility methods (use dynamic books state)
  const getBookById = (id) => books.find(book => book.id === id);

  const getPublishedBooksCount = () =>
    books.filter(book => book.status === "Published").length;

  const getBooksByRecipient = (recipientId) =>
    books.filter(book => book.personId === recipientId);

  const getRecentBooks = (limit = 3) =>
    [...books]
      .filter(book => book.status === "Published")
      .sort((a, b) => new Date(b.savedOn) - new Date(a.savedOn))
      .slice(0, limit);

  return (
    <BooksContext.Provider
      value={{
        books,
        loadingBooks,
        getBookById,
        getPublishedBooksCount,
        getBooksByRecipient,
        getRecentBooks,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};
