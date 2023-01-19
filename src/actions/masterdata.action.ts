import { httpClient } from "@/utils/HttpClient";

class MasterDataApi {
  async getMasterData(type: any = "intervals"): Promise<any> {
    const result = await httpClient.get(`master-data?type=${type}`);

    return new Promise((resolve, reject) => {
      try {
        // if (result.data.code === 200) {

        console.log("master data ", result.data.result);

        if (result.data) {
          resolve(result.data.result);
        } else {
          // resolve(result.data);
          reject(new Error("No content"));
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }

  async getMasterDataWater(type: any = "intervals"): Promise<any> {
    const result = await httpClient.get(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}/master-data?type=${type}`
    );

    return new Promise((resolve, reject) => {
      try {
        // if (result.data.code === 200) {

        console.log("master data ", result.data.result);

        if (result.data) {
          resolve(result.data.result);
        } else {
          // resolve(result.data);
          reject(new Error("No content"));
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const masterDataApi = new MasterDataApi();
