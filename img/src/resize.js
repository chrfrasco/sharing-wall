const sharp = require("sharp");

/**
 * @param {Buffer} imgBuffer png buffer
 * @param {{width?: number, height?: number}} dims
 */
function resize(imgBuffer, dims) {
  return sharp(imgBuffer)
    .resize(1432, 1432)
    .crop()
    .toBuffer()
    .then(buffer =>
      sharp(buffer)
        .resize(dims.width)
        .toBuffer()
    );
}

module.exports = resize;
