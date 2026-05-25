// this is the first file React looks at when the app starts
// it sets up two things:
// 1. AuthProvider — wraps the whole app so every page can check login status
// 2. BrowserRouter — reads the URL and decides which page to show
//
// URL /books      → BooksPage
// URL /books/7    → BookDetailPage (for book number 7)
// URL /account    → AccountPage
// URL /login      → LoginPage
// URL /register   → RegisterPage
// URL /           → redirect to /books

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./navbar";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar is outside Routes so it appears on every page */}
        <Navbar />

        <main className="main-content">
          {/* Routes looks at the current URL and shows the matching page */}
          <Routes>
            {/* visiting just "/" sends the user to /books */}
            <Route path="/" element={<Navigate to="/books" replace />} />

            <Route path="/books" element={<BooksPage />} />

            {/* :id is a placeholder — it matches /books/3, /books/99, etc. */}
            <Route path="/books/:id" element={<BookDetailPage />} />

            <Route path="/account" element={<AccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
