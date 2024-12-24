import React from 'react';
import { useNavigate } from "react-router-dom";

const HeaderComponent = (props) => {
  const { currentComponent, cartCount = 0 } = props;
  const navigate = useNavigate();

  return (
    <div className="flex justify-between border-b p-2">
      <div className="flex justify-between cursor-pointer">
        <p
          className={`mr-4 ${currentComponent === "Home" ? "font-bold" : ""}`}
          onClick={() => navigate(`/`)}
        >
          Home
        </p>
        <p
          className={`${currentComponent === "My Orders" ? "font-bold" : ""}`}
          onClick={() => navigate(`/orders`)}
        >
          My Orders
        </p>
      </div>
      <div className="cursor-pointer" onClick={() => navigate(`/cart`)}>
        <p className={`${currentComponent === "My Cart" ? "font-bold" : ""}`}>
          {`My Cart (${cartCount})`}
        </p>
      </div>
    </div>
  );
};

export default HeaderComponent;