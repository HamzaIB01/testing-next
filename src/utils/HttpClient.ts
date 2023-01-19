import axios from "axios";
import join from "url-join";
import {
  server,
  apiUrl,
  AuthURL,
  NOT_CONNECT_NETWORK,
  NETWORK_CONNECTION_MESSAGE,
} from "@/constants";
import { store } from "@/pages/_app";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config) => {
  config.timeout = 20000;
  if (!isAbsoluteURLRegex.test(config.url)) {
    config.url = join(apiUrl, config.url);
  }

  // console.log(join(apiUrl, config.url), " timeout ", config);

  const access_Token = localStorage.getItem(server.ACCESS_TOKEN_KEY);
  const refresh_Token = localStorage.getItem(server.REFRESH_TOKEN_KEY);
  const uuid = localStorage.getItem(server.UUID);
  const device = localStorage.getItem("device");

  //SIGNOUT
  if (
    config.url ===
    `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}${server.SIGNOUT_URL}`
  ) {
    config.headers = {
      Authorization: `Bearer ${refresh_Token}`,
      device: device,
      token: `${access_Token}`,
    };
    return config;
  }

  //DEVICE
  if (
    config.url ===
    `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}${server.DEVICE}`
  ) {
    config.headers = {
      device: device,
    };
    return config;
  }

  //getUser
  if (access_Token) {
    config.headers = {
      Authorization: `Bearer ${access_Token}`,
      device: device,
    };
    return config;
  }

  //refresh
  // if (access_Token) {
  //   config.headers = {
  //     Authorization: `Bearer ${refresh_Token}`,
  //     device: device,
  //     token: access_token,
  //   };
  //   return config;
  // }

  //LOGIN
  config.headers = {
    device: device,
  };

  // config.timeout = 10000; // 10 Second
  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log("response ", response);
    return response;
  },
  async (error) => {
    const { dispatch } = store;
    console.log(JSON.stringify(error, undefined, 2));

    console.log("error ", error);
    const originalConfig = error.config;

    if (error.response && error.response.data) {
      if (
        error.response.status === 401 ||
        (error.response.data.code === 401 && !originalConfig._retry)
      ) {
        const access_token = localStorage.getItem(server.ACCESS_TOKEN_KEY);
        const refresh_token = localStorage.getItem(server.REFRESH_TOKEN_KEY);
        const uuid = localStorage.getItem(server.UUID);
        const refreshUrl = `${apiUrl}${server.REFRESH_TOKEN_URL}`; ///${uuid}`;
        const device = localStorage.getItem("device");
        originalConfig._retry = true;

        try {
          //   const result = await fetch(refreshUrl, {
          //     method: "POST",
          //     headers: {
          //       "Content-type": "application/json",
          //       Authorization: `Bearer ${refresh_token}`,
          //       token: `${access_token}`,
          //       device: `${device}`,
          //     },
          //   })
          //     .then((result) => {
          //       console.log("origi ", result);
          //       if (result.ok) {
          //         return result.json();
          //       }

          //       return Promise.reject(result);
          //     })
          //     .then((actualData) => {
          //       localStorage.setItem(
          //         server.ACCESS_TOKEN_KEY,
          //         actualData.result.access_token
          //         // return instance(originalConfig);
          //         // ),
          //         // window.location.reload()
          //       );
          //       return axios(originalConfig);
          //     })
          //     .catch((err) => {
          //       alert("เกิดข้อผิดพลาด " + err.status);
          //       // console.log("origiresult ", err);
          //     });
          // .then((result) => console.log("origi ", result))
          // .then((actualData) => {
          //   localStorage.setItem(
          //     server.ACCESS_TOKEN_KEY,
          //     actualData.result.access_token
          //     // ),
          //     // window.location.reload()
          //   );
          //   return axios(originalConfig);
          // });

          const result = await fetch(refreshUrl, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${refresh_token}`,
              token: `${access_token}`,
              device: `${device}`,
            },
          })
            .then((result) => result.json())
            .then((actualData) =>
              localStorage.setItem(
                server.ACCESS_TOKEN_KEY,
                actualData.result.access_token
                // return instance(originalConfig);
                // ),
                // window.location.reload()
              )
            );
          // return axios_instance(config)
          return axios(originalConfig);
        } catch (error) {
          // alert("login Again");
          localStorage.removeItem(server.ACCESS_TOKEN_KEY);
          localStorage.removeItem(server.REFRESH_TOKEN_KEY);
          localStorage.clear();
          window.location.href = AuthURL.SIGN_IN;
          return Promise.reject(error);
        }
      } else if (error.response.status === 403) {
        //force logout
        localStorage.removeItem(server.ACCESS_TOKEN_KEY);
        localStorage.removeItem(server.REFRESH_TOKEN_KEY);
      }
      // else if (
      //   error.response.status === 400 ||
      //   error.response.data.code === 400
      // ) {

      //   if (
      //     error.response.data.description.error_code === "3000" ||
      //     error.response.data.description.error_code === "3029"
      //   ) {
      //     alert(error.response.data.description.message);
      //   } else {
      //     alert(error.response.data.description.message);
      //   }




      //   // window.location.href = "/404";
      //   // return Promise.reject();

      //   // return Promise.reject(error.response.data.code);
      // }
    }

    if (!error.status) {
      return Promise.reject(error);
    }
    // else {
    //   alert(error.message);
    // }

    if (axios.isCancel(error)) {
      alert(error);
      return Promise.reject(error);
    } else if (!error.response) {
      alert(JSON.stringify(error));
      return Promise.reject({
        code: NOT_CONNECT_NETWORK,
        message: NETWORK_CONNECTION_MESSAGE,
      });
    }

    // if (error) {
    //   // alert(error.reponse.data.description.message);
    // } else {
    // alert(error.message);
    // }
    // alert(error.response.data.description);
    // if (error.response.data.status) {
    //   alert(error.response.data.description.message);
    // }
    console.log("log ", error);
    return Promise.reject(error);
  }
);

export const httpClient = axios;
