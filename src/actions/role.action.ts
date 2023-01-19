import { ROLE_FAILED, ROLE_FETCHING, ROLE_SUCCESS, server } from "@/constants";
import { ScopeResult } from "@/types/scope.type";
import { Department, RoleResult } from "@/types/user.type";
import { httpClient } from "@/utils/HttpClient";
import { AxiosError } from "axios";

export const setRoleFetchingToState = () => ({
  type: ROLE_FETCHING,
});

export const setRoleSuccessToState = (payload: any) => ({
  type: ROLE_SUCCESS,
  payload,
});

export const setRoleFailedToState = (payload: string) => ({
  type: ROLE_FAILED,
  payload,
});

export const getRole = (values: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setRoleFetchingToState());
      const result = await httpClient.get(
        `${server.ROLE_URL}?limit=100&role_type=${values}`
      );

      if (result.status === 200) {
        dispatch(setRoleSuccessToState(result.data));
      } else {
        dispatch(setRoleFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      try {
        if (err.response) {
          dispatch(
            setRoleFailedToState(error.response.data.description.message)
          );
          console.log(
            "Error register",
            error.response.data.description.message
          );
        } else {
          dispatch(setRoleFailedToState(error));
        }
      } catch (error) {
        dispatch(setRoleFailedToState("เกิดข้อผิดพลาด"));
      }
    }
  };
};

class RoleApi {
  async get_all_Role(
    limit: any = "5",
    offset: any = "",
    keyword: any = "",
    role_type: any
  ): Promise<RoleResult> {
    const result = await httpClient.get(
      `${server.ROLE_URL}?limit=${limit}&offset=${offset}&role_type=${role_type}&keyword=${keyword}`
    );

    return new Promise((resolve, reject) => {
      try {
        if (result.status === 200) {
          // console.log("result ", result);
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

  async get_Role(role_id: any): Promise<Department> {
    const result = await httpClient.get(`${server.ROLE_URL}/${role_id}`);

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
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

  async deleted_Role(role_id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.patch(`${server.ROLE_URL}/${role_id}`, {
          enable_flag: false,
          status_flag: "TERMINATED",
        });
        console.log("resutl delete 1 ", result);

        if (result.data) {
          resolve(result.data);
        } else {
          reject(new Error("Invalid authorization token"));
          return;
        }
      } catch (err) {
        console.error(err);
        reject("Internal server error");
      }
    });
  }

  async check_Scope_login(role_id: any): Promise<ScopeResult[]> {
    // const result = await httpClient.get(`${server.ROLE_URL}/${role_id}/scopes`);

    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${server.ROLE_URL}/${role_id}/scopes`
        );
        console.log("role ", result.data.result);
        if (result.data) {
          // if (
          //   result.data.result.some((roles) =>
          //     roles?.code?.includes(ROLE_SCOPE.SIGN_IN)
          //   ) //Check role สามารถ sign in ได้มั้ย
          // ) {
          resolve(result.data.result);
          // } else {
          //   reject(new Error("Invalid Sign in"));
          // }
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

  async getAllScope(): Promise<ScopeResult[]> {
    const result = await httpClient.get(`/scopes`);

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
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

  async get_Scope(role_id: any): Promise<ScopeResult[]> {
    const result = await httpClient.get(`${server.ROLE_URL}/${role_id}/scopes`);

    return new Promise((resolve, reject) => {
      try {
        if (result.data) {
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

  async update_Scope(role_id: any, value): Promise<ScopeResult[]> {
    const result = await httpClient.put(`${server.ROLE_URL}/${role_id}`, value);

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

  async create_role(value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(`${server.ROLE_URL}`, value);

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

  async updateRoleScope(role_id: any, value: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.put(
          `${server.ROLE_URL}/${role_id}/scopes`,
          value
        );

        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data.description.message);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const roleApi = new RoleApi();
