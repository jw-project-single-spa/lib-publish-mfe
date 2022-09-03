import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

export async function download() {
  const [files] = await getStorage()
    .bucket()
    .getFiles({ autoPaginate: false, prefix: `bundle` });
  for (const fileToDownload of files) {
    fs.mkdir(
      path.parse(fileToDownload.name).dir,
      { recursive: true },
      (errMkdir) => {
        if (errMkdir) {
          throw errMkdir;
        }
      }
    );
    await fileToDownload.download({ destination: fileToDownload.name });
    console.info("File downloaded:", fileToDownload.name);
  }
}
