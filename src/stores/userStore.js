import { observable, action, computed, toJS } from "mobx";
import API from "./../utils/API";
import CRUDStore from "./crudStore";

export const TOKEN = "authorization";

class UserStore extends CRUDStore {
  @observable currentUser = {};

  constructor(stores) {
    super("/users");
    this.stores = stores;
  }

  @computed
  get getUser() {
    return toJS(this.currentUser);
  }

  @action
  setSelected = (user) => {
    const allSources = this.stores.sourceStore.list;
    const userSources = user.sources.map((userSource) => userSource._id);
    this.selected = {
      ...user,
      sources: allSources.map((source) => ({
        ...source,
        isActive: userSources.includes(source._id),
      })),
    };
    console.log(this.selected, allSources);
  };

  @action
  setCurrentUser = (user) => {
    this.currentUser = user;
    this.stores.videoStore.setUpSocket(user.token);
    this.stores.sourceStore.fetchUserSources();
  };

  @action
  login = async (email, password) => {
    try {
      const user = await API.post("/users/login", { email, password });
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
  fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN);
      if (token && token !== "undefined") {
        const user = await API.get("/users/getCurrentUser");
        this.setCurrentUser({ ...user, token });
        return user;
      }
    } catch (e) {
      this.logout();
      throw e;
    }
  };
}
export default UserStore;
