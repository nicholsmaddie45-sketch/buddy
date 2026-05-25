// this page shows all the info about one specific book
// the user gets here by clicking a book card on the books list page
//
// look at the URL to find the book's id (ex: /books/7 means id is 7)
// ask the server for that one book's info, then show it
//
// three possible situations for the Reserve button:
// - user is NOT logged in → show "log in to reserve" message
// - user IS logged in and book is available → show a clickable Reserve button
// - user IS logged in but book is already checked out → show a greyed-out button

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById, reserveBook } from "../api";
import { useAuth } from "../context/AuthContext";

export default function BookDetailPage() {
  // useParams reads the :id part from the URL
  // if the URL is /books/12 then id = "12"
  const { id } = useParams();

  // get the logged-in user and their token from the shared login doc
  // user is null if not logged in
  const { user, token } = useAuth();

  // book starts as null, gets filled when the server responds
  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // true while we are waiting for the reserve request to finish
  // keeps the button disabled so the user can't click it twice
  const [reserving, setReserving] = useState(false);

  // shows a small success or error note below the button after clicking Reserve
  const [reserveMessage, setReserveMessage] = useState(null);

  // when the page appears, fetch the book whose id is in the URL
  // [id] means re-run this if the id in the URL changes
  useEffect(() => {
    async function fetchBook() {
      try {
        const fetchedBook = await getBookById(id);
        setBook(fetchedBook);
      } catch (err) {
        setError("Could not load book details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  // runs when the user clicks the Reserve button
  // 1 - disable the button so they can't click twice
  // 2 - send our token and the book id to the server
  // 3 - server marks the book as checked out by us
  // 4 - update our local copy of book so available becomes false right away
  //     this makes the button go grey without needing to reload the page
  async function handleReserve() {
    setReserving(true);
    setReserveMessage(null);

    try {
      await reserveBook(token, book.id);

      // ...prev means "copy everything that was in book before"
      // then we just overwrite the available field to false
      setBook((prev) => ({ ...prev, available: false }));
      setReserveMessage("Book reserved successfully!");
    } catch (err) {
      setReserveMessage("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setReserving(false);
    }
  }

  if (loading) return <p className="status-message">Loading book details...</p>;
  if (error)   return <p className="status-message error-message">{error}</p>;
  if (!book)   return <p className="status-message">Book not found.</p>;

  return (
    <div className="page-container">
      <Link to="/books" className="back-link">
        ← Back to Catalog
      </Link>

      <div className="book-detail">
        <img
          src={book.coverimage || "/books.png"}
          alt={`Cover of ${book.title}`}
          className="book-detail-image"
        />

        <div className="book-detail-info">
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>

          <span className={book.available ? "badge badge-available" : "badge badge-unavailable"}>
            {book.available ? "Available" : "Checked Out"}
          </span>

          <p className="book-detail-description">{book.description}</p>

          <div className="reserve-section">
            {/* not logged in — show a text prompt */}
            {!user ? (
              <p className="reserve-prompt">
                <Link to="/login">Log in</Link> to reserve this book.
              </p>
            ) : (
              <>
                {/* disabled is true when the book is unavailable OR we are currently reserving
                    !book.available means the book is already checked out */}
                <button
                  onClick={handleReserve}
                  disabled={!book.available || reserving}
                  className="btn-reserve"
                >
                  {/* change button text depending on what is happening right now */}
                  {reserving
                    ? "Reserving..."
                    : book.available
                    ? "Reserve This Book"
                    : "Already Checked Out"}
                </button>

                {/* only show this if reserveMessage has something in it */}
                {reserveMessage && (
                  <p className="reserve-message">{reserveMessage}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
