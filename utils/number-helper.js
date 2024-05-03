function parseNumber(val) {
  try {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  } catch (error) {
    return 0;
  }
}

module.exports = {
  parseNumber,
};
