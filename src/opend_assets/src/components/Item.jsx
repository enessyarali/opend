import React, { useEffect, useState } from "react";
import { Actor , HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft/nft.did.js";
import { Principal } from "@dfinity/principal";
import Button from "./Button.jsx";
import { opend } from "../../../declarations/opend/index.js";

function Item(props) {

  const [name ,setName] = useState();
  const [owner , setOwner]  = useState();
  const [image , setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput,setPriceInput] = useState();

  const id = props.id
  const localHost = "http://localhost:8080"; //
  const agent = new HttpAgent({host : localHost}) ; 
  agent.fetchRootKey() //This line is local development only.Remove the line incase of Live deployment on IC Network

  let NFTActor;
  async function loadNFT(){ 
     NFTActor = await Actor.createActor(idlFactory, { 
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
    setButton(<Button handleClick={handlesell} text={"Sell"}/>)
  };

  useEffect(() => {
     loadNFT();
  }, [])
  let price;
  function handlesell(){
    console.log("sell clicked");
      setPriceInput(
        <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) =>price = e.target.value}
      />
      )
      setButton(<Button handleClick={sellItem} text={"Confirm"}/>)
  }

    async function sellItem(){
        console.log("Confirm Clicked");

      const listingResult =   await opend.listItem(props.id , Number(price))
      console.log(listingResult);
      if(listingResult == "Success"){
        const OpenDId = await opend.getOpenDCanisterID();
        const transferResult = await NFTActor.transferOwnership(OpenDId)
        console.log("transfer:" + transferResult);
        console.log(OpenDId);
      }
    }
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
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
