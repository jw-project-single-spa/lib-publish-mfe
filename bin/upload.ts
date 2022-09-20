import fs from "fs";
import path from "path";
import { getStorage } from "firebase-admin/storage";

export async function upload(folderAddress: string, destinationFolder: string) {
  const listFiles = fs
    .readdirSync(folderAddress)
    .filter(
      (file) => !fs.statSync(path.join(folderAddress, file)).isDirectory()
    )
    .filter((f) => !f.includes(".ts"));

  for (const fileIter of listFiles) {
    await getStorage()
      .bucket()
      .upload(`${folderAddress}/${fileIter}`, {
        destination: `bundle/${destinationFolder}/${fileIter}`,
      });
    console.info("File uploaded:", fileIter);
  }
}
