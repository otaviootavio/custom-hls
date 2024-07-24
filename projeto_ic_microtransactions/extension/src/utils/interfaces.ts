interface HashObject {
  address_contract: string;
  address_to: string;
  length: number;
  hashchain: string[];
  isValid: boolean;
  key: string;
  tail: string;
}

export type { HashObject };
