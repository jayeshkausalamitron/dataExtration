require("dotenv").config();
const schedule = require("node-schedule");
const uploadFileToS3 = require("./utils/uploadToS3");
const { getFileNamesFromFolder, getFileNamesNotInBucket } = require("./utils/fileOperations");

// running a task every one minute
let scheduletime = "*/1 * * * *";

// Define folder path
const folderPath = "./data/";

// Define S3 bucket name
const bucketName = process.env.BUCKETNAME;

// Main function to upload files from the folder to S3
async function uploadFilesToS3() {
  console.log("Starting upload process...");
  const fileNames = getFileNamesFromFolder(folderPath);
  console.log("File names in the folder:", fileNames);

  try {
    const nonMatchingFileNames = await getFileNamesNotInBucket(bucketName, fileNames);
    console.log("Files not present in the bucket:", nonMatchingFileNames);
    for (const fileName of nonMatchingFileNames) {
      await uploadFileToS3(fileName, folderPath, bucketName);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Schedule job to run the upload process every minute
const job = schedule.scheduleJob(scheduletime, function () {
  console.log("Upload job initiated.");
  uploadFilesToS3();
});