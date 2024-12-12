import React, { useState } from "react";
import "./User.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Users from "./Users";

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h1 style={{ fontWeight: "400" }}>Users</h1>
        <input
          type="text"
          placeholder="Filter by user"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: "20px", padding: "10px", width: "30%", borderRadius: "10px" }}
        />
        <Users searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default UsersList;