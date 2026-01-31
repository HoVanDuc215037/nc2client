<template>
  <div class="admin-page">
    <div class="admin-header">
      <h2>Quản lý tài khoản</h2>
      <button class="btn-add" @click="openCreate">+</button>
      <button class="btn-logout" @click="signOut">Đăng xuất</button>
    </div>
    <input
      class="search-input"
      placeholder="Search account..."
      v-model="search"
    />
    <div class="card-list">
      <h3>Danh sách chủ cửa hàng</h3>
      <div class="account-card" v-for="acc in owner" :key="acc._id">
        <img :src="acc.avatar || defaultAvatar" class="admin-avatar" />
        <div class="info">
          <h4>{{ acc.name }}</h4>
          <p>{{ acc.email }}</p>
          <div class="roles">
            <label>
              <input
                type="radio"
                value="staff"
                v-model="acc.role"
                @change="updateRole(acc)"
              />
              Staff
            </label>
            <label>
              <input
                type="radio"
                value="owner"
                v-model="acc.role"
                @change="updateRole(acc)"
              />
              Owner
            </label>
          </div>
        </div>
        <div class="admin-actions">
          <button class="admin-delete" @click="deleteAccount(acc._id)">
            Xóa
          </button>
        </div>
      </div>
    </div>
    <div class="card-list">
      <h3>Danh sách nhân viên</h3>
      <div class="account-card" v-for="acc in staff" :key="acc._id">
        <img :src="acc.avatar || defaultAvatar" class="admin-avatar" />
        <div class="info">
          <h4>{{ acc.name }}</h4>
          <p>{{ acc.email }}</p>
          <div class="roles">
            <label>
              <input
                type="radio"
                value="staff"
                v-model="acc.role"
                @change="updateRole(acc)"
              />
              Staff
            </label>
            <label>
              <input
                type="radio"
                value="owner"
                v-model="acc.role"
                @change="updateRole(acc)"
              />
              Owner
            </label>
          </div>
        </div>
        <div class="admin-actions">
          <button class="admin-delete" @click="deleteAccount(acc._id)">
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-overlay" v-if="showCreate">
    <div class="modal">
      <h3>Tạo tài khoản mới</h3>

      <input type="text" placeholder="Tên" v-model="newAccount.name" />

      <input type="email" placeholder="Email" v-model="newAccount.email" />

      <div class="modal-actions">
        <button class="btn-create" @click="createAccount">Tạo</button>
        <button class="btn-cancel" @click="closeCreate">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import "./Admin.css";
import AdminLogic from "./Admin.js";
export default {
  name: "AdminPage",
  mixins: [AdminLogic],
};
</script>