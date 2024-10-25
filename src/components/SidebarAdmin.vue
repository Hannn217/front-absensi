<template>
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/admin/profile">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/admin/users">
            <i class="fas fa-users"></i> Kelola Pengguna
          </router-link>
        </li>
        <li>
          <router-link to="/admin/settings">
            <i class="fas fa-cogs"></i> Pengaturan
          </router-link>
        </li>
        <li>
          <router-link to="/admin/reports">
            <i class="fas fa-file-alt"></i> Laporan
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SidebarAdmin',
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    height: 100vh;
    background-color: #2c3e50;
    color: white;
    position: fixed;
    left: 0;
    top: 0;
    padding-top: 20px;
  }
  
  .sidebar-header {
    text-align: center;
    padding: 10px;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 1px solid #34495e;
  }
  
  .sidebar-menu {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
  }
  
  .sidebar-menu li {
    padding: 15px;
    border-bottom: 1px solid #34495e;
  }
  
  .sidebar-menu li a {
    color: white;
    text-decoration: none;
    display: block;
    font-size: 18px;
  }
  
  .sidebar-menu li a:hover {
    background-color: #34495e;
  }
  
  .sidebar-menu li i {
    margin-right: 10px;
  }
  </style>
  