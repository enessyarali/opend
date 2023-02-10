import React, { useEffect, useState } from "react";
import { Actor , HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft/nft.did.js";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token/token.did.js";
import { Principal } from "@dfinity/principal";
import Button from "./Button.jsx";
import { opend } from "../../../declarations/opend/index.js";
import CURRENT_USER_ID from "../index.jsx";
import PriceLabel from "./PriceLabel.jsx";
import { token } from "../../../declarations/token/index.js";

function Item(props) {

  const [name ,setName] = useState();
  const [owner , setOwner]  = useState();
  const [image , setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput,setPriceInput] = useState();
  const [loaderHidden , setLoaderHidden] = useState(true)
  const [blur, setBlur] = useState();
  const [sellstatus , setSellStatus] = useState("");
  const [priceLabel ,setPriceLabel] = useState()

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

    if(props.role == "collection"){
    const nftIsListed = await opend.isListed(id);

    if(nftIsListed){
      setOwner("OpenD")
      setBlur({filter : "blur(4px)"});
      setSellStatus("Listed");
    }else{
      setButton(<Button handleClick={handlesell} text={"Sell"}/>)
      }
    }else if(props.role == "discover"){
      const originalOwner =  await opend.getOriginalOwner(props.id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
      setButton(<Button handleClick={handleBuy} text={"Buy"}/>)}
    }

    const price = await opend.getListedNFTPrice(id)
    setPriceLabel(<PriceLabel sellPrice={price.toString()} />)
    
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
      setBlur({filter : "blur(4px)"})
      console.log("Confirm Clicked");
      setLoaderHidden(false)
      const listingResult =   await opend.listItem(props.id , Number(price))
      console.log(listingResult);
      if(listingResult == "Success"){
        const OpenDId = await opend.getOpenDCanisterID();
        const transferResult = await NFTActor.transferOwnership(OpenDId)
        console.log("transfer:" + transferResult);
        console.log(OpenDId);
        if(transferResult == "Success"){
          setLoaderHidden(true);
          setButton();
          setPriceInput();
          setOwner("OpenD")
          setSellStatus("Listed")
        }
      }
    }

    async function handleBuy(){
      console.log("Buy clicked");
      const tokenActor = await Actor.createActor(tokenIdlFactory , {
        agent,
        cannisterId: Principal.fromText("renrk-eyaaa-aaaaa-aaada-cai") 
      })
      const sellerId = await opend.getOriginalOwner();
      const itemPrice = await opend.getListedNFTPrice();

      const result =  await token.transfer(sellerId , itemPrice);
      if(result == "Success"){
        const transferResult = await opend.completePurchase(id, sellerId , CURRENT_USER_ID)
        console.log("purchase :" + transferResult );
      }
    }
  return ( 
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
       {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellstatus}</span>
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
