import { observable, action } from "mobx";
import API from "../utils/API";
import { TOKEN } from "./userStore";

export default class SourceStore {
  @observable sources = observable.array();

  @action
  addSource = async (name, src, usersToSend) => {
    try {
      const source = await API.post("/sources", {
        source: { name: name, src: src },
        users: usersToSend
      });
      this.sources.push(source);
    } catch (e) {
      throw e;
    }
  };

  @action
  fetchUserSources = async () => {
    try {
      const token = localStorage.getItem(TOKEN);
      let userSources = [];
      if (token) {
        userSources = await API.get(`/sources?token=${token}`);
      }
      this.sources.replace(userSources);
    } catch (e) {
      throw e;
    }
  };

  @action
  deleteSource = async name => {
    try {
      const source = await API.delete(`/sources?name=${name}`);
      const index = this.sources.indexOf(source);
      if (index > -1) this.sources.splice(index, 1);
    } catch (e) {
      throw e;
    }
  };
}
