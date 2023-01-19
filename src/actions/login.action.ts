import {
  AuthURL,
  LOGIN_FAILED,
  LOGIN_FETCHING,
  LOGIN_SUCCESS,
  LOGOUT,
  server,
  USER_UUID_FAILED,
  USER_UUID_FETCHING,
  USER_UUID_SUCCESS,
} from "@/constants";
import { LoginResult } from "@/types/auth-result.type";
import { Content } from "@/types/user.type";
import { httpClient } from "@/utils/HttpClient";
import { encryptWithPublicKey } from "@/utils/nodeForge";
import { wait } from "src/utils/wait";

export const setLoginFetchingToState = () => ({
  type: LOGIN_FETCHING,
});

export const setLoginSuccessToState = (payload: LoginResult) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const setLoginFailedToState = (payload: string) => ({
  type: LOGIN_FAILED,
  payload,
});

export const setLoginLogoutToState = () => ({
  type: LOGOUT,
});

// ================================= Get user on login ================================= //
export const setStateUserToFetching = () => ({
  type: USER_UUID_FETCHING,
});

export const setStateUserToSuccess = (payload: any) => ({
  type: USER_UUID_SUCCESS,
  payload,
});

export const setStateUserToFailed = () => ({
  type: USER_UUID_FAILED,
});

class AuthApi {
  // async login({ email, password }): Promise<string> {
  //     await wait(500);

  //     const result = await httpClient.post(
  //         server.SIGNIN_URL,
  //         {
  //             email: email,
  //             password: encrypt_data(password),
  //             signin_with: 'SYSTEM'
  //         }
  //     );

  //     return new Promise((resolve, reject) => {
  //         try {

  //             // console.log(result);

  //             if (result.status === 200) {
  //                 const { access_token, uuid, refresh_token }: any = result.data.result;
  //                 localStorage.setItem(server.ACCESS_TOKEN_KEY, access_token);
  //                 localStorage.setItem(server.REFRESH_TOKEN_KEY, refresh_token);
  //                 localStorage.setItem(server.UUID, uuid);
  //                 resolve(uuid);
  //             } else {
  //                 reject(new Error('Email and password combination does not match'));
  //                 return;
  //             }

  //         } catch (err) {
  //             console.error(err);
  //             reject(new Error('Internal server error'));
  //         }
  //     });
  // }

  async login({ email, password }): Promise<Content> {
    // await wait(500);

    const ENK_email = await encryptWithPublicKey(email);
    const ENK_password = await encryptWithPublicKey(password);

    const result = await httpClient.post(server.SIGNIN_URL, {
      email: ENK_email,
      password: ENK_password,
    });

    return new Promise((resolve, reject) => {
      try {
        if (result.data.code === 200) {
          // console.log(result.data.result);
          const { login, token, user }: any = result.data.result;
          localStorage.setItem(server.ACCESS_TOKEN_KEY, token.access_token);
          localStorage.setItem(server.REFRESH_TOKEN_KEY, token.refresh_token);
          localStorage.setItem(server.LOGIN_UUID, login.login_uuid);
          localStorage.setItem(server.UUID, user.uuid);
          localStorage.setItem(server.USER, JSON.stringify(user));
          // resolve("success");
          resolve(user);
          // authApi.me(user.uuid);
        } else {
          alert(result.data.description.message);
          reject(new Error("Email and password combination does not match"));
          return;
        }
      } catch (err) {
        alert(result.data.description.message);
        reject(new Error("Internal server error"));
      }
    });
  }

  async signOut(): Promise<string> {
    await wait(500);
    const result = await httpClient.patch(server.SIGNOUT_URL, {
      login_uuid: localStorage.getItem(server.LOGIN_UUID),
    });
    // const refreshUrl = `http://10.88.88.49:3010/api/th/v1/auth/sign-out`;///${uuid}`;
    // const access_token = localStorage.getItem(server.ACCESS_TOKEN_KEY);
    // const refresh_token = localStorage.getItem(server.REFRESH_TOKEN_KEY);

    // const result = await fetch(refreshUrl, {
    //     method: 'PATCH',
    //     headers: ({
    //         'Content-type': 'application/json',
    //         'Authorization': `Bearer ${refresh_token}`,
    //         'token': `${access_token}`
    //     }),

    return new Promise((_resolve, reject) => {
      try {
        if (result.data.code === 200) {
          var language = localStorage.getItem("i18nextLng");
          localStorage.clear();
          localStorage.setItem("i18nextLng", language);
          // alert("reload");
          window.location.href = AuthURL.SIGN_IN;
        } else {
          reject(new Error("Email and password combination does not match"));
          return;
        }
      } catch (err) {
        alert(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async me(uuid): Promise<Content> {
    const result = await httpClient.get(`${server.USERS_URL}/${uuid}`);

    return new Promise((resolve, reject) => {
      try {
        if (result.data.code === 200) {
          // const {
          //     first_name,
          //     last_name,
          //     phone_number,
          //     email,
          //     id,
          //     role_name,
          //     role_id,
          //     status,
          //     image,
          // }: any = result.data.result;

          // localStorage.setItem(server.FIRST_NAME, first_name);
          // localStorage.setItem(server.LAST_NAME, last_name);
          // localStorage.setItem(server.EMAIL, email);
          // localStorage.setItem(server.PHONE, phone_number);
          // localStorage.setItem(server.ROLE_ID, role_id);
          // localStorage.setItem(server.ROLE_NAME, role_name);
          // localStorage.setItem(server.STATUS, status);
          // localStorage.setItem(server.USER_ID, id);
          // localStorage.setItem(server.IMAGE, image);

          localStorage.setItem(server.USER, JSON.stringify(result.data.result));

          // resolve({
          //     first_name: first_name,
          //     last_name: last_name,
          //     email: email,
          //     phone_number: phone_number,
          //     role_id: role_id,
          //     role_name: role_name,
          //     status: status,
          //     id: id,
          //     image: image,
          // });

          resolve(result.data.result);
        } else {
          reject(new Error("Invalid authorization token"));
          return;
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }


  async device(): Promise<string> {
    const IP = require("ip");
    const ipAddress = IP.address();

    const body: any = {
      text: {
        platform: window.navigator.platform,
        uuid: "",
        ip: ipAddress,
      },
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(server.DEVICE, body);

        if (result.data) {
          localStorage.setItem("device", result.data.result);
          resolve(result.data.result);
        } else {
          reject(result.data.message);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async changePassword(
    _old_Password: string,
    _new_Password: string
  ): Promise<string> {
    const uuid = localStorage.getItem(server.UUID);

    const result = await httpClient.get(`auth/${uuid}/change-password`);

    return new Promise((resolve, reject) => {
      try {
        if (result.data.code === 200) {
          localStorage.setItem(server.USER, JSON.stringify(result.data.result));
          resolve(result.data.result);
        } else {
          reject(new Error("Invalid authorization token"));
          return;
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const authApi = new AuthApi();
