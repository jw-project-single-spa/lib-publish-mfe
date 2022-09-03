import { firestore } from "firebase-admin";
import { MfePayload } from "./types";

export async function registerDb({
  mfeName,
  destinationFolder,
  fileName,
  activeWhen,
  exact,
  isParcel,
}: MfePayload) {
  const db = firestore().collection("mfes");

  // procura se mfe já existe
  const mfeExist = await db.where("name", "==", mfeName).get();
  const body = {
    name: mfeName,
    url: `${destinationFolder}/${fileName}`,
    activeWhen,
    exact,
    isParcel,
    hash: new Date().getTime(),
  };
  let save: firestore.WriteResult;

  if (!mfeExist.empty) {
    // se existe - atualiza
    save = await mfeExist.docs[0].ref.update(body);
  } else {
    // se não - cria novo
    save = await db.doc().set(body);
  }
  console.info("MFE registrado");
}
