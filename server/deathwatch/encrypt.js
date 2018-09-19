const crypto = require('crypto');
const { Buffer } = require('buffer');

/** encryptStr will encrypt a string using aes-256-cbc and a randomly generated IV.
 * The password needs to be a length 32 to work and IV length 16.
 * The function returns an ecrypted string and the IV used to encrypt it, IV:encryptedStr.
 */
function encryptStr(str, password) {
  let buff = new Buffer(str, 'utf8');
  let tempStr = buff.toString('hex', 0, str.length);
  let algorithm = 'aes-256-cbc';
  let iv = crypto.randomBytes(16).toString('binary');
  const encrypt = crypto.createCipheriv(
    algorithm,
    new Buffer(password.substring(0, 32)),
    new Buffer(iv, 'binary')
  );
  encrypt.setAutoPadding(true);
  tempStr = encrypt.update(buff, 'utf8', 'hex');
  tempStr += encrypt.final('hex');
  return `${iv}:${tempStr}`;
}

module.exports = encryptStr;
