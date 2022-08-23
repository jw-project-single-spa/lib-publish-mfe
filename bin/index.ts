#!/usr/bin/env node
import yargs from "yargs/yargs";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { firestore } from "firebase-admin";

function error(e: unknown) {
  console.error(e);
  process.exit(1);
}

async function run() {
  const {
    activeWhen,
    exact,
    isParcel,
    fileName,
    fileAddress,
    mfeName,
    firebaseAuth,
  } = await yargs(process.argv).options({
    activeWhen: { type: "string", default: "/" },
    exact: { type: "boolean", default: false },
    isParcel: { type: "boolean", default: false },
    fileName: { type: "string" },
    fileAddress: { type: "string" },
    mfeName: { type: "string" },
    firebaseAuth: { type: "string" },
  }).argv;

  if (!fileName || !fileAddress || !mfeName || !firebaseAuth) {
    return error("Faltam parâmetros");
  }

  // -----
  // auth
  let buff = Buffer.from(firebaseAuth, "base64");
  let text = buff.toString("ascii");
  initializeApp({
    credential: cert(JSON.parse(text)),
    databaseURL: "https://jw-project-58cb8-default-rtdb.firebaseio.com",
    storageBucket: "gs://jw-project-58cb8.appspot.com",
  });

  // -----
  // upload mfe bundle to store
  const f = await getStorage()
    .bucket()
    .upload(fileAddress, {
      destination: `bundle/${fileName}`,
      public: true,
    });
  const [url] = await f[0].getSignedUrl({
    action: "read",
    expires: "2100-01-01",
  });
  console.info("Upload do bundle em:", url);

  // -----
  // register mfe on db
  try {
    const db = firestore().collection("mfes");

    // procura se mfe já existe
    const mfeExist = await db.where("name", "==", mfeName).get();
    const body = {
      name: mfeName,
      url,
      activeWhen,
      exact,
      isParcel,
    };
    let save: firestore.WriteResult;

    if (!mfeExist.empty) {
      // se existe - atualiza
      save = await mfeExist.docs[0].ref.update(body);
    } else {
      // se não - cria novo
      save = await db.doc().set(body);
    }
    console.info("---\nMFE registrado");
  } catch (errorDB) {
    error(errorDB);
  }
}

run();
