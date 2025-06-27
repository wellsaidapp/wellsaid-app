// Imports
import React, { useState, useEffect, useRef } from 'react';

// Assets
import logo from '../../assets/wellsaid.svg';

const WellSaidLogo = () => (
  <img
    src={logo}
    alt="WellSaid"
    className="h-10 w-auto"
  />
);

const Header = () => (
  <div className="bg-white px-4 py-4 flex items-center justify-center border-b border-gray-100">
    <WellSaidLogo />
  </div>
);

export default Header;
