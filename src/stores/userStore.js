import { observable, action, computed } from "mobx";
import API from "./../utils/API";

export const TOKEN = "token";

class UserStore {
  @observable currentUser = {};

  @computed
  get getUser() {
    return { ...this.currentUser };
  }

  @action
  register = async (name, email, password) => {
    try {
      const user = await API.post("/users", { name, email, password });
      localStorage.setItem(TOKEN, user.token);
      this.currentUser = user;
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
      this.currentUser = { ...user };
      return user;
    } catch (e) {
      throw e;
    }
  };

  @action
  logout = () => {
    localStorage.removeItem(TOKEN);
    this.currentUser = {};
  };

  @action
  fetchAllUsers = async () => {
    return await API.get("/users");
  };

  @action
  fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN);
      if (token) {
        const user = await API.get(`/users/getCurrentUser?token=${token}`);

        this.currentUser = { ...user };
        return user;
      }
    } catch (e) {
      throw e;
    }
  };
}
export default UserStore;
