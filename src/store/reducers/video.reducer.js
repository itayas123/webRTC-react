import * as actionTypes from "../actions";

const initialState = {
  videoArray: [],
  videoSplit: 1
};

const videoReducer = (state = initialState, action) => {
  const temp = state.videoArray ? [...state.videoArray] : [];
  switch (action.type) {
    case actionTypes.PUSH_VIDEO:
      temp.push(action.video);
      return {
        ...state,
        videoArray: temp
      };
    case actionTypes.POP_VIDEO:
      const index = temp.indexOf(action.video);
      if (index > -1) {
        temp.splice(index, 1);
        return {
          ...state,
          videoArray: temp
        };
      } else {
        return state;
      }
    case actionTypes.CHANGE_SPLIT:
      for (let i = action.split; i < temp.length; i++) {
        temp.pop();
      }
      return {
        videoArray: temp,
        videoSplit: action.split
      };
    default:
      return state;
  }
};

export default videoReducer;
