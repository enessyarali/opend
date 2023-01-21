import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getAsset' : () => Promise<Array<number>>,
  'getName' : () => Promise<string>,
  'getnftOwner' : () => Promise<Principal>,
}
export interface _SERVICE extends NFT {}
