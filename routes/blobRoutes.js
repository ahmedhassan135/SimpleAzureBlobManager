const express = require("express");
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
const passport = require("../config/passportConfig");

const router = express.Router();
require("dotenv").config();

router.use(express.urlencoded({ extended: true }));

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_CONNECTION_STRING
);

router.post(
  "/create-blob/:containerName/",
  checkAuthenticated,
  async (req, res) => {
    try {
      if (
        Object.keys(req.body).length === 0 ||
        Object.keys(req.body.BlobName).length === 0
      ) {
        return res.status(400).json({ Error: "Blob Name cannot be empty" });
      }

      const containerClient = blobServiceClient.getContainerClient(
        req.params.containerName
      );

      //TODO: Frequently repeated code. Move this to a utility method
      const containerExists = await containerClient.exists();
      if (!containerExists) {
        return res
          .status(404)
          .json({ Error: "The specified container does not exist" });
      }

      // Uploading a blob to the container (Random file with some text)
      const blobClient = containerClient.getBlockBlobClient(req.body.BlobName);
      await blobClient.upload("Hello, Azure!", 12);

      res
        .status(200)
        .json({ Message: "The blob has been created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ Error: "Error Creating blob" });
    }
  }
);

router.put(
  "/edit-blob/:containerName/:blobName",
  checkAuthenticated,
  async (req, res) => {
    try {
      if (
        Object.keys(req.body).length === 0 ||
        Object.keys(req.body.AccessTier).length === 0
      ) {
        return res.status(400).json({ Error: "Access tier must not be empty" });
      }

      const blobName = req.params.blobName;
      const containerClient = blobServiceClient.getContainerClient(
        req.params.containerName
      );

      const containerExists = await containerClient.exists();
      if (!containerExists) {
        return res
          .status(404)
          .json({ Error: "The specified container does not exist" });
      }

      const blobClient = containerClient.getBlockBlobClient(blobName);

      await blobClient.setAccessTier(req.body.AccessTier);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: "Error editing blob" });
    }

    res
      .status(200)
      .json({ Success: "The Access Tier was updated successfully" });
  }
);

module.exports = router;
