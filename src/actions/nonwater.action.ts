import { server } from "@/constants";
import {
  ExportAutoResult,
  NonWaterResult,
  WaterResult,
} from "@/types/water.type";
import { decryptData } from "@/utils/crypto";
import { httpClient } from "@/utils/HttpClient";

class NonWaterApi {
  async getAutoCategories(user_uuid): Promise<WaterResult> {
    const result = await httpClient.get(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_AUTO_CATEGORIES}?limit=999&offset=0`,
      user_uuid
    );

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

  async getAutoFiles(value): Promise<ExportAutoResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_AUTO_FILES}?offset=0&limit=999&from=${value.from}&to=${value.to}&category_uuid=${value.category_uuid}&interval_uuid=${value.stringInterval}`,
          value
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
          return;
        }
      } catch (err) {
        alert(err);
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }
  async createManual(values): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_MANUAL}`,
          values
        );
        console.log("result Request Data ", result);
        if (result.data) {
          resolve(result.data);
        } else {
          reject(new Error("Invalid authorization token"));
          return;
        }
      } catch (err) {
        alert(err);
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }
  async getManual(value: string): Promise<NonWaterResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_MANUAL}/${value}`
        );
        if (result.data.code === 200) {
          resolve(result.data.result);
        } else if (result.data.code === 204) {
          resolve(null);
        } else {
          reject(new Error("Invalid authorization token"));
        }
      } catch (err) {
        // console.error(err);

        reject(err);
        return;
      }
    });
  }

  async getManualAll(user_uuid): Promise<NonWaterResult> {
    // const body = {
    //   user_uuid: value,
    // };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_MANUAL}?user_uuid=${user_uuid}`
        );
        if (result.data.code === 200) {
          resolve(result.data.result);
        } else if (result.data.code === 204) {
          resolve(null);
        } else {
          reject(new Error("Invalid authorization token"));
        }
      } catch (err) {
        // console.error(err);

        reject(err);
        return;
      }
    });
  }

  async getActivity(): Promise<any> {
    const result = await httpClient.get(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT_ACTION}`,
      {
        headers: {
          device: localStorage.getItem("device"),
          access_token: localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

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

  async getActivityProfile(
    limit: any,
    offset: any,
    // department_uuid: any,
    keyword: any,
    action: any
    // activity: any = "",
    // email: string
  ): Promise<any> {
    const uuid = JSON.parse(localStorage.getItem(server.USER)).uuid;
    const department_uuid = JSON.parse(localStorage.getItem(server.USER))
      .department?.uuid;
    const email = decryptData(
      JSON.parse(localStorage.getItem(server.USER)).email
    );

    // console.log("uuid", uuid);
    // console.log("department_uuid", department_uuid);
    // console.log("email", email);

    const result = await httpClient.get(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT}?limit=${limit}&offset=${offset}&department_uuid=${department_uuid}&keyword=${keyword}&action=${action}&email=${email}`
      // {
      //   headers: {
      //     device: localStorage.getItem("device"),
      //     access_token: localStorage.getItem("access_token"),
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // }
    );

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

  async getActivityUser(
    limit: any,
    offset: any,
    keyword: any,
    action: any,
    user_uuid: any,
    department_uuid: any
  ): Promise<any> {
    const result = await httpClient.get(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT}?limit=${limit}&offset=${offset}&department_uuid=${department_uuid}&keyword=${keyword}&action=${action}&user_uuid=${user_uuid}`,
      {
        headers: {
          device: localStorage.getItem("device"),
          access_token: localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

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
}

export const nonWaterApi = new NonWaterApi();
