export interface Medicine {
  id: string;
  name: string;
  time: string;
  repeatInterval: number;
  maxRepeats: number;
  snoozeTime: number;
  taken: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  AddMedicine: undefined;
};


