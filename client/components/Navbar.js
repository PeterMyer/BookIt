import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import Topbar from './Navigation/Topbar';

const Navbar = ({ handleClick, isLoggedIn }) => (
  <nav
    className="navbar navbar-light bg-light static-top"
    style={{ paddingTop: '0px', paddingBottom: '0px'}}
  >
    <div className="container">
      <Link
        to="/home"
        style={{
          marginTop: '0px',
          marginBottom: '0px',
        }}
      >
        <img
          src="../../main-transparent.png"
          height="75px"
          className="navbar-brand"
        />
      </Link>

      {isLoggedIn ? (
        <Topbar handleClick={handleClick} />
      ) : (
        <div>
          <a href="https://github.com/BookItWebApp/BookItExtension">
            Get the BookIt Extension for Chrome Browser
          </a>
          <Link to="/signup">
            <button className="btn btn-primary">Sign Up/Log In</button>
          </Link>
        </div>
      )}
    </div>
  </nav>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
