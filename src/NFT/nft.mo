import Debug "mo:base/Debug";
import Principal "mo:base/Principal"

actor class NFT (name: Text , owner : Principal , content: [Nat8]) = this {

    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

    public query func getName() : async Text { 
        return itemName;
    };
    public query func getOwner() : async Principal {
        return nftOwner;
    };
    public query func getAsset() : async [Nat8] {
        return imageBytes;
    };
    
    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this) ;
        // this keyword up and here is used for to get the CanisterId of the NFT.If this was just a class 
        // we could have directly written NFT as input and it would give the canisterId but since this is a actor 
        //class it needs all the inputs  by using "this" we bind all of it.
     };

    public shared(msg) func trasferOwnership(newOwner : Principal) : async Text{
        if(msg.caller == nftOwner){
            nftOwner := newOwner;
            return "Success";
        }else{
            return "Error: Not initiated by NFT owner."
        };
    };

};