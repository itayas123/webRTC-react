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
  fetchAll = async () => {
    try {
      const list = await API.get(this.baseRoute);
      this.list.replace(list);
    } catch (err) {
      throw err;
    }
  };

  @action
  create = async (object) => {
    try {
      await API.post(this.baseRoute, object);
      await this.fetchAll();
    } catch (err) {
      throw err;
    }
  };

  @action
  update = async (object) => {
    try {
      await API.put(`${this.baseRoute}/${object._id}`, object);
      await this.fetchAll();
    } catch (err) {
      throw err;
    }
  };

  @action
  delete = async (id) => {
    try {
      await API.delete(`${this.baseRoute}/${id}`);
      await this.fetchAll();
    } catch (err) {
      throw err;
    }
  };

  @action
  setIsModalShown = (show) => {
    this.isModalshown = show;
  };

  @action.bound
  setSelected(selected) {
    this.selected = selected;
  }
}
