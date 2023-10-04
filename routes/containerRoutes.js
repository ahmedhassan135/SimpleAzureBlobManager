const express = require("express");
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
const passport = require("../config/passportConfig");
const { checkAuthenticated } = require("../Util/ServerUtil");

const router = express.Router();
require("dotenv").config();

router.use(express.urlencoded({ extended: true }));

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_CONNECTION_STRING
);

router.get("/list-containers" /*, checkAuthenticated*/, async (req, res) => {
  try {
    const containerNames = [];
    for await (const container of blobServiceClient.listContainers()) {
      containerNames.push(container.name);
    }
    res.status(200).json({ Containers: containerNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Error listing containers" });
  }
});

router.post("/create-container" /*, checkAuthenticated*/, async (req, res) => {
  try {
    if (
      Object.keys(req.body).length === 0 ||
      Object.keys(req.body.ContainerName).length === 0
    ) {
      console.log("here");
      return res.status(400).json({ Error: "Container Name cannot be empty" });
    }

    //Creating a container
    const containerClient = blobServiceClient.getContainerClient(
      req.body.ContainerName
    );
    await containerClient.createIfNotExists();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file to Azure Storage");
  }
  res.status(200).json({ Message: "Container created successfully" });
});

router.get(
  "/:containerName/list-blobs",
  //checkAuthenticated,
  async (req, res) => {
    let blobInfo = [];
    const containerClient = blobServiceClient.getContainerClient(
      req.params.containerName
    );
    const containerExists = await containerClient.exists();
    if (!containerExists) {
      return res
        .status(404)
        .json({ Error: "The specified container does not exist" });
    }

    for await (const blobItem of containerClient.listBlobsFlat()) {
      blobInfo.push({
        name: blobItem.name,
        accessTier: blobItem.properties.accessTier,
      });
    }

    res.json({ Blobs: blobInfo });
  }
);

module.exports = router;
