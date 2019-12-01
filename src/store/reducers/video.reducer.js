import * as actionTypes from "../actions";

const initialState = {
  videoArray: [],
  videoSplit: 1
};

const videoReducer = (state = initialState, action) => {
  const tempVideos = state.videoArray ? [...state.videoArray] : [];
  switch (action.type) {
    case actionTypes.PUSH_VIDEO:
      tempVideos.push(action.video);
      return {
        ...state,
        videoArray: tempVideos
      };
    case actionTypes.POP_VIDEO:
      const index = tempVideos.indexOf(action.video);
      if (index > -1) {
        tempVideos.splice(index, 1);
        return {
          ...state,
          videoArray: tempVideos
        };
      } else {
        return state;
      }
    case actionTypes.CHANGE_SPLIT:
      const start = action.split === 3 ? action.split - 1 : action.split;
      for (let i = start; i <= tempVideos.length; i++) {
        tempVideos.pop();
      }
      return {
        videoArray: tempVideos,
        videoSplit: action.split
      };
    default:
      return state;
  }
};

export default videoReducer;
