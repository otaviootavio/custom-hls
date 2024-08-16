export interface HashObject {
  address_contract: string;
  address_to: string;
  length: number;
  hashchain: `0x${string}`[];
  isValid: boolean;
  key: string;
  tail: `0x${string}`;
  secret: string;
  indexOfLastHashSend: number;
}
