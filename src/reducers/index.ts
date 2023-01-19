import { combineReducers } from "redux";
import loginReducer, { LoginState } from "./login.reducer";
import registerReducer, { RegisterState } from "./register.reducer";
import getalluserReducer, { GetAllUserState } from "./getalluser.reducer";
import roleReducer, { RoleState } from "./role.reducer";
import userReducer, { UserState } from "./user.reducer";
import userDeleteReducer, { UserDeleteState } from "./user.delete.reducer";
import updateStepReducer, { updateStepState } from "./step.reducer";

export default combineReducers({
  registerReducer,
  loginReducer,
  getalluserReducer,
  roleReducer,
  userReducer,
  userDeleteReducer,
  updateStepReducer,
});

export interface RootReducers {
  registerReducer: RegisterState;
  loginReducer: LoginState;
  getalluserReducer: GetAllUserState;
  roleReducer: RoleState;
  userReducer: UserState;
  userDeleteReducer: UserDeleteState;
  // updateStepReducer: updateStepState;
}
