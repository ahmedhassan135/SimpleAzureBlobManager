const express = require("express");
const cors = require("cors");
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const containerRouter = require("./routes/containerRoutes");
const blobRouter = require("./routes/blobRoutes");

app.use("/container", containerRouter);
app.use("/blob", blobRouter);

app.get("/", (req, res) => {
  console.log();
  res.send("Hello, Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
