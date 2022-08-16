#!/usr/bin/env node
import yargs from "yargs/yargs";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import axios from "axios";

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
    return error("faltam pametros");
  }

  const url = "https://ufuubufsowyauanuzbii.supabase.co";

  const supabase = createClient(url, supabaseAuth);

  await supabase.storage.from("bundle").remove([fileName]);

  const { data, error: errorStorage } = await supabase.storage
    .from("bundle")
    .upload(fileName, await fs.promises.readFile(fileAddress));
  console.log(data, errorStorage);
  if (errorStorage) {
    return error(errorStorage);
  }
  console.log("upload to supabase: ", data);

  const { error: errorUpsert } = await supabase.from("mfe").upsert(
    {
      name: mfeName,
      url: `${url}/storage/v1/object/public/${data?.Key}`,
      activeWhen,
      exact,
      isParcel,
    },
    { onConflict: "name" }
  );

  if (errorUpsert) {
    return error(errorUpsert);
  }
}

run();
