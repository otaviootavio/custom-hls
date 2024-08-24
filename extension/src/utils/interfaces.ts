export interface HashObject {
  chainId: number;
  address_contract: string;
  address_to: string;
  length: number;
  amountInEth: string;
  hashchain: `0x${string}`[];
  isValid: boolean;
  key: string;
  tail: `0x${string}`;
  secret: string;
  indexOfLastHashSend: number;
}
