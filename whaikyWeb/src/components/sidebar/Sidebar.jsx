import React from "react";
import Navbar from "../navbar/Navbar";
import Search from "../chat/Search";
import Chats from "../chat/Chats";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Search/>
      <Chats/>
    </div>
  );
};

export default Sidebar;
