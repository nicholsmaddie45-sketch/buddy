// this page shows every book in the library as a grid of cards
//
// when the page first appears, ask the server for every book
// while waiting, show "Loading books..."
// when the server writes back, save all the books and draw a card for each one
// clicking a card takes you to that book's detail page

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../api";

export default function BooksPage() {
  // books starts as an empty array
  // once the server responds, we fill it with all the book objects
  // when it changes, React redraws the page automatically
  const [books, setBooks] = useState([]);

  // true = still waiting for the server, false = done waiting
  const [loading, setLoading] = useState(true);

  // holds an error message if something goes wrong, otherwise stays null
  const [error, setError] = useState(null);

  // useEffect means "run this when the page first appears"
  // the empty [] at the end means only run once, not over and over
  useEffect(() => {
    // we define an async function inside because useEffect itself can't be async
    // async means the function is allowed to use await (pause and wait for a response)
    async function fetchBooks() {
      try {
        // call getAllBooks from api.js — await pauses here until the server responds
        const allBooks = await getAllBooks();
        // put the books into state — this triggers React to redraw the page
        setBooks(allBooks);
      } catch (err) {
        // if anything above crashes, save an error message to show the user
        setError("Could not load books. Please try again later.");
        console.error(err);
      } finally {
        // finally always runs at the end whether it worked or crashed
        // we are done waiting either way
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  // still waiting for the server
  if (loading) {
    return <p className="status-message">Loading books...</p>;
  }

  // something went wrong
  if (error) {
    return <p className="status-message error-message">{error}</p>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Library Catalog</h1>

      <div className="books-grid">
        {/* .map() goes through every book in the array one at a time
            for each book it draws one card
            key={book.id} is required so React can tell the cards apart */}
        {books.map((book) => (
          // the whole card is a Link so clicking anywhere on it goes to /books/[id]
          <Link to={`/books/${book.id}`} key={book.id} className="book-card">

            {/* show the cover image, or the placeholder if there is none */}
            <img
              src={book.coverimage || "/books.png"}
              alt={`Cover of ${book.title}`}
              className="book-card-image"
            />

            <div className="book-card-info">
              <h2 className="book-card-title">{book.title}</h2>
              <p className="book-card-author">by {book.author}</p>

              {/* book.available is true or false
                  the ? picks the green class if true, red class if false */}
              <span className={book.available ? "badge badge-available" : "badge badge-unavailable"}>
                {book.available ? "Available" : "Checked Out"}
              </span>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}
