import Forge from "node-forge";
import * as CryptoJS from "crypto-js";

const publicKeyUrl = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBNYnPoyDQ3yn54brXFpFAn
OrpRSHPQtCM107sNRYFdFcp+K8la5jvUKh2ufJn6DGsnuFGOHvxymxM5GEixDwkr
jynWFC6G55E0Zy9z5FIZZaZt5OR6dW325ZiaDALAVCgHCos6G+Bmoi8i0e9nkXU2
p52cZK6u2rVgg099MpxTXdCoLC7KZHmU94XfvfunP4SmqbEuTuN0+dJKB0Rf7a9J
YUYQkF1kfyUH4ar7dbDEbn0+EeZQxj2Zd60fvMcWB5Cewt979ATjAaI6/vPEzPPc
8lcZmJWeRpV/qRRnvprisoj9aotj4p+I4PsXi73LiOgst6ZEB96AzcK8hC9dHZ9v
AgMBAAE=
-----END PUBLIC KEY-----`;

const publicKey = Forge.pki.publicKeyFromPem(publicKeyUrl);

export const encryptWithPublicKey = async (plainText) => {
    let base64 = encodeBase64(plainText);
    var enc = await publicKey.encrypt(base64, "RSA-OAEP", {
        md: Forge.md.sha256.create(),
    });
    return encodeBase64(enc);
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