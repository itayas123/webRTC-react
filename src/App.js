import { observer } from "mobx-react";
import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import "./App.css";
import stores from "./stores";
import Navbar from "./UI/components/Navbar/navbar";
import Login from "./UI/containers/login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import Sidebar from "./UI/components/Sidebar/sidebar";

const { userStore, uiStore } = stores;
@observer
class App extends React.Component {
  componentDidMount = async () => {
    try {
      await userStore.fetchCurrentUser();
    } catch (e) {
      alert(e);
    }
  };

  render() {
    const { showSidebar, setShowSidebar } = uiStore;
    const { getUser, logout } = userStore;
    return (
      <div className="App">
        <Navbar
          name={getUser.name}
          onLogout={logout}
          showSidebar={() => setShowSidebar(true)}
        />
        <Sidebar show={showSidebar} hideSidebar={() => setShowSidebar(false)} />
        <Switch>
          <Route exact path="/">
            {getUser.name ? (
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
export default App;
