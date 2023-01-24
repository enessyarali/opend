import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor , HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft/nft.did.js";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const [name ,setName] = useState();
  const [owner , setOwner]  = useState();
  const [image , setImage] = useState();

  const id = Principal.fromText(props.id);
  const localHost = "http://localhost:8000/"; //
  const agent = new HttpAgent({host : localHost}) ; 

  async function loadNFT(){ 
    const NFTActor = await Actor.createActor(idlFactory, { 
      agent,                                                
      canisterId: id, 
    });

    const username =  await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imagecontent = new Uint8Array(imageData);  //Converting 8bit image data into png 
    const image = URL.createObjectURL(
      new Blob([imagecontent.buffer], {type : "image/png"})
      );

    setName(username);
    setOwner(owner.toText()); //Owner data comes in form of principle we have to convert it to text
    setImage(image);
  };

  useEffect(() => {
     loadNFT();
  }, [])

  return ( 
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
