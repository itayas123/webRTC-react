import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./UI/components/Navbar/navbar";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import stores from "./stores";
import Login from "./UI/containers/login/login";
import { observer } from "mobx-react";

const { userStore } = stores;

const App = observer(
  class App extends React.Component {
    componentDidMount = async () => {
      try {
        await userStore.getCurrentUser();
      } catch (e) {
        alert(e);
      }
    };

    render() {
      return (
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/">
              {this.props.isConnected ? (
                <MediaScreen />
              ) : (
                <div>
                  <h1>You need to connect to see this page</h1>
                  <Link to="/login-register">Login/ Register</Link>
                </div>
              )}
            </Route>
            <Route path="/login-register">
              <Login />
            </Route>
          </Switch>
        </div>
      );
    }
  }
);
export default App;
