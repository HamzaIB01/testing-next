import {
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_FETCHING,
  CHANGE_PASSWORD_SUCCESS,
  server,
} from "@/constants";
import { LoginResult } from "@/types/auth-result.type";

export interface LoginState {
  result?: LoginResult;
  isFetching: boolean;
  isError: boolean;
  error?: string;
}

const initialState: LoginState = {
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }: any): LoginState => {
  switch (type) {
    case CHANGE_PASSWORD_FETCHING:
      return { ...state, isFetching: true, isError: false };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, isFetching: false, isError: false, result: payload };
    case CHANGE_PASSWORD_FAILED:
      return { ...state, isFetching: false, isError: true, error: payload };
    default:
      return state;
  }
};
