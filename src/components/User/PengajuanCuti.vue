<template>
    <div class="cuti-form">
        <h3>Form Pengajuan Cuti</h3>
        <form @submit.prevent="submitForm">
            <!-- Jenis Cuti -->
            <div class="form-group">
                <label for="jenis_cuti">Jenis Cuti:</label>
                <select v-model="cutiForm.jenis_cuti" id="jenis_cuti" required>
                    <option value="">Pilih Jenis Cuti</option>
                    <option value="Cuti Bulanan">Cuti Bulanan</option>
                    <option value="Cuti Mingguan">Cuti Mingguan</option>
                </select>
                <div v-if="errors.jenis_cuti" class="error-message">{{ errors.jenis_cuti }}</div>
            </div>

            <!-- Alamat -->
            <div class="form-group">
                <label for="alamat">Alamat:</label>
                <input type="text" v-model="cutiForm.alamat" id="alamat" required maxlength="255" />
                <div v-if="errors.alamat" class="error-message">{{ errors.alamat }}</div>
            </div>

            <!-- Keterangan -->
            <div class="form-group">
                <label for="keterangan">Keterangan:</label>
                <textarea v-model="cutiForm.keterangan" id="keterangan" required maxlength="500"></textarea>
                <div v-if="errors.keterangan" class="error-message">{{ errors.keterangan }}</div>
            </div>

            <!-- Tanggal Mulai -->
            <div class="form-group">
                <label for="tanggal_mulai">Tanggal Mulai:</label>
                <input type="date" v-model="cutiForm.tanggal_mulai" id="tanggal_mulai" required />
                <div v-if="errors.tanggal_mulai" class="error-message">{{ errors.tanggal_mulai }}</div>
            </div>

            <!-- Tanggal Selesai -->
            <div class="form-group">
                <label for="tanggal_selesai">Tanggal Selesai:</label>
                <input type="date" v-model="cutiForm.tanggal_selesai" id="tanggal_selesai" required />
                <div v-if="errors.tanggal_selesai" class="error-message">{{ errors.tanggal_selesai }}</div>
            </div>

            <button type="submit">Ajukan Cuti</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const cutiForm = ref({
    jenis_cuti: '',
    alamat: '',
    keterangan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
});

const errors = ref({
    jenis_cuti: '',
    alamat: '',
    keterangan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
});

function validateForm() {
    errors.value = {};  // Reset errors
    let isValid = true;

    // Validate jenis_cuti
    if (!cutiForm.value.jenis_cuti) {
        errors.value.jenis_cuti = 'Jenis Cuti harus dipilih.';
        isValid = false;
    }

    // Validate alamat
    if (!cutiForm.value.alamat || cutiForm.value.alamat.length > 255) {
        errors.value.alamat = 'Alamat harus diisi dan maksimal 255 karakter.';
        isValid = false;
    }

    // Validate keterangan
    if (!cutiForm.value.keterangan || cutiForm.value.keterangan.length > 500) {
        errors.value.keterangan = 'Keterangan harus diisi dan maksimal 500 karakter.';
        isValid = false;
    }

    // Validate tanggal_mulai
    if (!cutiForm.value.tanggal_mulai) {
        errors.value.tanggal_mulai = 'Tanggal mulai harus diisi.';
        isValid = false;
    }

    // Validate tanggal_selesai
    if (!cutiForm.value.tanggal_selesai) {
        errors.value.tanggal_selesai = 'Tanggal selesai harus diisi.';
        isValid = false;
    } else if (new Date(cutiForm.value.tanggal_selesai) < new Date(cutiForm.value.tanggal_mulai)) {
        errors.value.tanggal_selesai = 'Tanggal selesai harus lebih besar atau sama dengan tanggal mulai.';
        isValid = false;
    }

    return isValid;
}

function submitForm() {
    if (validateForm()) {
        // Simulasikan pengajuan cuti
        console.log('Formulir cuti diajukan:', cutiForm.value);
        alert('Pengajuan cuti berhasil!');
    } else {
        alert('Harap perbaiki kesalahan dalam formulir.');
    }
}
</script>

<style scoped>
.cuti-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cuti-form h3 {
    text-align: center;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.form-group textarea {
    resize: vertical;
    height: 100px;
}

.error-message {
    color: red;
    font-size: 12px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    opacity: 0.9;
}
</style>
