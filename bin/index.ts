#!/usr/bin/env node
import yargs from "yargs/yargs";
import path from "path";
import { error } from "./error-util";
import { authFirebase } from "./auth-firebase";
import { upload } from "./upload";
import { registerDb } from "./register-db";
import { download } from "./download";
import { generateImportmapJson } from "./generate-importmap-json";
import { generateFirebaseJson } from "./generate-firebase-json";

async function run() {
  const {
    activeWhen,
    exact,
    isParcel,
    fileName,
    folderAddress,
    mfeName,
    firebaseAuth,
  } = await yargs(process.argv).options({
    activeWhen: { type: "string", default: "/" },
    exact: { type: "boolean", default: false },
    isParcel: { type: "boolean", default: false },
    fileName: { type: "string" },
    folderAddress: { type: "string", default: "dist" },
    mfeName: { type: "string" },
    firebaseAuth: { type: "string" },
  }).argv;

  if (!fileName || !folderAddress || !mfeName || !firebaseAuth) {
    return error("Faltam parâmetros");
  }

  try {
    // -----
    // auth
    authFirebase(firebaseAuth);
    console.info("---");

    // -----
    // upload mfe bundle to store
    const destinationFolder = path.parse(fileName).name;
    await upload(folderAddress, destinationFolder);
    console.info("---");

    // -----
    // register mfe on db
    await registerDb({
      mfeName,
      activeWhen,
      destinationFolder,
      exact,
      fileName,
      isParcel,
    });
    console.info("---");

    // -----
    // download all bundles from store
    await download();
    console.info("---");

    // -----
    // get db data and generate import map json files
    await generateImportmapJson();
    console.info("---");

    // -----
    // generate firebase.json
    await generateFirebaseJson();
    console.info("---\nlib-publish-mfe sucess finished");
  } catch (errorRun) {
    error(errorRun);
  }
}

run();
