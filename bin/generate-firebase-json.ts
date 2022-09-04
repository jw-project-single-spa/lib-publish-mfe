import fs from "fs";

export async function generateFirebaseJson() {
  const firebaseConfig = {
    hosting: {
      target: "static",
      public: "bundle",
      ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
      headers: [
        {
          source: "**/*.@(js|json)",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*",
            },
          ],
        },
      ],
    },
  };

  fs.writeFileSync("firebase.json", JSON.stringify(firebaseConfig));
  console.log("Firebase config JSON is saved");
}
