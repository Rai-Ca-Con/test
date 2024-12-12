// src/components/Sidebar.js
import React from 'react';
import { Menu } from 'antd';
import './Sidebar.css'; // Nhập CSS

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-title">Categories</div>
      <Menu mode="inline" className="menu" style={{ borderRight: 0 }}>
        <Menu.Item key="1">Category 1</Menu.Item>
        <Menu.Item key="2">Category 2</Menu.Item>
        <Menu.Item key="3">Category 3</Menu.Item>
        <Menu.Item key="4">Category 4</Menu.Item>
      </Menu>
    </div>
  );
};