import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient"; // Ensure the correct path
import "./User.css";
import Pagination from "./Pagination";

const Users = ({ searchTerm, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // State cho tổng số trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axiosClient.get(`/users/getAll`, {
          params: { page, size },
        });
        const usersArray = Array.isArray(response.data.result.data) ? response.data.result.data : [];
        
        // Lưu tổng số người dùng và tổng số trang từ phản hồi
        setTotalUsers(response.data.result.totalElements);
        setTotalPages(response.data.result.totalPages);

        setUsers(usersArray);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [page, size]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userElements = filteredUsers.map(data => {
    const handleClick = () => {
      navigate(`/Users/${data.userId}`, { state: { user: data } });
    };

    return (
      <div key={data.userId} className="user-item" onClick={handleClick}>
        <h3>{data.username.charAt(0).toUpperCase() + data.username.slice(1)}</h3>
        <p>{data.email}</p>
      </div>
    );
  });

  return (
    <div className="userList-container">
      <div className="user-grid">
        {userElements}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Users;