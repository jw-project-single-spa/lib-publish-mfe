#!/usr/bin/env node
import yargs from "yargs/yargs";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import axios from "axios";

async function run() {
  const {
    activeWhen,
    exact,
    isParcel,
    fileName,
    fileAddress,
    mfeName,
    supabaseAuth,
  } = await yargs(process.argv).options({
    activeWhen: { type: "string" },
    exact: { type: "boolean" },
    isParcel: { type: "boolean" },
    fileName: { type: "string" },
    fileAddress: { type: "string" },
    mfeName: { type: "string" },
    supabaseAuth: { type: "string" },
  }).argv;

  if (!fileName || !fileAddress || !mfeName || !supabaseAuth) {
    console.error("faltam pametros");
    process.exit(1);
  }

  const url = "https://ufuubufsowyauanuzbii.supabase.co";

  const supabase = createClient(url, supabaseAuth);

  await supabase.storage.from("bundle").remove([fileName]);

  const { data, error } = await supabase.storage
    .from("bundle")
    .upload(fileName, await fs.promises.readFile(fileAddress));
  console.log(data, error);

  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log("upload to supabase: ", data);

  try {
    await axios.post("https://jw-service-list-mfe.herokuapp.com/", {
      name: mfeName,
      url: `${url}/storage/v1/object/public/${data?.Key}`,
      activeWhen,
      exact,
      isParcel,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
