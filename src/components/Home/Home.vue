<template>
  <div id="home-page">
    <button @click="goToLogin" class="login-button">Cửa hàng</button>
    <h1>Danh sách món ăn</h1>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm món ăn..."
      />
    </div>

    <div class="menu">
      <div v-if="filteredProducts.length === 0">
        <p>Không tìm thấy món nào</p>
      </div>
      <div v-else class="list-item">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-item"
        >
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p><strong>Giá: </strong>{{ product.price.toLocaleString() }} VNĐ</p>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="showPopup" class="order-button">Đặt Hàng</button>
    </div>

    <!-- Popup chọn số bàn -->
    <div v-if="isPopupVisible" class="popup-overlay">
      <div class="popup">
        <h2>Chọn Bàn</h2>
        <div class="table-buttons">
          <!-- Tạo danh sách nút từ 1 đến số bàn tối đa -->
          <button
            v-for="table in maxTableCount"
            :key="table"
            @click="proceedToOrder(table)"
            class="table-button"
          >
            Bàn {{ table }}
          </button>
        </div>
        <button @click="hidePopup" class="cancel-button">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import "./Home.css";
import HomeLogic from "./Home.js";
export default {
  name: "HomePage",
  mixins: [HomeLogic],
};
</script>