import UserStore from "./userStore";
import SourceStore from "./sourceStore";
import VideoStore from "./videoStore";

class Stores {
  constructor() {
    this.userStore = new UserStore(this);
    this.sourceStore = new SourceStore(this);
    this.videoStore = new VideoStore(this);
  }

  getStores() {
    return {
      userStore: this.userStore,
      sourceStore: this.sourceStore,
      videoStore: this.videoStore,
    };
  }
}

const rootStore = new Stores();

export default rootStore.getStores();
