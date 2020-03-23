import { observable, action, computed, toJS } from "mobx";
import API from "./../utils/API";

export const TOKEN = "token";

class UserStore {
  @observable currentUser = {};

  @observable allUsers = observable.array();

  constructor(stores) {
    this.stores = stores;
  }

  @computed
  get getUser() {
    return toJS(this.currentUser);
  }

  @action
  setCurrentUser = user => {
    this.currentUser = user;
    this.stores.sourceStore.fetchUserSources();
  };

  @action
  register = async (name, email, password) => {
    try {
      const user = await API.post("/users", { name, email, password });
      localStorage.setItem(TOKEN, user.token);
      this.setCurrentUser(user);
      return user;
    } catch (e) {
      throw e;
    }
  };

  @action
  login = async (email, password) => {
    try {
      const user = await API.get(`/auth?email=${email}&password=${password}`);
      localStorage.setItem(TOKEN, user.token);
      this.setCurrentUser(user);
      return user;
    } catch (e) {
      throw e;
    }
  };

  @action
  logout = () => {
    localStorage.removeItem(TOKEN);
    this.currentUser = {};
    this.stores.sourceStore.reset();
  };

  @action
  fetchAllUsers = async () => {
    const users = await API.get("/users");
    this.allUsers.replace(users);
    return users;
  };

  @action
  fetchCurrentUser = async () => {
    try {
      if (localStorage.getItem(TOKEN)) {
        const user = await API.get("/users/getCurrentUser");
        this.setCurrentUser(user);
        return user;
      }
    } catch (e) {
      this.logout();
      throw e;
    }
  };
}
export default UserStore;
