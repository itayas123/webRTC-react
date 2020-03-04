import UserStore from "./userStore";
import SourceStore from "./sourceStore";

export const USER_STORE = "userStore";
export const SOURCE_STORE = "sourceStore";

class Stores {
  constructor() {
    this.userStore = new UserStore();
    this.sourceStore = new SourceStore();
  }

  getStores() {
    return {
      [USER_STORE]: this.userStore,
      [SOURCE_STORE]: this.sourceStore
    };
  }
}

const rootStore = new Stores();

export default rootStore.getStores();
