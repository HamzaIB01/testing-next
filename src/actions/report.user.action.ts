import { ROLE_FAILED, ROLE_FETCHING, ROLE_SUCCESS, server } from "@/constants";
import { Content, ContentResult, ReportResult } from "@/types/report.type";
import {
  ContentUserReportDormantResult,
  ContentUserReportResult,
  UserReportContent,
  UserReportDormantContent,
} from "@/types/report.user";
import { ScopeResult } from "@/types/scope.type";
import { Department } from "@/types/user.type";
import { httpClient } from "@/utils/HttpClient";
import { AxiosError } from "axios";

class ReportUserApi {
  async getUserReport(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<ContentUserReportResult> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("dormantxxx ", path);
        const result = await httpClient.get(
          encodeURI(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=display${path}`
          )
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

  async getDormantReport(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<ContentUserReportDormantResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=display${path}`
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
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`
        );
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
export const reportUserApi = new ReportUserApi();
