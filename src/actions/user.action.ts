import {
  USER_FAILED,
  USER_FETCHING,
  USER_SUCCESS,
  USER_DELETE_FETCHING,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAILED,
  server,
} from "@/constants";
import { UserResult } from "@/types/user.type";
import { encryptData } from "@/utils/crypto";
import { httpClient } from "@/utils/HttpClient";
import { encryptWithPublicKey } from "@/utils/nodeForge";
import { AxiosError } from "axios";

export const setUserFetchingToState = () => ({
  type: USER_FETCHING,
});

export const setUserSuccessToState = (payload: any) => ({
  type: USER_SUCCESS,
  payload,
});

export const setUserFailedToState = (payload: string) => ({
  type: USER_FAILED,
  payload,
});

export const setUserDeleteFetchingToState = () => ({
  type: USER_DELETE_FETCHING,
});

export const setUserDeleteSuccessToState = (payload: any) => ({
  type: USER_DELETE_SUCCESS,
  payload,
});

export const setUserDeleteFailedToState = (payload: string) => ({
  type: USER_DELETE_FAILED,
  payload,
});

export const getUserProfile = (uuid: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setUserFetchingToState());
      const result = await httpClient.get(
        `${server.GET_USERS_PROFILE_URL}/${uuid}`
      );
      if (result.status === 200) {
        console.log("result get Profile ", result);
        dispatch(setUserSuccessToState(result.data));
      } else {
        dispatch(setUserFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        dispatch(setUserFailedToState(error.response.data.description.message));
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(setUserFailedToState(error));
      }
    }

    // dispatch(setUserFetchingToState());
    // const result = await httpClient.put(
    //     `${server.GET_USERS_PROFILE_URL}/${uuid}`,{
    //         first_name: encryptData(values.first_name)
    //     }
    // );
    // if (result.status === 200) {
    //     alert("UPDate")
    //     console.log("result update Profile ", result)
    //     dispatch(setUserSuccessToState(result.data));
    // } else {
    //     alert("UPDate")
    //     dispatch(setUserFailedToState("Register failed"));
    // }
  };
};

export const updateUserProfile = (body: any, path: string) => {
  return async (dispatch: any) => {
    const uuid = JSON.parse(localStorage.getItem(server.USER)).uuid;

    try {
      //   if (type === PersonalType.Contact) {
      //     path = "contract";
      //     body = {
      //       phone_number: values.phone_number,
      //       email: values.email,
      //     };
      //   }
      dispatch(setUserFetchingToState());
      const result = await httpClient.put(
        `${server.GET_USERS_PROFILE_URL}/${uuid}/${path}`,
        body
      );
      if (result.status === 200) {
        alert("Success");
        console.log("result get Profile ", result);
        dispatch(setUserSuccessToState(result.data));
      } else {
        dispatch(setUserFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        dispatch(setUserFailedToState(error.response.data.description.message));
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(
          setUserFailedToState(
            error == ""
              ? error.message
              : "เกิดข้อผิดพลาดไม่สามารถแก้ไขข้อมูลได้ในขณะนี้"
          )
        );
      }
    }
  };
};

export const updateStatusUserProfile = (values: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setUserFetchingToState());
      const result = await httpClient.get(
        `${server.GET_USERS_PROFILE_URL}/${values}`
      );

      if (result.status === 200) {
        console.log("result get Profile ", result);
        dispatch(setUserSuccessToState(result.data));
      } else {
        dispatch(setUserFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        dispatch(setUserFailedToState(error.response.data.description.message));
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(setUserFailedToState(error));
      }
    }
  };
};

// export const deleteUserProfile = (uuid: any) => {
//   return async (dispatch: any) => {
//     try {
//       dispatch(setUserDeleteFetchingToState());
//       const result = await httpClient.patch(
//         `${server.GET_USERS_PROFILE_URL}/${uuid}`,
//         {
//           enable_flag: false,
//           status_flag: "TERMINATED",
//         }
//       );
//       if (result.status === 200) {
//         console.log("result update Profile ", result);
//         dispatch(setUserDeleteSuccessToState(result.data));
//       } else {
//         dispatch(setUserDeleteFailedToState("deleted failed"));
//       }
//     } catch (error) {
//       const err = error as AxiosError;
//       // console.log("result update Profile ", err);
//       if (err.response) {
//         dispatch(setUserDeleteFailedToState(error.response.data.message));
//         // console.log("Error register", error.response.data.description.message);
//       } else {
//         dispatch(
//           setUserDeleteFailedToState(
//             error == ""
//               ? error.message
//               : "เกิดข้อผิดพลาดไม่สามารถลบข้อมูลได้ในขณะนี้"
//           )
//         );
//       }
//     }
//   };
// };

class UserApi {
  async getAllUser(
    limit: any = "5",
    offset: any = "",
    keyword: any = "",
    values: any
  ): Promise<UserResult> {
    const uuid = JSON.parse(localStorage.getItem(server.USER)).uuid;
    const result = await httpClient.get(
      `${
        server.GET_ALL_USERS_URL
      }?limit=${limit}&offset=${offset}&role_type=${values}&keyword=${
        keyword.length > 0 ? encodeURI(keyword) : ""
      }`
    );

    return new Promise((resolve, reject) => {
      try {
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("No content"));
        }
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  async update_Profile(value: any, path: string): Promise<any> {
    const uuid = JSON.parse(localStorage.getItem(server.USER)).uuid;
    const result = await httpClient.put(
      `${server.GET_USERS_PROFILE_URL}/${path}`,
      value
    );

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
          resolve(result.data);
        } else {
          reject(new Error("No content"));
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async delete_user_profile(uuid: any): Promise<any> {
    const result = await httpClient.patch(
      `${server.GET_USERS_PROFILE_URL}/${uuid}`,
      {
        enable_flag: false,
        status_flag: "TERMINATED",
      }
    );

    console.log("result  hhh", result);

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

  async update_user(value: any, path: string, uuid: any): Promise<any> {
    // const uuid = JSON.parse(localStorage.getItem(server.USER)).uuid;
    const result = await httpClient.put(
      `${server.GET_USERS_PROFILE_URL}/${uuid}/${path}`,
      value
    );

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data.status);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async create_user(value: any): Promise<any> {
    const body = {
      prefix_id: 1,
      first_name: await encryptWithPublicKey(value.first_name),
      last_name: await encryptWithPublicKey(value.last_name),
      // citizen_number: await encryptWithPublicKey(
      //   value.citizen_number.split("-").join("")
      // ),
      // birth_date: "1996-11-17",
      people_type: 1,
      email: await encryptWithPublicKey(value.email),
      phone_number: await encryptWithPublicKey(
        value.phone_number.split("-").join("")
      ),
      // laser_code: await encryptWithPublicKey(
      //   value.laser_code.split("-").join("")
      // ),
      nationality_id: 206,
      role_id: value.role_id,
      department_uuid: value.department_uuid,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(
          `${server.GET_USERS_PROFILE_URL}`,
          body
        );

        console.log("result x ", result);
        if (result.data) {
          resolve(result.data);
        } else {
          reject(new Error("No content"));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async get_user(uuid: any): Promise<any> {
    const result = await httpClient.get(`${server.USERS_URL}/${uuid}`);

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async verify_user(uuid: any, value: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(
          `${server.USERS_URL}/${uuid}/verify`,
          value
        );

        console.log("====result", result);

        if (result.data) {
          resolve(result.data);
        } else {
          reject(new Error("No content"));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async get_file_user(name: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(`${server.USERS_URL}/file/${name}`);
        const imageBlob = await result.data?.blob();
        console.log("result ", URL.createObjectURL(imageBlob));

        if (result.data.code === 200) {
          resolve(result.data?.result);
        } else {
          reject(new Error("No content"));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async getDownloadImportFile(name): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/users/file/${name}?operator=download`,
          {
            headers: {
              device: localStorage.getItem("device"),
              access_token: localStorage.getItem("access_token"),
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        ).then((response) => {
          if (response.status === 200) {
            console.log("response.status", response);

            response.blob().then((blob) => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = url;
              a.download = name;
              a.click();

              resolve(response);
            });
          } else {
            reject(response);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const userApi = new UserApi();
