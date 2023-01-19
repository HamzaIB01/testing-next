import { ROLE_FAILED, ROLE_FETCHING, ROLE_SUCCESS, server } from "@/constants";
import { Content, ContentResult, ReportResult } from "@/types/report.type";
import { ScopeResult } from "@/types/scope.type";
import { Department } from "@/types/user.type";
import { httpClient } from "@/utils/HttpClient";
import { AxiosError } from "axios";
import { format } from "date-fns";

class ReportApi {
  async getExportReportNonWater(parameter): Promise<ContentResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=999&offset=0&keyword=manual-export&action=display${parameter}`
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

  async getExportReportAPI(parameter): Promise<ContentResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=999&offset=0&keyword=information-service&action=display${parameter}&type=CN_MTWS1`
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
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=999&offset=0${parameter}`
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

  async getExportReport(
    parameter,
    limit,
    offset,
    keyword,
    type = "",
    path = ""
  ): Promise<ContentResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${
            server.EXPORT_REPORT
          }?limit=${limit}&offset=${offset}&keyword=${keyword}&action=display${parameter}&type=${type}${`${path}`}`
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
      // try {
      //   const result = await fetch(
      //     `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${
      //       server.EXPORT_REPORT
      //     }?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}&type=${type}${`&${path}`}`,
      //     {
      //       headers: {
      //         device: localStorage.getItem("device"),
      //         access_token: localStorage.getItem("access_token"),
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //       },
      //     }
      //   ).then((response) => {
      //     response.blob().then((blob) => {
      //       let url = window.URL.createObjectURL(blob);
      //       let a = document.createElement("a");
      //       a.href = url;
      //       a.download; //= filename;
      //       a.click();
      //     });
      //   });
      // } catch (error) {
      //   // alert(error);
      //   reject(error);
      // }
      // try {
      //   const result = await fetch(
      //     `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${
      //       server.EXPORT_REPORT
      //     }?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}&type=${type}${`&${path}`}`,
      //     {
      //       headers: {
      //         device: localStorage.getItem("device"),
      //         access_token: localStorage.getItem("access_token"),
      //         "Content-Type": "application/json",
      //         Accept: "application/json",
      //       },
      //     }
      //   ).then((response) => {
      //     response.blob().then((blob) => {
      //       let url = window.URL.createObjectURL(blob);
      //       let a = document.createElement("a");
      //       a.href = url;
      //       a.download; // = name;
      //       a.click();
      //       resolve(result);
      //     });
      //   });
      // } catch (error) {
      //   reject(error);
      // }
      try {
        const uuid = localStorage.getItem(server.UUID);
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download&type=${type}${parameter}${path}`,
          {
            headers: {
              method: "GET",
              device: localStorage.getItem("device"),
              access_token: localStorage.getItem("refresh_token"),
              "Content-Type": "application/json",
              // Authorization: `Bearer ${localStorage.getItem(
              //   server.REFRESH_TOKEN_KEY
              // )}`,
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              Accept: "application/json",
            },
          }
        ).then((response) => {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = `${
              keyword + format(new Date(), "dd-MM-yyyy hh:mm:ss")
            }`;
            a.click();
          });
        });
      } catch (error) {
        alert(error);
      }

      // try {
      //   const result = await httpClient.get(
      //     `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download&type=${type}${parameter}${path}`
      //   );
      //   if (result.data) {
      //     resolve(result.data);
      //   } else {
      //     reject(new Error("ไม่พบข้อมูล"));
      //   }
      // } catch (err) {
      //   // alert(err);
      //   reject(err);
      // }
    });
  }
}

export const reportApi = new ReportApi();
