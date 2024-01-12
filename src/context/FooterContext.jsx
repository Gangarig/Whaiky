// FooterContext.js
import React, { createContext, useState, useContext } from 'react';

const FooterContext = createContext();

export const useFooter = () => useContext(FooterContext);

export const FooterProvider = ({ children }) => {
  const [activeItem, setActiveItem] = useState(null);

  const setFooterActiveItem = (item) => {
    setActiveItem(item);
  };

  return (
    <FooterContext.Provider value={{ activeItem, setFooterActiveItem }}>
      {children}
    </FooterContext.Provider>
  );
};
