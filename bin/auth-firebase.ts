import { initializeApp, cert } from "firebase-admin/app";

export function authFirebase(firebaseAuth: string) {
  let buff = Buffer.from(firebaseAuth, "base64");
  let text = buff.toString("ascii");
  initializeApp({
    credential: cert(JSON.parse(text)),
    databaseURL: "https://jw-project-58cb8-default-rtdb.firebaseio.com",
    storageBucket: "gs://jw-project-58cb8.appspot.com",
  });
  console.info("Firebase connected");
}
