import { inject, observer } from "mobx-react";
import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { USER_STORE, UI_STORE } from "./stores";
import Navbar from "./UI/components/Navbar/navbar";
import Login from "./UI/containers/login/login";
import MediaScreen from "./UI/containers/MediaScreen/mediaScreen";
import Sidebar from "./UI/components/Sidebar/sidebar";

@inject(USER_STORE, UI_STORE)
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.userStore = this.props[USER_STORE];
    this.uiStore = this.props[UI_STORE];
  }
  componentDidMount = async () => {
    try {
      await this.userStore.fetchCurrentUser();
    } catch (e) {
      alert(e);
    }
  };

  render() {
    const { showSidebar, setShowSidebar } = this.uiStore;
    return (
      <div className="App">
        <Navbar
          name={this.userStore.getUser.name}
          onLogout={this.userStore.logout}
          showSidebar={() => setShowSidebar(true)}
        />
        <Sidebar show={showSidebar} hideSidebar={() => setShowSidebar(false)} />
        <Switch>
          <Route exact path="/">
            {this.userStore.getUser.name ? (
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
