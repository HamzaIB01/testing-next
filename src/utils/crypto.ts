import * as CryptoJS from "crypto-js"
import * as crypto from 'crypto';

var KEY = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_REACT_APP_CRYPTO_KEY);
var IV = process.env.NEXT_PUBLIC_REACT_APP_CRYPTO_IV;

var encryptedString;

var options = {
  iv: CryptoJS.enc.Utf8.parse(IV),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
};

export const encryptData = (data) => {
  if (typeof data == "string") {
    data = data.slice();
    encryptedString = CryptoJS.AES.encrypt(data, KEY, options);
  } else {
    encryptedString = CryptoJS.AES.encrypt(JSON.stringify(data), KEY, options);
  }
  return encryptedString.toString();
};

export const decryptData = (encrypted) => {
  try {
    var decrypted = CryptoJS.AES.decrypt(encrypted, KEY, options);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return "-";
  }
};

export const encodeBase64 = (textString) => {
  var words = CryptoJS.enc.Utf8.parse(textString);
  var base64 = CryptoJS.enc.Base64.stringify(words);
  return base64;
};

export const decodeBase64 = (base64Text) => {
  var words = CryptoJS.enc.Base64.parse(base64Text);
  var plainText = CryptoJS.enc.Utf8.stringify(words);
  return plainText;
};

export const createRandomBytes = () => {
  return crypto.randomBytes(64).toString("base64");
};
