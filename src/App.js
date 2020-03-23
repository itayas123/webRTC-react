import { observer } from "mobx-react";
import React from "react";
import "./App.css";
import Routes from "./Routes";
import stores from "./stores";
import Navbar from "./UI/components/Navbar/navbar";
import Sidebar from "./UI/components/Sidebar/sidebar";

const { userStore, uiStore } = stores;
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount = async () => {
    try {
      await userStore.fetchCurrentUser();
    } catch (e) {
      alert(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { showSidebar, setShowSidebar } = uiStore;
    const { getUser, logout } = userStore;
    return (
      <div className="App">
        <Navbar
          user={getUser}
          onLogout={logout}
          showSidebar={() => setShowSidebar(true)}
        />
        <Sidebar show={showSidebar} hideSidebar={() => setShowSidebar(false)} />
        {this.state.isLoading ? <> loading </> : <Routes />}
      </div>
    );
  }
}
export default App;
