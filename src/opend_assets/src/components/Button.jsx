import React from "react";
import { propTypes } from "../../../../node_modules/react-bootstrap/esm/Image";

function Button(props){
    return(
    <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
              onClick={props.handleClick}
              className="form-Chip-label"
            >
              {props.text}
            </span>
            </div>
    )
}

export default Button;