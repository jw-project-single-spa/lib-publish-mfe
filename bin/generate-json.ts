import { firestore } from "firebase-admin";
import { MfeResponse } from "./types";
import fs from "fs";

export async function generateJson() {
  const db = firestore()
    .collection("mfes")
    .withConverter({
      toFirestore: (data: MfeResponse) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as MfeResponse,
    });
  const data = await db.get();

  // create bundle folder
  fs.mkdir("bundle", { recursive: true }, (errMkdir) => {
    if (errMkdir) {
      throw errMkdir;
    }
  });

  // create systemjs file
  const resultImports: Record<string, string> = {};
  data.forEach((l) => {
    const { name, url, hash } = l.data();
    resultImports[`@jw-project/${name}`] = `${url}?${hash}`;
  });

  fs.writeFileSync(
    "bundle/systemjs.json",
    JSON.stringify({ imports: resultImports })
  );
  console.log("JSON systemjs is saved");

  // create application file
  const application = data.docs.map((mfe) => ({
    ...mfe.data(),
    name: `@jw-project/${mfe.data().name}`,
    url: `${mfe.data().url}?${mfe.data().hash}`,
  }));

  fs.writeFileSync("bundle/application.json", JSON.stringify(application));
  console.log("JSON application is saved");
}
