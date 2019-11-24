import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import sourceReducer from "./source.reducer";

export default combineReducers({ userReducer, sourceReducer });
