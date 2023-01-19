import { httpClient } from "@/utils/HttpClient";
import { server } from "@/constants";
import axios from "axios";

class UploadFileApi {
  async uploadFile(user_uuid, formData): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        axios({
          method: "POST",
          //   baseURL: "http://10.88.88.17:3010/api/th/v1",
          url: `/auth/${user_uuid}/upload/jpg?file_tag=image&file_type=document`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.message);
            }
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const uploadFileApi = new UploadFileApi();
