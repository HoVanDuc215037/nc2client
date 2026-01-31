<template>
  <div class="manage-root">
    <div class="dashboard">
      <div
        class="user-info"
        style="display: flex; flex-direction: row; ms: center; gap: 10px"
      >
        <img :src="avatar" alt="avatar" class="avatar" />
        <p style="text-wrap: nowrap; overflow: hidden; max-width: 100%">
          {{ name }}
        </p>
      </div>
      <div class="dashboard-menu">
        <div
          class="menu-group"
          @mouseenter="openMenu = 'store'"
          @mouseleave="openMenu = null"
        >
          <button class="menu-main">Quản lý cửa hàng</button>

          <div class="menu-dropdown" v-if="openMenu === 'store'">
            <button @click="go('orders', $event)">Quản lý đơn hàng</button>
            <button v-if="role === 'owner'" @click="go('map', $event)">
              Thông tin cửa hàng
            </button>
            <button v-if="role === 'owner'" @click="go('production', $event)">
              Quản lý sản phẩm
            </button>
            <button v-if="role === 'owner'" @click="go('staff', $event)">
              Quản lý tài khoản nhân viên
            </button>
            <button v-if="role === 'owner'" @click="go('statistic', $event)">
              Thống kê bán hàng
            </button>
          </div>
        </div>
        <div class="menu-group">
          <button class="menu-main" @click="go('profile', $event)">
            Hồ sơ
          </button>
        </div>
      </div>
      <button
        class="dashboard-btn"
        @click="logout"
        style="
          margin-top: 20vh;
          color: white;
          background: black;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        "
      >
        Đăng Xuất
      </button>
    </div>

    <section class="manage-content">
      <div v-if="activeTab === 'orders'">
        <ManageOrdersPage />
      </div>
      <div v-if="activeTab === 'production' && role === 'owner'">
        <ManageProductionPage />
      </div>
      <div v-if="activeTab === 'statistic' && role === 'owner'">
        <ManageStatisticPage />
      </div>
      <div v-if="activeTab === 'map' && role === 'owner'">
        <ManageMapPage />
      </div>
      <div v-if="activeTab === 'staff' && role === 'owner'">
        <ManageStaffPage />
      </div>
      <div v-if="activeTab === 'profile'">
        <ProfilePage />
      </div>
    </section>
  </div>
</template>

<script>
import "./MainManage.css";
import "./Dashboard.css";
import "../ScrollBar.css";
import MainManageLogic from "./MainManage.js";
export default {
  name: "MainManagePage",
  mixins: [MainManageLogic],
};
</script>