require("dotenv").config();
const Asana = require("asana");

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-hub-signature-256"];

  const payload = JSON.stringify(req.body);

  if (verifySignature(payload, signature)) {
    if (req.body.action === "opened") {
      const issue = req.body.issue;
      if (issue) {
        createAsanaTask(issue);
      }
    }
    res.status(200).send("OK");
  } else {
    res.status(401).send("Signature verification failed");
  }
});

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac("sha256", process.env.GITHUB_SECRET);

  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function createAsanaTask(issue) {
  const data = {
    gid: issue.url,
    name: issue.title,
    notes: issue.body,
    projects: [process.env.ASANA_PROJECT_ID],
    workspace: process.env.ASANA_WORKSPACE_ID,
    external: {
      data: issue.html_url,
    },
    assignee: "me",
  };

  let client = Asana.ApiClient.instance;
  let token = client.authentications["token"];
  token.accessToken = process.env.ASANA_ACCESS_TOKEN;

  let tasksApiInstance = new Asana.TasksApi();
  let body = { data };
  let opts = {
    opt_fields:
      "name,assignee,workspace",
  };
  tasksApiInstance.createTask(body, opts).then(
    (result) => {
      
      console.log("API called successfully.",result);
    },
    (error) => {
      console.error(error.response.body, data);
    }
  );
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
