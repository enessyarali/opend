import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor , HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft/nft.did.js";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const [name ,setName] = useState();
  const id = Principal.fromText(props.id);
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({host : localHost}) ; 

  async function loadNFT(){ 
    const NFTActor = await Actor.createActor(idlFactory, { //Getting errors on dev console . There is an issue with the id 
      agent,                                                //that I use here and the canisters actual ID.
      canisterId: id, 
    });

    const username =  await NFTActor.getName();
    setName(username);
  };

  useEffect(() => {
     loadNFT();
  }, [])

  return ( 
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={logo}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: sdfsdf-erwerv-sdf
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
