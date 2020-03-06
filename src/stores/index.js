import UserStore from "./userStore";
import SourceStore from "./sourceStore";
import VideoStore from "./videoStore";

export const USER_STORE = "userStore";
export const SOURCE_STORE = "sourceStore";
export const VIDEO_STORE = "videoStore";

class Stores {
  constructor() {
    this.userStore = new UserStore();
    this.sourceStore = new SourceStore();
    this.videoStore = new VideoStore();
  }

  getStores() {
    return {
      [USER_STORE]: this.userStore,
      [SOURCE_STORE]: this.sourceStore,
      [VIDEO_STORE]: this.videoStore
    };
  }
}

const rootStore = new Stores();

export default rootStore.getStores();
