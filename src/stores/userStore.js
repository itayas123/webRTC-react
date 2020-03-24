import { observable, action, computed, toJS } from "mobx";
import API from "./../utils/API";

export const TOKEN = "token";

class UserStore {
  @observable currentUser = {};

  @observable allUsers = observable.array();

  @observable isModalshown = false;

  @observable selectedUser = {};

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

  @action
  setIsModalShown = show => {
    this.isModalshown = show;
  };

  @action
  setSelectedUser = user => {
    this.selectedUser = user;
  };

  @action
  updateUser = async user => {
    await API.put(`/users/${user._id}`, user);
    await this.fetchAllUsers();
  };

  @action
  deleteUser = async user => {
    await API.delete(`/users/${user._id}`);
    await this.fetchAllUsers();
  };
}
export default UserStore;
