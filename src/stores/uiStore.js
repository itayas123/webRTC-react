import { observable, action } from "mobx";
import API from "../utils/API";
import { TOKEN } from "./userStore";

export default class UiStore {
  @observable showSidebar = false;

  @action
  setShowSidebar = show => {
    this.showSidebar = show;
  };
}
