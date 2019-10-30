import React from "react";
import "./App.css";
import Login from "./UI/containers/login/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/login-register">Login/Register</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/login-register" component={Login} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
