#!/bin/env node

const express = require("express");
const bodyParser = require("body-parser");
const chromeLauncher = require("chrome-launcher");
const bent = require("bent");
const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");
const { spawn } = require("child_process");
const { readFile, unlink } = require("fs").promises;
const path = require("path");
const os = require("os");

// Bring in the static environment variables
const API_PORT = parseInt(process.env.API_PORT) || 5011;
const WINDOW_SIZE_1 = process.env.WINDOW_SIZE_1 || "1280,800";
const WINDOW_POSITION_1 = process.env.WINDOW_POSITION_1 || "0,0";

const WINDOW_SIZE_2 = process.env.WINDOW_SIZE_2 || "1280,800";
const WINDOW_POSITION_2 = process.env.WINDOW_POSITION_2 || "2560,0";

const PERSISTENT_DATA = process.env.PERSISTENT || "0";
const REMOTE_DEBUG_PORT = process.env.REMOTE_DEBUG_PORT || 35173;
const FLAGS = process.env.FLAGS || null;
const EXTRA_FLAGS = process.env.EXTRA_FLAGS || null;
const HTTPS_REGEX = /^https?:\/\//i; //regex for HTTP/S prefix

// Environment variables which can be overriden from the API
let kioskMode = process.env.KIOSK || "0";
let enableGpu = process.env.ENABLE_GPU || "0";

let DEFAULT_FLAGS = [];
let currentUrl = "";
let flags = [];

// Refresh timer object
let timer = {};

// Returns the URL to display, adhering to the hieracrchy:
// 1) the configured LAUNCH_URL
// 2) a discovered HTTP service on the device
// 3) the default static HTML
async function getUrlToDisplayAsync() {
  let launchUrl_1 = process.env.LAUNCH_URL_1 || null;
  let launchUrl_2 = process.env.LAUNCH_URL_2 || null;
  if (null !== launchUrl_1) {
    console.log(`Using LAUNCH_URL_1: ${launchUrl_1}`);

    // Prepend http:// if the LAUNCH_URL doesn't have it.
    // This is needed for the --app flag to be used for kiosk mode
    if (!HTTPS_REGEX.test(launchUrl_1)) {
      launchUrl_1 = `http://${launchUrl_1}`;
    }
    if (!launchUrl_2) {
      launchUrl_2 = "http://google.com"; // Placeholder
    }

    return [launchUrl_1, launchUrl_2];
  }

  console.log("LAUNCH_URL_1 environment variable not set.");
  console.log("Looking for local HTTP/S services.");

  // make a HTTP/S request for each supported port to the localhost
  // add the URL to the array if HTTP200 is returned
  let ports = [80, 443, 8080];
  let returnURL = null;
  let urls = [];
  for await (const port of ports) {
    const protocol = 443 === port ? `https` : `http`;
    const url = `${protocol}://localhost:${port}`;
    try {
      const request = bent(url);
      const response = await request();
      console.log(`Trying local port ${port}`);
      if (200 == response.statusCode) {
        console.log("HTTP/S service found at: " + url);
        urls.push(url);
      }
    } catch (e) {
      //Nothing to do here, failure is expected when nothing
      //is listening on a port
      console.log(`No service found on port ${port}`);
    }
  }

  if (urls.length > 0) {
    // return the first URL that returned 200
    returnURL = urls[0];
  }
  // Otherwise send the default HTML
  else {
    console.log("Displaying default HTML page");
    returnURL = "file:///home/chromium/index.html";
  }

  return returnURL;
}

let launchBrowsers = async function (url1, url2) {
  await chromeLauncher.killAll();

  // Common flags plus specific window size and position for each browser
  let commonFlags = [
    "--autoplay-policy=no-user-gesture-required",
    "--noerrdialogs",
    "--disable-session-crashed-bubble",
    "--check-for-update-interval=31536000",
    "--disable-dev-shm-usage",
    enableGpu != "1" ? "--disable-gpu" : "--enable-gpu-rasterization",
    `--disable-pinch`,
  ].concat(EXTRA_FLAGS ? EXTRA_FLAGS.split(" ") : []);

  // Flags for the first browser
  let flags1 = [
    `--window-size=${WINDOW_SIZE_1}`,
    `--window-position=${WINDOW_POSITION_1}`,
  ].concat(commonFlags);

  // Flags for the second browser
  let flags2 = [
    `--window-size=${WINDOW_SIZE_2}`,
    `--window-position=${WINDOW_POSITION_2}`,
  ].concat(commonFlags);

  // Launching the first browser
  await chromeLauncher.launch({
    startingUrl: kioskMode === "1" ? `--app=${url1}` : url1,
    ignoreDefaultFlags: true,
    chromeFlags: flags1,
    port: REMOTE_DEBUG_PORT,
    userDataDir: "/chromium/browser1",
  });

  //Launching the second browser
  await chromeLauncher.launch({
    startingUrl: kioskMode === "1" ? `--app=${url2}` : url2,
    ignoreDefaultFlags: true,
    chromeFlags: flags2,
    port: REMOTE_DEBUG_PORT + 1, // Adjust port to avoid conflict
    userDataDir: "/chromium/browser2",
  });

  console.log(`Launched browsers with URLs: ${url1}, ${url2}`);
};

// Get's the chrome-launcher default flags, minus the extensions and audio muting flags.
async function SetDefaultFlags() {
  DEFAULT_FLAGS = await chromeLauncher.Launcher.defaultFlags().filter(
    (flag) => "--disable-extensions" !== flag && "--mute-audio" !== flag
  );
}

async function setTimer(interval) {
  timer = setIntervalAsync(async () => {
    try {
      await launchChromium(currentUrl);
    } catch (err) {
      console.log("Timer error: ", err);
      process.exit(1);
    }
  }, interval);
}

async function clearTimer() {
  await clearIntervalAsync(timer);
}

async function main() {
  await SetDefaultFlags();
  const [url1, url2] = await getUrlToDisplayAsync();
  await launchBrowsers(url1, url2);
}

main().catch((err) => {
  console.log("Main error: ", err);
  process.exit(1);
});

// Start the API
const app = express();

const errorHandler = (err, req, res, next) => {
  res.status(500);
  res.render("API error: ", {
    error: err,
  });
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(errorHandler);

// ping endpoint
app.get("/ping", (req, res) => {
  return res.status(200).send("ok");
});

// url set endpoint
app.post("/url", (req, res) => {
  if (!req.body.url) {
    return res.status(400).send("Bad request: missing URL in the body element");
  }

  let url = req.body.url;

  // prepend http prefix if necessary for kiosk mode to work
  if (!HTTPS_REGEX.test(url)) {
    url = "http://" + url;
  }

  if (req.body.kiosk) {
    kioskMode = req.body.kiosk;
  }

  if (req.body.gpu) {
    enableGpu = req.body.gpu;
  }

  launchChromium(url);
  return res.status(200).send("ok");
});

// url get endpoint
app.get("/url", (req, res) => {
  return res.status(200).send(currentUrl);
});

// refresh endpoint
app.post("/refresh", (req, res) => {
  launchChromium(currentUrl);
  return res.status(200).send("ok");
});

// gpu set endpoint
app.post("/gpu/:gpu", (req, res) => {
  if (!req.params.gpu) {
    return res.status(400).send("Bad Request");
  }

  if ("1" !== req.params.gpu && "0" !== req.params.gpu) {
    return res.status(400).send("Bad Request");
  }

  enableGpu = req.params.gpu;
  launchChromium(currentUrl);
  return res.status(200).send("ok");
});
// gpu get endpoint
app.get("/gpu", (req, res) => {
  return res.status(200).send(enableGpu.toString());
});

// kiosk set endpoint
app.post("/kiosk/:kiosk", (req, res) => {
  if (!req.params.kiosk) {
    return res.status(400).send("Bad Request");
  }

  kioskMode = req.params.kiosk;
  launchChromium(currentUrl);
  return res.status(200).send("ok");
});

app.post("/autorefresh/:interval", async (req, res) => {
  if (!req.params.interval) {
    return res.status(400).send("Bad Request");
  }

  if (req.params.interval < 1) {
    await clearTimer();
  } else {
    await setTimer(req.params.interval * 1000);
  }

  return res.status(200).send("ok");
});

// flags endpoint
app.get("/flags", (req, res) => {
  return res.status(200).send(flags.toString());
});

// kiosk get endpoint
app.get("/kiosk", (req, res) => {
  return res.status(200).send(kioskMode.toString());
});

// version get endpoint
app.get("/version", (req, res) => {
  let version = process.env.VERSION || "Version not set";
  return res.status(200).send(version.toString());
});

app.get("/screenshot", async (req, res) => {
  const fileName = process.hrtime.bigint() + ".png";
  const filePath = path.join(os.tmpdir(), fileName);
  try {
    const child = spawn("scrot", [filePath]);

    const statusCode = await new Promise((res, rej) => {
      child.on("close", res);
    });
    if (statusCode != 0) {
      return res
        .status(500)
        .send("Screenshot command exited with non-zero return code.");
    }

    const fileContents = await readFile(filePath);
    res.set("Content-Type", "image/png");
    return res.status(200).send(fileContents);
  } catch (e) {
    console.log(e.toString());
    return res.status(500).send("Error occurred in screenshot code.");
  } finally {
    try {
      await unlink(filePath);
    } catch (e) {
      console.log(e);
    }
  }
});

// scan endpoint - causes the device to rescan for local HTTP services
app.post("/scan", (req, res) => {
  main().catch((err) => {
    console.log("Scan error: ", err);
    process.exit(1);
  });
  return res.status(200).send("ok");
});

app.listen(API_PORT, () => {
  console.log("Browser API running on port: " + API_PORT);
});

process.on("SIGINT", () => {
  process.exit();
});
