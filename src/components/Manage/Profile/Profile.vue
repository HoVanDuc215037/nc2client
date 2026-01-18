<template>
  <div class="profile-page">
    <div id="section-header">Thông tin cá nhân</div>

    <div class="profile-card">
      <!-- LEFT -->
      <div class="profile-component profile-left">
        <img :src="previewAvatar || accountAvatar" class="profile-avatar" />

        <input
          v-if="isEdit"
          type="file"
          accept="image/*"
          @change="onAvatarChange"
        />

        <div class="info">
          <input v-if="isEdit" v-model="accountName" class="profile-input" />
          <h3 v-else><b>Tên tài khoản:&nbsp;</b>{{ accountName }}</h3>

          <p><b>Email:&nbsp;</b>{{ accountEmail }}</p>
        </div>

        <button @click="toggleEdit" class="profile-btn">
          {{ isEdit ? "Lưu" : "Sửa thông tin" }}
        </button>
        <button v-if="isEdit" @click="closeEdit" class="profile-btn">
          Hủy
        </button>
      </div>

      <!-- RIGHT -->
      <div class="profile-component profile-right">
        <!-- OWNER -->
        <div v-if="role === 'owner'">
          <img
            :src="previewRestaurant || restaurantImage"
            class="profile-restaurant-image"
          />
          <h3><b>Thuộc nhà hàng:&nbsp;</b>{{ restaurantName }}</h3>
          <p><b>Địa chỉ:&nbsp;</b>{{ restaurantLocation }}</p>
        </div>

        <!-- STAFF -->
        <div v-else>
          <div class="staff-info">
            <b>Thuộc nhà hàng:&nbsp;</b>{{ restaurantName }}
          </div>

          <img :src="restaurantImage" class="profile-restaurant-image" />

          <p><b>Địa chỉ:&nbsp;</b>{{ restaurantLocation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./Profile.css";
import ProfileLogic from "./Profile.js";
export default {
  name: "ProfilePage",
  mixins: [ProfileLogic],
};
</script>