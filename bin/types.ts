export type MfePayload = {
  mfeName: string;
  destinationFolder: string;
  fileName: string;
  activeWhen: string;
  exact: boolean;
  isParcel: boolean;
};

export type MfeResponse = {
  name: string;
  url: string;
  activeWhen: string;
  exact: boolean;
  isParcel: boolean;
  hash: number;
};
