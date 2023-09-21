const express = require("express");
const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");

const router = express.Router();
require("dotenv").config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_CONNECTION_STRING
);

router.get("/create-blob/:containerName/:blobName", async (req, res) => {
  try {
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

    // Uploading a blob to the container
    const blobClient = containerClient.getBlockBlobClient(req.params.blobName);
    await blobClient.upload("Hello, Azure!", 12);

    res.status(200).json({ Message: "The blob has been created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ Error: "Error Creating blob" });
  }
});

router.get("/edit-blob/:containerName/:blobName", async (req, res) => {
  try {
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

    //TODO: A user request must define what the access tier should be
    await blobClient.setAccessTier("Cool");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error editing blob");
  }
});

module.exports = router;
