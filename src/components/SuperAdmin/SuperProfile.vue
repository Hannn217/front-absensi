<template>
  <div class="profile-container">
    <div v-if="userProfile" class="profile-header">
      <h1>{{ userProfile.nama }}</h1>
      <p class="username">@{{ userProfile.username }}</p>
    </div>
    <div v-if="userProfile" class="profile-details">
      <div class="detail-item">
        <strong>Email:</strong> <span>{{ userProfile.email }}</span>
      </div>
      <div class="detail-item">
        <strong>Nomor HP:</strong> <span>{{ userProfile.nomor_hp }}</span>
      </div>
      <div class="detail-item">
        <strong>Jabatan:</strong> <span>{{ userProfile.jabatan }}</span>
      </div>
      <div class="detail-item">
        <strong>Created At:</strong> <span>{{ formattedDate(userProfile.created_at) }}</span>
      </div>
      <div class="detail-item">
        <strong>Updated At:</strong> <span>{{ formattedDate(userProfile.updated_at) }}</span>
      </div>
    </div>
    <div v-else>
      <p>Profil pengguna tidak ditemukan atau belum login.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SuperProfile',
  data() {
    return {
      userProfile: null,
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get('/api/profile');
        if (response.data.status === 'success') {
          this.userProfile = response.data.data;
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    formattedDate(date) {
      return new Date(date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h1 {
  margin: 0;
  font-size: 2em;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  font-size: 1.1em;
}

.username {
  color: #555;
}
</style>
