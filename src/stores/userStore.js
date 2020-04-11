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
  setCurrentUser = (user) => {
    this.currentUser = user;
    this.stores.sourceStore.fetchUserSources();
  };

  @action
  createUser = async (user) => {
    try {
      await API.post("/users", user);
      await this.fetchAllUsers();
    } catch (e) {
      throw e;
    }
  };

  @action
  login = async (email, password) => {
    try {
      const user = await API.put("/users/login", { email, password });
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
    try {
      const users = await API.get("/users");
      this.allUsers.replace(users);
      return users;
    } catch (e) {
      this.logout();
      throw e;
    }
  };

  @action
  fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN);
      if (token && token !== "undefined") {
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
  setIsModalShown = (show) => {
    this.isModalshown = show;
  };

  @action
  setSelectedUser = (user) => {
    const sources = this.stores.sourceStore.sources.map((source) => ({
      ...source,
      isActive: user.sources.includes(source._id),
    }));
    this.selectedUser = { ...user, sources };
  };

  @action
  updateUser = async (user) => {
    try {
      await API.put(`/users/${user._id}`, user);
      await this.fetchAllUsers();
    } catch (err) {
      throw err;
    }
  };

  @action
  deleteUser = async (user) => {
    try {
      await API.delete(`/users/${user._id}`);
      await this.fetchAllUsers();
    } catch (err) {
      throw err;
    }
  };
}
export default UserStore;
