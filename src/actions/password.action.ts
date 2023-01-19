import {
  apiUrl,
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_FETCHING,
  CHANGE_PASSWORD_SUCCESS,
  server,
} from "@/constants";
import { RegisterResult } from "@/types/auth-result.type";
import { httpClient } from "@/utils/HttpClient";
import { encryptWithPublicKey } from "@/utils/nodeForge";
import axios, { AxiosError } from "axios";
import { authApi } from "./login.action";

export const setChangePasswordFetchingToState = () => ({
  type: CHANGE_PASSWORD_FETCHING,
});

export const setChangePasswordSuccessToState = (payload: RegisterResult) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload,
});

export const setChangePasswordFailedToState = (payload: string) => ({
  type: CHANGE_PASSWORD_FAILED,
  payload,
});

export const change_password = (old_Password: any, new_Password: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setChangePasswordFetchingToState());

      const password = {
        old_password: await encryptWithPublicKey(old_Password),
        new_password: await encryptWithPublicKey(new_Password),
      };

      const uuid = localStorage.getItem(server.UUID);

      const result = await httpClient.patch(
        `auth/${uuid}/change-password`,
        password
      );

      console.log("forgot_password ", result);
      if (result.status === 200) {
        dispatch(setChangePasswordSuccessToState(result.data));
      } else {
        dispatch(setChangePasswordFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        alert(error.response.data.description.message);
        dispatch(
          setChangePasswordFailedToState(
            error.response.data.description.message
          )
        );
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(setChangePasswordFailedToState(error));
      }
    }
  };
};

export const forgot_password = (email: any) => {
  return async (dispatch: any) => {
    try {
      //   dispatch(setChangePasswordFetchingToState());

      const email_data = {
        email: await encryptWithPublicKey(email),
      };

      const result = await httpClient.post(`auth/forgot-password`, email_data);

      console.log("forgot_password ", result);
      if (result.status === 200) {
        dispatch(setChangePasswordSuccessToState(result.data));
      } else {
        dispatch(setChangePasswordFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        alert(error.response.data.description.message);
        dispatch(
          setChangePasswordFailedToState(
            error.response.data.description.message
          )
        );
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(setChangePasswordFailedToState(error));
      }
    }
  };
};

export const reset_password = (password: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setChangePasswordFetchingToState());

      const password_data = {
        password: await encryptWithPublicKey(password),
      };

      const result = await httpClient.patch(
        `auth/reset-password`,
        password_data
      );

      console.log("reset_password ", result);
      if (result.status === 200) {
        dispatch(setChangePasswordSuccessToState(result.data));
      } else {
        dispatch(setChangePasswordFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        alert(error.response.data.description.message);
        dispatch(
          setChangePasswordFailedToState(
            error.response.data.description.message
          )
        );
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(setChangePasswordFailedToState(error));
      }
    }
  };
};

class PasswordApi {
  async forgot_password(email): Promise<any> {
    const encrypt_email = {
      email: await encryptWithPublicKey(email)
    };

    const result = await httpClient.post(server.FORGOT_PASSWORD, encrypt_email);

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data.message);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async change_password(old_Password, new_Password): Promise<any> {
    const password = {
      old_password: await encryptWithPublicKey(old_Password),
      new_password: await encryptWithPublicKey(new_Password),
    };

    const uuid = localStorage.getItem(server.UUID);

    const result = await httpClient.patch(
      `auth/${uuid}/change-password`,
      password
    );

    return new Promise((resolve, reject) => {
      try {
        console.log("change-password", result);

        if (result.data) {
          resolve(result.data);
        } else {
          reject(new Error("change password:" + result.status));
          return;
        }
      } catch (err) {
        // console.error(err);
        reject(err);
      }
    });
  }

  async reset_password(new_password, verify_token): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const refreshUrl = `${apiUrl}${server.RESET_PASSWORD_URL}`;
        const device = await authApi.device();

        await fetch(refreshUrl, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${verify_token}`,
            device: `${device}`,
          },
          body: JSON.stringify({
            password: await encryptWithPublicKey(new_password),
          }),
        })
          .then((result) => result.json())
          .then((actualData) => {
            // console.log("resultx ", actualData);
            if (actualData.code === 200) {
              resolve(actualData);
            } else {
              reject(actualData.description.message);
            }
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const passwordApi = new PasswordApi();
