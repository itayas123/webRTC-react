import { action, observable } from "mobx";

export default class UiStore {
  @observable showSidebar = false;

  @action
  setShowSidebar = show => {
    this.showSidebar = show;
  };
}
