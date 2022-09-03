import fs from "fs";
import { getStorage } from "firebase-admin/storage";

export async function upload(folderAddress: string, destinationFolder: string) {
  for (const fileIter of fs.readdirSync(folderAddress)) {
    const f = await getStorage()
      .bucket()
      .upload(`${folderAddress}/${fileIter}`, {
        destination: `bundle/${destinationFolder}/${fileIter}`,
      });
    console.info("File uploaded:", fileIter);
  }
}
