import UserStore from "./userStore";
import SourceStore from "./sourceStore";
import VideoStore from "./videoStore";
import UiStore from "./uiStore";

export const USER_STORE = "userStore";
export const SOURCE_STORE = "sourceStore";
export const VIDEO_STORE = "videoStore";
export const UI_STORE = "uiStore";

class Stores {
  constructor() {
    this.userStore = new UserStore(this);
    this.sourceStore = new SourceStore(this);
    this.videoStore = new VideoStore(this);
    this.uiStore = new UiStore(this);
  }

  getStores() {
    return {
      [USER_STORE]: this.userStore,
      [SOURCE_STORE]: this.sourceStore,
      [VIDEO_STORE]: this.videoStore,
      [UI_STORE]: this.uiStore
    };
  }
}

const rootStore = new Stores();

export default rootStore.getStores();
