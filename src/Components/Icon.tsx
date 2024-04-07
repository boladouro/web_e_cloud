import {Icon as BIcon} from "react-bulma-components";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {IconBaseProps, IconType} from "react-icons";
import React, {ReactNode} from "react";

const Icon: React.FC<{ FaIcon: IconType; }> = ({ FaIcon }) => {
  return <BIcon><FaIcon/></BIcon>
}

export default Icon;