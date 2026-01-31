<template>
  <div class="profile-page">
    <div id="section-header">Thông tin cá nhân</div>

    <div class="profile-card">
      <div class="profile-component profile-left">
        <h4>Thông tin tài khoản</h4>
        <div class="avatar-wrapper">
          <img :src="previewAvatar || accountAvatar" class="profile-avatar" />
          <button
            v-if="isEdit"
            class="avatar-edit-btn"
            @click="triggerAvatarInput"
          >
            Thay ảnh
          </button>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onAvatarChange"
          />
        </div>

        <div class="info">
          <input v-if="isEdit" v-model="accountName" class="profile-input" />
          <h3 v-else><b>Tên tài khoản:&nbsp;</b>{{ accountName }}</h3>

          <p><b>Email:&nbsp;</b>{{ accountEmail }}</p>
        </div>
        <button v-if="!isEdit" @click="toggleEdit" class="profile-btn">
          Sửa thông tin
        </button>
        <button v-if="isEdit" @click="saveProfile()" class="profile-btn">
          Lưu
        </button>
        <button v-if="isEdit" @click="closeEdit" class="profile-btn">
          Hủy
        </button>
      </div>
      <div class="profile-component profile-right">
        <h4>Thông tin cửa hàng</h4>
        <div v-if="role === 'owner'">
          <img
            :src="previewRestaurant || restaurantImage"
            class="profile-restaurant-image"
          />
          <h3><b>Thuộc nhà hàng:&nbsp;</b>{{ restaurantName }}</h3>
          <p><b>Địa chỉ:&nbsp;</b>{{ restaurantLocation }}</p>
        </div>
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