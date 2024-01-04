import React from "react";
import styles from "../All Headers/header/index.module.css";
import footerStyle from "./index.module.css";
import topNavStyle from "../All Headers/topNav/index.module.css";
const HelpSection = () => {
  return (
    <div className="  mt-5">
      <div style={{ backgroundColor: "#F3E8E0" }} className=" ">
        <div  className="container  justify-content-center  align-items-center py-2 gap-2">
          <div className={footerStyle.ControlHelp}>
          <p className={`m-0  ${footerStyle.textLarge}`}>Help us Improve</p>
          <p className={`m-0 ${topNavStyle.language}`}>Take a brief survey about today's visit</p>
          <p className={`m-0  ${topNavStyle.language} ${footerStyle.underline}`}>Begin Survey</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
