#!/usr/bin/env node
import yargs from "yargs/yargs";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

async function run() {
  const { file } = await yargs(process.argv).options({
    file: { type: "array" },
  }).argv;

  console.log(file);

  const supabase = createClient(
    "https://ufuubufsowyauanuzbii.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdXVidWZzb3d5YXVhbnV6YmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTg4MDAwNjcsImV4cCI6MTk3NDM3NjA2N30.Ox5NWDZYy0ssP11hl634vZ4Sdt28caZSz42LjsbydJk"
  );

  const { data, error } = await supabase.storage
    .from("public")
    .upload("index.js", await fs.promises.readFile("dist/index.js"));

  console.log(data, error);
}

run();
