import { server } from "@/constants";
import { Department, SubInterval } from "@/types/user.type";
import { AllWaterResult, WaterResult } from "@/types/water.type";
import { httpClient } from "@/utils/HttpClient";

class WaterApi {
  async createImportConfig(value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}`,
          value
        );
        // console.log("result===========", result);

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

  async getAllImportConfigurations(
    limit: any = "5",
    offset: any = "",
    keyword: any = ""
  ): Promise<WaterResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}?limit=${limit}&offset=${offset}&keyword=${keyword}`
        );
        if (result.data.result) {
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

  async getImportConfigurations(
    provide_source_interval_uuid
  ): Promise<Department> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}/${provide_source_interval_uuid}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("Invalid authorization token"));
          return;
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async updateImportConfigurations(
    provide_source_interval_uuid,
    value,
    type
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("---value", value);

        // let arr_deleted = []

        // value.interval.updated.map((item, index) => {
        //   console.log("item.channel_uuid", item.channel_uuid.deleted[index]);

        //   // return arr_deleted = item.channel_uuid.deleted[index];
        // })

        // // console.log("-------value -----", item.channel_uuid.deleted[0]);
        // console.log("-------value -----", arr_deleted);

        // const initialProvide_source = {
        //   name: {
        //     th: value.name?.th ?? "-",
        //     en: value.name?.en ?? "-",
        //   },
        //   description: {
        //     th: value.description?.th ?? "-",
        //     en: value.description?.en ?? "-",
        //   },
        //   coordinator: {
        //     first_name: value?.coordinator?.first_name ?? "-",
        //     last_name: value?.coordinator?.last_name ?? "-",
        //     phone_number: value?.coordinator?.phone_number ?? "-",
        //     email: value?.coordinator?.email ?? "-",
        //   },
        //   link_type: value?.link_type,
        //   start_date: value?.start_date,
        //   keyword: value?.keyword,
        //   law: value?.law,
        //   interval: {
        //     inserted: [],
        //     deleted: arr_deleted,
        //     updated: [],
        //   },
        //   category_uuid: value?.category_uuid,
        //   department_uuid: value?.department_uuid,
        // };

        // console.log("initialProvide_source", initialProvide_source);

        const result = await httpClient.put(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}/${provide_source_interval_uuid}?operator=${type}`,
          value
        );
        console.log("get config eiei ", result);
        if (result.data) {
          resolve(result.data);
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

  async patchImportConfigurations(provide_source_interval_uuid): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.patch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}/${provide_source_interval_uuid}`,
          {
            enable_flag: false,
            status_flag: "TERMINATED",
          }
        );
        // console.log("get config eiei ", result);

        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.status);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async getIntervalImportConfigurations(
    provide_source_interval_uuid
  ): Promise<SubInterval[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}/${provide_source_interval_uuid}/filter`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
          return;
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async getIntervalsByCategory(
    category_uuid,
    department_uuid
  ): Promise<SubInterval[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.INTERVAL_BY_CATEGORY_URL}?category_uuid=${category_uuid}&department_uuid=${department_uuid}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
          return;
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async getDownloadImportFile(name): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}/import/config/file/${name}?operator=download`,
          {
            headers: {
              device: localStorage.getItem("device"),
              access_token: localStorage.getItem("access_token"),
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        ).then((response) => {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = name;
            a.click();
            resolve(result);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async patchDeleteImportConfigurations(
    provide_source_interval_uuid
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.patch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_CONFIG}/${provide_source_interval_uuid}`,
          {
            enable_flag: false,
            status_flag: "TERMINATED",
          }
        );

        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.status);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const waterApi = new WaterApi();
