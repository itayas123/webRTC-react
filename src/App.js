import { observer } from "mobx-react";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import Routes from "./Routes/Routes";
import stores from "./stores";
import Navbar from "./UI/components/Navbar/navbar";
import Sidebar from "./UI/components/Sidebar/sidebar";

const { userStore } = stores;
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showSidebar: false,
    };
  }

  componentDidMount = async () => {
    try {
      await userStore.fetchCurrentUser();
    } catch (err) {
      toast.error(err.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, showSidebar } = this.state;
    const { getUser, logout } = userStore;
    return (
      <div className="App">
        <Navbar
          user={getUser}
          onLogout={logout}
          showSidebar={() => {
            this.setState({ showSidebar: true });
          }}
        />
        <Sidebar
          show={showSidebar}
          hideSidebar={() => {
            this.setState({ showSidebar: false });
          }}
        />
        {isLoading ? <> loading </> : <Routes />}
        <ToastContainer className="toast-container" />
      </div>
    );
  }
}
export default App;
