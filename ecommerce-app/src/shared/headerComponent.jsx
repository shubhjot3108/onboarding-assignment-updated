import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS, COMPONENT_NAMES } from "./constants";

const HeaderComponent = (props) => {
  const { currentComponent, cartCount = 0 } = props;
  const navigate = useNavigate();

  return (
    <div className="flex justify-between border-b p-2">
      <div className="flex justify-between cursor-pointer">
        <p
          className={`mr-4 ${
            currentComponent === COMPONENT_NAMES.HOME ? "font-bold" : ""
          }`}
          onClick={() => navigate(PATHS.HOME)}
        >
          {COMPONENT_NAMES.HOME}
        </p>
        <p
          className={`${
            currentComponent === COMPONENT_NAMES.MY_ORDERS ? "font-bold" : ""
          }`}
          onClick={() => navigate(PATHS.ORDERS)}
        >
         {COMPONENT_NAMES.MY_ORDERS}
        </p>
      </div>
      <div className="cursor-pointer" onClick={() => navigate(PATHS.CART)}>
        <p
          className={`${
            currentComponent === COMPONENT_NAMES.MY_CART ? "font-bold" : ""
          }`}
        >
          {`${COMPONENT_NAMES.MY_CART} (${cartCount})`}
        </p>
      </div>
    </div>
  );
};

export default HeaderComponent;
