// this page lets a new user create an account
// it has four fields: first name, last name, email, password
//
// every keystroke updates the matching variable
//
// when the user clicks Register:
// 1 - stop the browser from refreshing the page
// 2 - send all four values to the server
// 3 - if it works, the server creates the account and sends back a token
//     we save the token so the user is automatically logged in → go to /account
// 4 - if the email is already taken or another error → show a red error message

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  // get the register function from the shared login doc
  const { register } = useAuth();

  const navigate = useNavigate();

  // one variable for each form field, all start empty
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

  const [error, setError]           = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // runs when the user clicks the Register button
  async function handleSubmit(event) {
    // stop the browser from refreshing the page on submit
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      // call register() from AuthContext with all four form values
      const data = await register(firstname, lastname, email, password);

      // check if the server sent back an error
      if (data.error || data.message?.includes("already")) {
        setError(data.error || "That email is already in use.");
        return;
      }

      // registration worked and we are now logged in — go to account
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
        <h1 className="page-title">Create an Account</h1>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label htmlFor="firstname" className="form-label">First Name</label>
            {/* value ties the box to the variable
                onChange updates the variable every time the user types */}
            <input
              id="firstname"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="form-input"
              placeholder="Jane"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname" className="form-label">Last Name</label>
            <input
              id="lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="form-input"
              placeholder="Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="jane@example.com"
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

          {/* disabled while submitting so the user cannot click twice */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary btn-full"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="form-switch">
          Already have an account?{" "}
          <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
