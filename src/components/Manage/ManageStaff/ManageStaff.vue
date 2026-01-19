<template>
  <div class="staff-page">
    <!-- HEADER -->
    <div class="staff-header">
      <h2>Nhân viên</h2>
      <button class="add-btn" @click="showPopup = true">+</button>
    </div>

    <!-- STAFF LIST -->
    <div class="staff-list">
      <div v-if="staffs.length === 0">Không tồn tại nhân viên, hãy tạo mới</div>
      <div v-else>
        <div v-for="staff in staffs" :key="staff._id" class="staff-card">
          <img :src="staff.avatar || defaultAvatar" class="staff-avatar" />

          <div class="info">
            <h4>{{ staff.name }}</h4>
            <p>{{ staff.email }}</p>
          </div>

          <button class="delete-btn" @click="deleteStaff(staff._id)">
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- ADD STAFF POPUP -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h3>Thêm nhân viên</h3>

        <input v-model="newStaff.name" placeholder="Tên nhân viên" />

        <input v-model="newStaff.email" placeholder="Email" />

        <div class="popup-actions">
          <button class="create" @click="createStaff">Tạo</button>
          <button class="cancel" @click="closePopup">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./ManageStaff.css";
import ManageStaffLogic from "./ManageStaff.js";

export default {
  name: "ManageStaffPage",
  mixins: [ManageStaffLogic],
};
</script>