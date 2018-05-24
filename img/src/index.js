//@ts-check
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");

const createRenderer = require("./renderer");
const resize = require("./resize");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(morgan("combined"));

function validate(body, properties) {
  let valid = true;
  let missing = [];
  for (const prop of properties) {
    if (body[prop] == null || body[prop] === "") {
      valid = false;
      missing.push(prop);
    }
  }

  const message = `Missing ${missing.map(s => `"${s}"`).join(", ")} in body`;
  return { valid, message };
}

let renderer;

async function handle(
  req,
  res,
  { quote = null, name = null, backgroundVersion = null }
) {
  const { valid, message } = validate({ quote, name, backgroundVersion }, [
    "quote",
    "name",
    "backgroundVersion"
  ]);
  if (!valid) {
    res.status(400).send(message);
    return;
  }

  try {
    const imgBuffer = await renderer.quote({ quote, name, backgroundVersion });
    const smallImgBuffer = await resize(imgBuffer, { width: 400 });

    const lge = imgBuffer.toString("base64");
    const sml = smallImgBuffer.toString("base64");
    res.status(200).send({ sml, lge });
  } catch (e) {
    throw e;
  }
}

app.get("/", async (req, res) => {
  await handle(req, res, req.query);
});

app.post("/", async (req, res) => {
  await handle(req, res, req.body);
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ msg: "something went wrong" });
});

(async () => {
  try {
    renderer = await createRenderer();
    await renderer.initPage();

    // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`app is listening on :${port}`));
  } catch (e) {
    console.error(`failed to init browser: ${e}`);
    process.exit(1);
  }
})();
