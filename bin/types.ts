export type MfePayload = {
  mfeName: string;
  destinationFolder: string;
  fileName: string;
  activeWhen: string;
  exact: boolean;
  isParcel: boolean;
  isStructural: boolean;
};

export type MfeResponse = {
  name: string;
  url: string;
  activeWhen: string;
  exact: boolean;
  isParcel: boolean;
  isStructural: boolean;
  hash: number;
};
