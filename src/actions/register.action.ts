import {
  REGISTER_FAILED,
  REGISTER_FETCHING,
  REGISTER_SUCCESS,
  server,
} from "@/constants";
import {
  CheckRegisterStatusResult,
  RegisterResult,
} from "@/types/auth-result.type";
import { encryptData } from "@/utils/crypto";
import { httpClient } from "@/utils/HttpClient";
import { encryptWithPublicKey } from "@/utils/nodeForge";
import { AxiosError } from "axios";

export const setRegisterFetchingToState = () => ({
  type: REGISTER_FETCHING,
});

export const setRegisterSuccessToState = (payload: RegisterResult) => ({
  type: REGISTER_SUCCESS,
  payload,
});

export const setRegisterFailedToState = (payload: string) => ({
  type: REGISTER_FAILED,
  payload,
});

export const register = (values: any, _router: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setRegisterFetchingToState());
      const dataUser = {
        prefix_id: 1,
        nationality_id: 206,
        first_name: await encryptWithPublicKey(values.first_name),
        last_name: await encryptWithPublicKey(values.last_name),
        citizen_number: await encryptWithPublicKey(
          values.citizen_number.split("-").join("")
        ),
        laser_code: await encryptWithPublicKey(
          values.laser_code.split("-").join("")
        ),
        birth_date: values.birth_date,
        people_type: values.people_type,
        email: await encryptWithPublicKey(values.email),
        phone_number: await encryptWithPublicKey(
          values.phone_number.split("-").join("")
        ),
        role_id: values.role_id,
        department_uuid: values.department_uuid,
      };
      const result = await httpClient.post(server.REGISTER_URL, dataUser);
      console.log("register ", result);

      if (result.status === 200) {
        dispatch(setRegisterSuccessToState(result.data));
        // const backTo = (router.query.backTo as string) || '/';
        // router.push(backTo);
      } else {
        dispatch(setRegisterFailedToState("Register failed"));
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        dispatch(
          setRegisterFailedToState(error.response.data.description.message)
        );
        console.log("Error register", error.response.data.description.message);
      } else {
        dispatch(setRegisterFailedToState(error));
      }
    }
  };
};

class RegisterApi {
  async regiter(values: any, _router: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const dataUser = {
          prefix_id: 1,
          nationality_id: 206,
          first_name: await encryptWithPublicKey(values.first_name),
          last_name: await encryptWithPublicKey(values.last_name),
          citizen_number: await encryptWithPublicKey(
            values.citizen_number.split("-").join("")
          ),
          laser_code: await encryptWithPublicKey(
            values.laser_code.split("-").join("")
          ),
          birth_date: values.birth_date,
          people_type: values.people_type,
          email: await encryptWithPublicKey(values.email),
          phone_number: await encryptWithPublicKey(
            values.phone_number.split("-").join("")
          ),
          role_id: values.role_id,
          department_uuid: values.department_uuid,
        };

        const result = await httpClient.post(server.REGISTER_URL, dataUser);

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

  async checkRegiterStatus(value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${server.REGISTER_STATUS_URL}?email=${value.email}&citizen_number=${value.citizen_number}`
        );

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

  async verifyRegister(value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(`${server.VERIFY_EMAIL_URL}`, {
          token: value,
        });

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
}

export const registerApi = new RegisterApi();
