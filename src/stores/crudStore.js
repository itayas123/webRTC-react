import { observable, action } from "mobx";
import API from "../utils/API";

export default class CRUDStore {
  @observable list = observable.array();

  @observable isModalshown = false;

  @observable selected = {};

  constructor(baseRoute) {
    this.baseRoute = baseRoute;
  }

  @action
  async fetchAll() {
    try {
      const list = await API.get(this.baseRoute);
      this.list.replace(list);
    } catch (err) {
      throw err;
    }
  }

  @action
  create = async (object) => {
    try {
      const created = await API.post(this.baseRoute, object);
      await this.fetchAll();
      return created;
    } catch (err) {
      throw err;
    }
  };

  @action
  update = async (object) => {
    try {
      const updated = await API.put(`${this.baseRoute}/${object._id}`, object);
      await this.fetchAll();
      return updated;
    } catch (err) {
      throw err;
    }
  };

  @action
  delete = async (id) => {
    try {
      const deleted = await API.delete(`${this.baseRoute}/${id}`);
      await this.fetchAll();
      return deleted;
    } catch (err) {
      throw err;
    }
  };

  @action
  setIsModalShown = (show) => {
    this.isModalshown = show;
  };

  @action
  setSelected = (selected) => {
    this.selected = selected;
  };
}
