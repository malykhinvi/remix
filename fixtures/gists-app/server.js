const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { createRequestHandler } = require("@remix-run/express");

const port = process.env.PORT || 3000;

let app = express();

app.use(compression());

app.use(
  express.static("public", {
    // maxAge: process.env.NODE_ENV === "production" ? "1y" : undefined
    maxAge: "1y"
  })
);

// let static = express.static("public", {
//   // maxAge: process.env.NODE_ENV === "production" ? "1y" : undefined
//   maxAge: "1y"
// });
// app.use((req, res, next) => {
//   if (req.url.startsWith("/build/")) {
//     console.log("SLOW", req.url)
//     setTimeout(() => {
//       static(req, res, next);
//     }, 5000);
//   } else {
//     static(req, res, next);
//   }
// });

app.get("/fails.css", (req, res) => {
  res.status(500).send("Boom! No CSS here!");
});

// server-side redirect
app.get("/user-gists/:username", (req, res) => {
  res.redirect(301, `/gists/${req.params.username}`);
});

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.all(
  "*",
  createRequestHandler({
    build: require("./build"),
    getLoadContext(_, res) {
      return { userId: 4, expressResponse: res };
    }
  })
);

app.listen(port, () => {
  console.log(`Gists app running on port ${port}`);
});
