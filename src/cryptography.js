const forge = require("node-forge");

const key = "sKfjZqhxy4yX22xT";
const iv = "djLLZ0rI1waRfdtO";
// decrypt and encrypt uses constant hardcoded key and iv for simplicity sake
export function hash(input) {
    const md = forge.md.sha256.create();
    md.update(input);
    return md.digest().toHex();
}
export function encrypt(input) {
    var cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(input));
    cipher.finish();
    var encrypted = cipher.output;
    let res = encrypted.toHex();
    console.log(res);
    console.log(decrypt(encrypted));
    return res;
}
export function decrypt(encrypted) {
    let enc = forge.util.createBuffer(forge.util.hexToBytes(encrypted), "raw");
    var decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv: iv });
    decipher.update(enc);
    var result = decipher.finish(); // check 'result' for true/false
    return decipher.output.toString();
}
