import { server } from "@/constants";
import {
  DatasetContent,
  DatasetImportLogResult,
  DatasetResult,
} from "@/types/water.type";
import { httpClient } from "@/utils/HttpClient";

class WaterDatasetApi {
  async createDataset(value, provide_source_uuid): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}/${provide_source_uuid}/config`,
          value
        );
        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data.manage);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async getAllDataset(provide_source_uuid): Promise<DatasetResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_PROVIDE_SOURCES}/${provide_source_uuid}/config`
        );
        // console.log("get all dataset ", result);
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("Failed"));
        }
      } catch (err) {
        alert(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async getDatasetImportConfig(import_config_uuid): Promise<DatasetContent> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_CONFIG}/${import_config_uuid}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("Invalid authorization token"));
          return;
        }
      } catch (err) {
        alert(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async updateDatasetImportConfig(import_config_uuid, value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.put(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_CONFIG}/${import_config_uuid}`,
          value
        );

        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data.manage);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async patchDatasetImportConfig(import_config_uuid, value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.patch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}${server.IMPORT_CONFIG}/${import_config_uuid}`,
          value
        );

        if (result.data) {
          resolve(result.data);
        } else {
          reject(result.data.manage);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async getImport_log(import_log_uuid): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.IMPORT_LOG}/${import_log_uuid}`
        );
        if (result.data.result) {
          resolve(result.data.result.log_response);
        } else {
          // resolve(result.data);
          reject(result.data);
          // return;
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async getDatasetImport_log(
    import_log_uuid,
    limit,
    offset
  ): Promise<DatasetImportLogResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.DATASET_IMPORT_CONFIG}/${import_log_uuid}?limit=${limit}&offset=${offset}`
        );
        console.log("result dataset import log ", result);
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject("ไม่พบข้อมูล Datasets import_log");
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const waterDatasetApi = new WaterDatasetApi();
