<!-- <template>
    <div class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li @click="navigateTo('Home')">
          <i class="fas fa-home"></i> Home
        </li>
        <li @click="showModal">
          <i class="fas fa-calendar-check"></i> Absen
        </li>
        <li @click="navigateTo('Profile')">
          <i class="fas fa-user"></i> Profile
        </li>
        <li @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      navigateTo: Function,
      showModal: Function,
      logout: Function,
    },
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #343a40;
    color: white;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    padding: 20px;
  }
  
  .sidebar ul li {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px 0;
  }
  
  .sidebar ul li i {
    margin-right: 10px;
    color: white;
  }
  </style>
   -->