import { ROLE_FAILED, ROLE_FETCHING, ROLE_SUCCESS, server } from "@/constants";
import { Content, ContentResult, ReportResult } from "@/types/report.type";
import {
  ContentWaterReliableReportResult,
  ContentWaterReportResult,
} from "@/types/report.water.type";
import { ScopeResult } from "@/types/scope.type";
import { Department } from "@/types/user.type";
import { httpClient } from "@/utils/HttpClient";
import axios, { Axios, AxiosError } from "axios";

class ReportWaterApi {
  async getWaterReport(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<ContentWaterReportResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.IMPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=display&day=7${path}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async getWaterReliableReport(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<ContentWaterReliableReportResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.IMPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=display&day=7${path}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async getExportReportAll(parameter): Promise<ContentResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.IMPORT_REPORT}?limit=999&offset=0${parameter}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async getExportReport(parameter, keyword, type = ""): Promise<ContentResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.IMPORT_REPORT}?limit=999&offset=0&keyword=${keyword}&action=display${parameter}&type=${type}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async getWaterReportImportLog(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<ContentWaterReportResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=display${path}`
        );
        if (result.data.result) {
          resolve(result.data.result);
        } else {
          reject(new Error("ไม่พบข้อมูล"));
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async downloadExportReport(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // const httpClient = Axios.create({ timeout: 2 * 60 * 1000 });
        // const result = await httpClient.get(
        //   `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`,
        //   { timeout: 0 }
        // );
        const access_Token = localStorage.getItem(server.ACCESS_TOKEN_KEY);
        const refresh_Token = localStorage.getItem(server.REFRESH_TOKEN_KEY);
        const device = localStorage.getItem("device");

        const instance = axios.create({
          headers: {
            Authorization: `Bearer ${access_Token}`,
            device: device,
          },
          baseURL: `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`,
          timeout: 0,
        });

        const result = await instance.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`
        );

        // const result = await axios({
        //   method: "get",
        //   url: `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`,
        //   timeout: 0, // only wait for 2s
        // });

        console.log("report result ", result);
        if (result.data.code !== 204) {
          resolve(result.data);
        } else {
          reject(result.data.description.message);
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }
}

export const reportWaterApi = new ReportWaterApi();
