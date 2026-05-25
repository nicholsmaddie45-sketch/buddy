// this file creates a shared login "doc" that every page in the app can read
// instead of passing login info from page to page manually,
// any component can just open this doc and grab what it needs

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../api";

// make the empty shared doc — we fill it in below
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // token is the secret key the server gave us when we logged in
  // we save it in localStorage so the user stays logged in after a page refresh
  // localStorage is like the browser's memory — it survives refreshes
  // the () => part means "when the app first starts, check if a token is already saved"
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // user holds the logged-in person's info like name, email, id
  // starts as null because nobody is logged in when the app first opens
  const [user, setUser] = useState(null);

  // this runs every time the token changes
  // if we have a token, use it to ask the server for the user's profile info
  // this is what keeps you "logged in" after refreshing the page
  useEffect(() => {
    // no token means nobody is logged in — clear user and stop
    if (!token) {
      setUser(null);
      return;
    }

    async function fetchUser() {
      try {
        // ask the server "who owns this token?" and save the answer
        const data = await getMe(token);
        setUser(data);
      } catch {
        // if the token is expired or broken, log out so the user starts fresh
        logout();
      }
    }

    fetchUser();
  }, [token]);
  // [token] means only re-run this when the token variable changes

  // the login page calls this when the user submits the login form
  // we send email + password to the server
  // if it works, save the token so the app knows someone is logged in
  async function login(email, password) {
    const data = await loginUser({ email, password });

    if (data.token) {
      // save to localStorage so login survives a page refresh
      localStorage.setItem("token", data.token);
      // save to state so the app reacts right away
      setToken(data.token);
    }

    // return data so the login page can check if there was an error
    return data;
  }

  // the register page calls this when the user fills out the sign-up form
  // same idea as login — if it works we get a token back and the user is auto-logged-in
  async function register(firstname, lastname, email, password) {
    const data = await registerUser({ firstname, lastname, email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    return data;
  }

  // wipe everything — remove the token from localStorage,
  // set token to null, set user to null
  // after this runs the app thinks nobody is logged in
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  // everything we put INTO the shared doc
  // any component that reads this doc gets all of these
  const value = {
    token,
    user,
    login,
    register,
    logout,
    setUser,
  };

  // AuthContext.Provider is the actual wrapper that shares the doc
  // everything inside {children} can now read the doc
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// shortcut so any component can call useAuth() instead of useContext(AuthContext) every time
export function useAuth() {
  return useContext(AuthContext);
}
