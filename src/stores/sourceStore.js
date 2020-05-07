import { action, observable, computed } from "mobx";
import API from "../utils/API";
import CRUDStore from "./crudStore";

export default class SourceStore extends CRUDStore {
  @observable userSources = observable.array();

  @observable aliveSources = observable.array();

  constructor(stores) {
    super("/sources");
    this.stores = stores;
  }

  @action
  reset = () => {
    this.userSources.replace([]);
  };

  @action
  async fetchAll() {
    try {
      await super.fetchAll();
      await this.fetchUserSources();
    } catch (err) {
      throw err;
    }
  }

  addSourceToUsers = (source, users) => {
    if (users && users.length) {
      return API.post(`${this.baseRoute}/addSourceToUsers`, { source, users });
    }
  };

  @computed
  get getUserAliveSources() {
    return this.userSources.filter((source) =>
      this.aliveSources.includes(source.uri)
    );
  }

  @action
  setAliveSources = (aliveSources) => {
    console.log("aliveSources", aliveSources);
    this.aliveSources.replace(aliveSources);
  };

  @action
  fetchUserSources = async () => {
    try {
      const userSources = await API.get(`${this.baseRoute}/sourcesByUser`);
      this.userSources.replace(userSources);
    } catch (e) {
      throw e;
    }
  };
}
