import UserStore from "./userStore";

class Stores {
  constructor() {
    this.userStore = new UserStore();
  }

  getStores() {
    return {
      userStore: this.userStore
    };
  }
}

const rootStore = new Stores();

export default rootStore.getStores();
