import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft.mo";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";


actor OpenD {

    public shared(msg) func mint(imageData : [Nat8] , name : Text) : async Principal {
        let owner : Principal = msg.caller

        Debug.print(debug_show(Cycles.balance()))
        Cycles.add(100_500_000_000); //Adding experimental cycles to launch on the network
        let newNFT = await NFTActorClass.NFT(name ,owner ,imageData)
        Debug.print(debug_show(Cycles.balance()))

        let newNFTPrincipal = await newNFT.getCanisterId();

        return newNFTPrincipal;

    }
 
};
