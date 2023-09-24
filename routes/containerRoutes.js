const express = require("express");
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
const passport = require("../config/passportConfig");

const router = express.Router();
require("dotenv").config();

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_CONNECTION_STRING
);

router.get("/list-containers", checkAuthenticated, async (req, res) => {
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

router.get(
  "/create-container/:containerName",
  checkAuthenticated,
  async (req, res) => {
    try {
      // Create a container
      const containerClient = blobServiceClient.getContainerClient(
        req.params.containerName
      );
      await containerClient.createIfNotExists();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file to Azure Storage");
    }
    res.status(200).json({ Message: "Container created successfully" });
  }
);

router.get(
  "/:containerName/list-blobs",
  checkAuthenticated,
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

    res.json({ blobs: blobInfo });
  }
);

module.exports = router;
