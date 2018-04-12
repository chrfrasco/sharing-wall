const fs = require("fs");
const { promisify } = require("util");

const open = promisify(fs.open);
const write = promisify(fs.writeFile);

async function upload(imgBuf, id) {
  const path = `data/${id}.png`;
  const descriptor = await open(path, "w");
  await write(descriptor, imgBuf);
  return path;
}

module.exports.upload = upload;
