const generateRandomString = (length = 256) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function generateRandomCode(length = 6) {
  const max = Math.pow(10, length) - 1;
  const min = Math.pow(10, length - 1);
  const code = Math.floor(Math.random() * (max - min + 1)) + min;

  return code;
}

module.exports = {
  generateRandomString,
  generateRandomCode,
};
