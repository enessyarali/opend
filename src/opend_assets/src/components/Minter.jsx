import React, { useState } from "react";
import { useForm } from "../../../../node_modules/react-hook-form/dist/useForm";
import { opend } from "../../../declarations/opend/index";
import Item from "./Item";
function Minter() {

  const{register , handleSubmit} = useForm()
  const [nftPrincipal, setnftPrincipal] = useState("");
  const [loaderHidden , setloaderHidden] = useState(true);

  async function onSubmit(data) {
    // console.log(data.name);
    // console.log(data.image);

    const name  = data.name;
    const image = data.image[0]; //Its an arraay we need to get the first Item on the array.
    const imageArray =  await image.arrayBuffer();
    const imageByteData = [...new Uint8Array(imageArray)]; //Nat8 Image data processing

    const newNFTID = await opend.mint(imageByteData, name);
    setnftPrincipal(newNFTID);
  }

  if(nftPrincipal == "" ){
  return (
    <div className="minter-container">
    <div className="lds-ellipsis">
        <div hidden={loaderHidden}></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Create NFT
      </h3>
      <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
        Upload Image
      </h6>
      <form className="makeStyles-form-109" noValidate="" autoComplete="off">
        <div className="upload-container">
          <input
            {...register("image", {reqired : true})}
            className="upload"
            type="file"
            accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
          />
        </div>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Collection Name
        </h6>
        <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
          <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
            <input
             {...register("name" , {reqired : true })}
              placeholder="e.g. CryptoDunks"
              type="text"
              className="form-InputBase-input form-OutlinedInput-input"
            />
            <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
          </div>
        </div>
        <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
          <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">Mint NFT</span>
        </div>
      </form>
    </div>
  );
  }else {
    return(
    <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
        <Item id={nftPrincipal.toText()}></Item>
        </div>
      </div>
    )
  }
}

export default Minter;
