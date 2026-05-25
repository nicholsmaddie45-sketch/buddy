// this file holds all the functions that talk to the server
// the server is a computer on the internet that stores all the book info
// we send it a request, it sends back an answer

const BASE_URL = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api";

// go to /books on the server and ask for every single book
// wait for the answer, then return the list
export async function getAllBooks() {
  const response = await fetch(`${BASE_URL}/books`);
  // .json() turns the raw server response into a javascript object we can use
  const data = await response.json();
  return data.books;
}

// go to /books/[id] and ask for just one specific book
// id is whatever number gets passed in, like 7 or 42
export async function getBookById(id) {
  const response = await fetch(`${BASE_URL}/books/${id}`);
  const data = await response.json();
  return data.book;
}

// send a new user's info to the server to create an account
// if it works, the server sends back a token
// a token is like a wristband — it proves you are logged in
export async function registerUser({ firstname, lastname, email, password }) {
  const response = await fetch(`${BASE_URL}/users/register`, {
    // POST means we are sending new data to the server, not just asking for data
    method: "POST",
    headers: {
      // this tells the server the data we are sending is in JSON format
      "Content-Type": "application/json",
    },
    // JSON.stringify turns our javascript object into plain text the server can read
    body: JSON.stringify({ firstname, lastname, email, password }),
  });
  const data = await response.json();
  return data;
}

// send email and password to the server
// if they match an account, the server sends back a token
// if they don't match, the server sends back an error
export async function loginUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
}

// send our token to /users/me and ask the server "who am I?"
// the server looks up who owns this token and sends back their profile info
export async function getMe(token) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      // "Bearer" is just the word the server expects before the token
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

// send our token to /reservations and ask for all books WE have checked out
export async function getMyReservations(token) {
  const response = await fetch(`${BASE_URL}/reservations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.reservations;
}

// send our token and a book id to the server
// the server marks that book as reserved by us
export async function reserveBook(token, bookId) {
  const response = await fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookId }),
  });
  const data = await response.json();
  return data;
}

// send a DELETE request to the server with a reservation id
// DELETE means "please remove this thing"
// the server removes the reservation so the book becomes available again
// response.ok is true if it worked, false if something went wrong
export async function returnBook(token, reservationId) {
  const response = await fetch(`${BASE_URL}/reservations/${reservationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.ok;
}
