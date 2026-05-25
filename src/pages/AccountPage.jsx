// This is the user's personal profile page.
//
// first check — is anyone logged in?
//  if not  - show a message with Login and Register links
// if they are -
// 1. show their name and email
// 2. ask the server for their list of reserved books
//  then show each reserved book with a Return button

// when the user clicks Return on a book:
// tell the server to delete that reservation,
// remove the book from the list on screen
// (so it disappears without reloading the whole page)

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyReservations, returnBook } from "../api";

export default function AccountPage() {
  //reads the shared login doc to get user info and the token
  const { user, token } = useAuth();

  //reservations is a list (array) of books we currently have checked out
  //starts empty, gets filled when the server responds
  const [reservations, setReservations] = useState([]);

  //loading/error work the same as in BooksPage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect — run this when the page appears
  // [token] means also re-run it if the token changes
  // (so if the user logs out and back in, then it refreshes)
  useEffect(() => {
    // if there is no token, and the user is not logged in
    //there is no point asking the server for reservations
    //set loading to false so the "not logged in" screen shows
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchReservations() {
      try {
        // ask the server "what books do I have checked out right now?"
        //the server uses our token to figure out which person we are
        const myReservations = await getMyReservations(token);
        // save the list — if the server gives back nothing, use an empty array
        setReservations(myReservations || []);
      } catch (err) {
        setError("Could not load reservations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, [token]);

  // the user clicked Return on one of their books
  // 1 - send the reservation's id to the server asking it to delete it
  // 2 - the server removes the reservation, book is available again
  //.filter() makes a NEW array that keeps every item EXCEPT
  //the one whose id matches the one we just returned
  //this updates the screen instantly without reloading
  // ─────────────────────────────────────────────
  async function handleReturn(reservationId) {
    try {
      // tell the server to delete this reservation
      await returnBook(token, reservationId);

      // filter out the returned book from the list
      //prev is the old list of reservations
      //we keep every reservation whose id is NOT the one we returned
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId),
      );
    } catch (err) {
      alert("Could not return book. Please try again.");
      console.error(err);
    }
  }

  //nobody is logged in
  // user is null so we show a friendly message with links

  if (!user) {
    return (
      <div className="page-container">
        <div className="account-guest">
          <h1 className="page-title">My Account</h1>
          <p>You are not logged in.</p>
          <div className="account-guest-links">
            <Link to="/login" className="btn-primary">
              Log In
            </Link>
            <Link to="/register" className="btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // user is logged in

  return (
    <div className="page-container">
      <h1 className="page-title">My Account</h1>
      //show the user's name and email from the shared login doc
      <section className="profile-section">
        <h2 className="section-title">Profile</h2>
        <div className="profile-card">
          <p>
            <span className="profile-label">Name:</span> {user.firstname}{" "}
            {user.lastname}
          </p>
          <p>
            <span className="profile-label">Email:</span> {user.email}
          </p>
        </div>
      </section>
      // ── RESERVATIONS SECTION ── // show the list of books the user has
      checked out
      <section className="reservations-section">
        <h2 className="section-title">My Reserved Books</h2>
        // still waiting for server? say so
        {loading && <p className="status-message">Loading reservations...</p>}
        // something broke? show the error
        {error && <p className="status-message error-message">{error}</p>}
        // loaded successfully but the list is empty? say so
        {!loading && !error && reservations.length === 0 && (
          <p className="status-message">You have no books reserved.</p>
        )}
        // loaded and there ARE reservations? draw each one
        {!loading && !error && reservations.length > 0 && (
          <ul className="reservations-list">
            {reservations.map((reservation) => (
              // each reservation is one row
              //         show the cover, title, author, and a Return button
              <li key={reservation.id} className="reservation-item">
                <img
                  src={reservation.coverimage || "/books.png"}
                  alt={`Cover of ${reservation.title}`}
                  className="reservation-cover"
                />
                <div className="reservation-info">
                  <h3 className="reservation-title">
                    // clicking the title goes to that book's detail page
                    <Link to={`/books/${reservation.bookid}`}>
                      {reservation.title}
                    </Link>
                  </h3>
                  <p className="reservation-author">by {reservation.author}</p>
                </div>
                // clicking this button calls handleReturn we pass in the
               // reservation's id so the function knows WHICH reservation to
               // delete
                <button
                  onClick={() => handleReturn(reservation.id)}
                  className="btn-return"
                >
                  Return
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
