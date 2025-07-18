// BooksContext.jsx

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const BooksContext = createContext();
export const useBooks = () => useContext(BooksContext);

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  // 1. Make fetchBooks reusable and dependent on auth
  const fetchBooks = useCallback(async () => {
    try {
      setLoadingBooks(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        setBooks([]); // Clear books if no token
        return;
      }

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
      setBooks([]); // Clear on error
    } finally {
      setLoadingBooks(false);
    }
  }, []); // No dependencies - uses latest state automatically

  // 2. Add refresh capability
  const refreshBooks = useCallback(() => {
    console.log("Manually refreshing books...");
    return fetchBooks();
  }, [fetchBooks]);

  // 3. Enhanced update function
  const updateBook = useCallback((updatedBook) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === updatedBook.id ? { ...book, ...updatedBook } : book
      )
    );
  }, []);

  // 4. Fetch when mounted AND when auth changes
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          await fetchBooks();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuthAndFetch();

    // Optional: Add event listener for auth changes
    const listener = () => checkAuthAndFetch();
    window.addEventListener('authChange', listener);
    return () => window.removeEventListener('authChange', listener);
  }, [fetchBooks]);

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
        refreshBooks,
        getBookById,
        getPublishedBooksCount,
        getBooksByRecipient,
        getRecentBooks,
        setBooks,
        updateBook
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};
