import { action, observable } from "mobx";

export default class UiStore {
  @observable showSidebar = false;

  constructor(stores) {
    this.stores = stores;
  }

  @action
  setShowSidebar = show => {
    this.showSidebar = show;
  };
}
