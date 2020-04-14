import { action, observable, computed } from "mobx";
import API from "../utils/API";

export default class SourceStore {
  @observable sources = observable.array();

  @observable userSources = observable.array();

  @observable aliveSources = observable.array();

  @observable isModalshown = false;

  @observable selectedSource = {};

  constructor(stores) {
    this.stores = stores;
  }

  @action
  reset = () => {
    this.userSources.replace([]);
  };

  @computed
  get getUserAliveSources() {
    return this.userSources.filter((source) =>
      this.aliveSources.includes(source.uri)
    );
  }

  @action
  setAliveSources = (aliveSources) => {
    this.aliveSources.replace(aliveSources);
  };

  @action
  addSource = async (source) => {
    try {
      await API.post("/sources", source);
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
    try {
      await this.fetchAllSources();
      await this.fetchUserSources();
    } catch (e) {
      throw e;
    }
  };

  @action
  deleteSource = async (source) => {
    try {
      await API.delete(`/sources/${source._id}`);
      await this.updateSources();
    } catch (e) {
      throw e;
    }
  };

  @action
  setIsModalShown = (show) => {
    this.isModalshown = show;
  };

  @action
  setSelectedSource = (source) => {
    this.selectedSource = source;
  };

  @action
  updateSource = async (source) => {
    try {
      await API.put(`/sources/${source._id}`, source);
      await this.updateSources();
    } catch (err) {
      throw err;
    }
  };
}
