import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import sourceReducer from "./source.reducer";
import videoReducer from "./video.reducer";

export default combineReducers({ userReducer, sourceReducer, videoReducer });
