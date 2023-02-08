import Principal "mo:base/Principal";
import NFTActorClass "../nft/nft";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import NFTActorClass "../nft/nft";
import List "mo:base/List"


actor OpenD {

    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1,Principal.equal, Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1,Principal.equal, Principal.hash)
    public shared(msg) func mint(imageData : [Nat8] , name : Text) : async Principal {

        let owner : Principal = msg.caller;

        Debug.print(debug_show(Cycles.balance()));
        Cycles.add(100_500_000_000); //Adding experimental cycles to launch on the network
        let newNFT = await NFTActorClass.NFT(name ,owner ,imageData);
        Debug.print(debug_show(Cycles.balance()));

        let newNFTPrincipal = await newNFT.getCanisterId();
        mapOfNFTs.put(newNFTPrincipal , newNFT)
        addToOwnershipMap(owner, newNFTPrincipal)

        return newNFTPrincipal;

    }

    private func addToOwnershipMap(owner : Principal , nftId : Principal){
        var ownedNFTs : List.List<Principal> = switch(mapOfOwners.get(owner)) {
            case(null){ return List.nil<Principal>()  };
            case(?result) { return result }; //Safest way to deal with options so far 
        };

        ownedNFTs := ownedNFTs.push(nftId, ownedNFTs);
        mapOfOwners.put(owner, ownedNFTs);
    };

    public query func getOwnedNFTs(user : Principal) : async [Principal]{
           var userNFTs : List.List<Principal> = switch(mapOfOwners.get(owner)) {
            case(null){ return List.nil<Principal>()  };
            case(?result) { return result }; 
        };
        return List.toArray(userNFTs);
    };
 
};
