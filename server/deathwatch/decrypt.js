const crypto = require('crypto');
const { Buffer } = require('buffer');

/** decryptStr will decrypt a string using aes-256-cbc and a randomly generated IV.
 * The password needs to be a length 32 to work and IV length 16. The IV is taken from
 * the encrypted string.
 * The function returns a derypted string.
 */
function decryptStr(str, password) {
  let splitStr = str.split('_|_');
  let iv = new Buffer(splitStr[0], 'binary');
  let buff = new Buffer(splitStr[1], 'hex');
  let tempStr = buff.toString('utf8');
  let algorithm = 'aes-256-cbc';
  const decrypt = crypto.createDecipheriv(
    algorithm,
    new Buffer(password.substring(0, 32)),
    iv
  );
  decrypt.setAutoPadding(true);
  tempStr = decrypt.update(buff, 'hex', 'utf8');
  tempStr += decrypt.final('utf8');
  return `${tempStr}`;
}

module.exports = decryptStr;
