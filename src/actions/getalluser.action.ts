import {
  GETALLUSER_FAILED,
  GETALLUSER_FETCHING,
  GETALLUSER_SUCCESS,
  server,
} from "@/constants";
import { GetAllUserResult } from "@/types/user.type";
import { httpClient } from "@/utils/HttpClient";
import { AxiosError } from "axios";

export const setGetAllUserFetchingToState = () => ({
  type: GETALLUSER_FETCHING,
});

export const setGetAllUserSuccessToState = (payload: GetAllUserResult) => ({
  type: GETALLUSER_SUCCESS,
  payload,
});

export const setGetAllUserFailedToState = (payload: string) => ({
  type: GETALLUSER_FAILED,
  payload,
});

export const getAllUser = (values: string) => {
  return async (dispatch: any) => {
    try {
      console.log("Values", values);
      dispatch(setGetAllUserFetchingToState());
      const result = await httpClient.get(
        `${server.GET_ALL_USERS_URL}?limit=5&role_type=${values}`
      );

      if (result.status === 200) {
        console.log("result get all ", result.data);
        dispatch(setGetAllUserSuccessToState(result.data));
      } else {
        dispatch(setGetAllUserFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        dispatch(
          setGetAllUserFailedToState(error.response.data?.description?.message)
        );
        console.log(
          "Error register",
          error.response.data?.description?.message
        );
      } else {
        dispatch(setGetAllUserFailedToState(error));
      }
    }
  };
};
