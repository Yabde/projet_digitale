import React from 'react';
import logo from './logo.svg';
import './App.css';
import Routes from "./routes";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
            </ul>
          </div>
          <div className="mx-auto order-0">
            <a className="navbar-brand mx-auto" href="#">
              <Link to="/">Classifie </Link>
              <Link to="/create">Load data</Link>
            </a>
            <button className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target=".dual-collapse2">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="jumbotron">
          <div className="container">
            <h1 className="display-4">Data Classification with Deep Learning</h1>
            <p>Load your images and make a first prediction with YOLO. Then you'll be able to modifie it if necessary.</p>
            <p><a className="btn btn-outline-warning active"
              href="https://github.com/Yabde/projet_digitale"
              role="button">Github &raquo;</a></p>
          </div>
        </div>
      </header>

      <main>
        <Routes />
      </main>

    </div >
  );
}

export default App;
