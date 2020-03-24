import { observable, action } from "mobx";
import API from "../utils/API";
import { TOKEN } from "./userStore";

export default class SourceStore {
  @observable sources = observable.array();

  @observable userSources = observable.array();

  constructor(stores) {
    this.stores = stores;
  }

  @action
  reset = () => {
    this.userSources.replace([]);
  };

  @action
  addSource = async (name, uri, usersToSend) => {
    try {
      const source = await API.post("/sources", {
        source: { name, uri },
        users: usersToSend
      });
      await this.updateSources();
    } catch (e) {
      throw e;
    }
  };

  @action
  fetchUserSources = async () => {
    try {
      const userSources = await API.get("/sources/sourcesByUser");
      this.userSources.replace(userSources);
    } catch (e) {
      throw e;
    }
  };

  @action
  fetchAllSources = async () => {
    try {
      const sources = await API.get("/sources");
      this.sources.replace(sources);
    } catch (e) {
      throw e;
    }
  };

  @action
  updateSources = async () => {
    await this.fetchAllSources();
    await this.fetchUserSources();
  };

  @action
  deleteSource = async name => {
    try {
      const source = await API.delete(`/sources?name=${name}`);
      await this.updateSources();
    } catch (e) {
      throw e;
    }
  };
}
