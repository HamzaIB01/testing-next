import { server } from "@/constants";
import { AllApiKeyResult } from "@/types/api_keys.type";
import { httpClient } from "@/utils/HttpClient";

class ApiKeyApi {
  async createApikey(value): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}${server.API_KEY}`,
          value
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

  async getApikeybyuser(user_uuid): Promise<AllApiKeyResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}${server.API_KEY}/users/${user_uuid}`
        );
        console.log("res ", result);
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

  async getApikey(api_key_uuid): Promise<AllApiKeyResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}${server.API_KEY}/${api_key_uuid}`
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

  async updateStatusApikey(api_key_uuid): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await httpClient.patch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}${server.API_KEY}/${api_key_uuid}`,
          {
            enable_flag: false,
            status_flag: "TERMINATED",
          }
        );
        if (result) {
          resolve(result);
        } else {
          reject("ผิดพลาด");
          return;
        }
      } catch (err) {
        // alert(err);
        reject(err);
      }
    });
  }

  async getPostmane(method, body, path, apikey): Promise<any> {
    const device = localStorage.getItem("device");
    return new Promise(async (resolve, reject) => {
      try {
        const result = await fetch(`${path}`, {
          method: method.toUpperCase(),
          headers: {
            "Content-type": "application/json",
            Connection: "keep-alive",
            // Authorization: `Bearer ${localStorage.getItem(
            //   server.ACCESS_TOKEN_KEY
            // )}`,
            Authorization: `Bearer ${apikey}`,
          },
        })
          .then((result) => result.json())
          .then(
            (actualData) => {
              if (actualData) {
                console.log("getpost man ", actualData);
                resolve(actualData);
              } else {
                // console.log("reusllt ", result);
                reject("ไม่พบข้อมูล");
              }
            }
            // resolve(result.data)
            // }
            // localStorage.setItem(
            //   server.ACCESS_TOKEN_KEY,
            //   actualData.result.access_token
            // ),
            // window.location.reload()
          );
      } catch (error) {
        // console.log("reusllt ", error);
        // console.log("axtual ", error);
        // alert("login Again");
        reject(error);
      }

      // try {
      //   // if (method === "get")
      //   const result =
      //     method === "GET"
      //       ? await httpClient.get(`${path}`, body)
      //       : method === "POST"
      //       ? await httpClient.post(`${path}`, body)
      //       : method === "PUT"
      //       ? await httpClient.put(`${path}`, body)
      //       : method === "PATCH"
      //       ? await httpClient.patch(`${path}`, body)
      //       : await httpClient.delete(`${path}`, body);
      //   if (result.data) {
      //     resolve(result.data);
      //   } else {
      //     reject(new Error("Invalid authorization token"));
      //     return;
      //   }
      // } catch (err) {
      //   alert(err);
      //   reject(new Error("Internal server error"));
      // }
    });
  }
}

export const apiKeyApi = new ApiKeyApi();
