// this page has a form with two boxes: email and password
//
// every keystroke updates the matching variable
// (so React always knows exactly what is typed in the box)
//
// when the user clicks Login:
// 1 - stop the browser from refreshing the page (its default behavior on form submit)
// 2 - send the email and password to the server
// 3 - if the server says ok, it sends back a token → save it → go to /account
// 4 - if the server says wrong email/password → show an error in a red box

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  // get the login function out of the shared login doc
  const { login } = useAuth();

  // lets us jump to a different page from inside code
  const navigate = useNavigate();

  // holds whatever the user has typed in each box, starts empty
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // holds an error message to show if login fails, starts as nothing
  const [error, setError] = useState(null);

  // true while waiting for the server so we can disable the button
  const [submitting, setSubmitting] = useState(false);

  // runs when the user clicks the Login button
  async function handleSubmit(event) {
    // event.preventDefault stops the browser from refreshing the page
    // by default submitting a form reloads the page — we do not want that
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      // call login() from AuthContext — it sends email + password to the server
      const data = await login(email, password);

      // the server might send back an error message inside data
      // if it does, show it and stop here
      if (data.error || data.message === "No user found") {
        setError(data.error || "Invalid email or password. Please try again.");
        return;
      }

      // login worked — go to the account page
      navigate("/account");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <h1 className="page-title">Log In</h1>

        {/* only show the red error box if error is not null */}
        {error && <p className="form-error">{error}</p>}

        {/* onSubmit means "when this form is submitted, run handleSubmit" */}
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            {/* value={email} ties this input to the email variable
                onChange fires every keystroke and saves the new text into email */}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {/* disabled={submitting} greys out the button while we wait for the server */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary btn-full"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>

        </form>

        <p className="form-switch">
          Don&apos;t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
