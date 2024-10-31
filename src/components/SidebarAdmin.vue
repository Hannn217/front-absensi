<template>
  <div class="sidebar">
    <h2 class="sidebar-title">Super Admin</h2>
    <ul class="sidebar-menu">
      <li @click="navigateTo('KelolaPegawai')" :class="{ active: isActive('KelolaPegawai') }">
        <i class="fas fa-users"></i> Kelola Pegawai
      </li>
      <li @click="navigateTo('KelolaKelas')" :class="{ active: isActive('KelolaKelas') }">
        <i class="fas fa-chalkboard"></i> Kelola Kelas
      </li>
      <li @click="navigateTo('KelolaCuti')" :class="{ active: isActive('KelolaCuti') }">
        <i class="fas fa-calendar-alt"></i> Kelola Cuti
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SidebarAdmin',
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    isActive(routeName) {
      return this.$route.name === routeName;
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2C3E50;
  color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.2);
}

.sidebar-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  border-bottom: 1px solid #34495E;
  padding-bottom: 15px;
  width: 80%;
  text-align: center;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  width: 100%;
}

.sidebar-menu li {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s, color 0.3s;
  border-top: 1px solid #34495E;
}

.sidebar-menu li i {
  margin-right: 15px;
  font-size: 18px;
}

.sidebar-menu li:hover,
.sidebar-menu li.active {
  background-color: #34495E;
  color: #ECF0F1;
}

.sidebar-menu li:first-child {
  border-top: none;
}
</style>
