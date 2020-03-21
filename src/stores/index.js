import UserStore from "./userStore";
import SourceStore from "./sourceStore";
import VideoStore from "./videoStore";
import UiStore from "./uiStore";

class Stores {
  constructor() {
    this.userStore = new UserStore(this);
    this.sourceStore = new SourceStore(this);
    this.videoStore = new VideoStore(this);
    this.uiStore = new UiStore(this);
  }

  getStores() {
    return {
      userStore: this.userStore,
      sourceStore: this.sourceStore,
      videoStore: this.videoStore,
      uiStore: this.uiStore
    };
  }
}

const rootStore = new Stores();

export default rootStore.getStores();
