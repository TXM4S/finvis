import React, { useContext } from "react";
import { UserContext } from "../contexts/user";
import { signInWithGoogle, signOut } from "../firebase";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { user, isLoading } = useContext(UserContext);

  return (
    <div className="navbar rounded bg-base-100">
      <div className="navbar-start">
        {user ? (
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="navbar-center hidden px-2 mx-2 lg:flex">
        <Link to="/" className="btn btn-ghost text-2xl font-extrabold">
          FinVis
        </Link>
      </div>
      <div className="navbar-end">
        {user ? (
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user.photoURL} />
              </div>
            </div>
            <ul
              tabindex="0"
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-accent badge-outline">soon</span>
                </a>
              </li>
              <li>
                <a className="justify-between">
                  Settings
                  <span className="badge badge-accent badge-outline">soon</span>
                </a>
              </li>
              <li>
                <a onClick={signOut}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn btn-outline text-xl"
            onClick={() => signInWithGoogle()}
          >
            {" "}
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
