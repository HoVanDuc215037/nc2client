<template>
  <div id="order-page">
    <div class="actions">
      <p @click="goTohome">Trang chủ</p>
    </div>
    <h1>Chọn món ăn và gửi yêu cầu</h1>
    <p v-if="tableNumber">Đơn đặt hàng cho bàn số {{ tableNumber }}</p>
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
          :key="product._id"
          class="product-item"
        >
          <img
            :src="product.image"
            alt="product"
            class="product-image"
            style="border: 2px dashed gray"
          />

          <h3>{{ product.name }}</h3>
          <p class="price">{{ product.price.toLocaleString() }} VNĐ</p>

          <button v-if="!isInCart(product._id)" @click="addToCart(product)">
            Thêm vào giỏ
          </button>

          <button v-else disabled>Đã thêm</button>
        </div>
      </div>
    </div>

    <!-- Popup để nhập tên và số điện thoại, và hiển thị giỏ hàng -->
    <div v-if="isPopupVisible" class="popup-overlay">
      <div class="popup">
        <h2>Xác nhận đơn hàng</h2>

        <!-- Hiển thị thông tin giỏ hàng -->
        <h3>Giỏ hàng của bạn</h3>
        <ul>
          <li v-for="(item, index) in cart" :key="index">
            {{ item.name }} - {{ item.quantity }} x
            {{ item.price.toLocaleString() }} VNĐ
          </li>
        </ul>
        <p><strong>Tổng cộng:</strong> {{ calculateTotal(cart) }} VNĐ</p>

        <!-- Nhập thông tin khách hàng -->
        <label for="name">Tên:</label>
        <input type="text" v-model="customerName" placeholder="Nhập tên" />
        <label for="phone">Số điện thoại:</label>
        <input
          type="text"
          v-model="customerPhone"
          placeholder="Nhập số điện thoại"
        />

        <button @click="submitRequest">Xác nhận</button>
        <button @click="hidePopup">Hủy</button>
      </div>
    </div>

    <button v-if="cart.length" @click="openCartPopup" class="open-cart">
      Xem giỏ hàng ({{ cart.length }})
    </button>

    <!-- POPUP GIỎ HÀNG -->
    <div
      v-if="popupStep === 'cart'"
      class="popup-overlay"
      @click.self="closeAllPopup"
    >
      <div class="popup cart-popup">
        <h2>Giỏ hàng</h2>

        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <div style="display: flex; gap: 15px">
            <img
              :src="getProductImage(item._id)"
              class="cart-image"
              style="border: 1px dashed gray"
            />

            <div class="cart-info">
              <h4>{{ item.name }}</h4>
              <p>Số lượng: {{ item.quantity }}</p>
              <p class="price">{{ item.price.toLocaleString() }} VNĐ</p>
            </div>
          </div>

          <!-- NÚT XOÁ -->
          <button
            class="remove-btn"
            @click="removeFromCart(index)"
            title="Xoá món"
            style="height: max-content"
          >
            Xóa
          </button>
        </div>

        <div class="cart-total">
          <strong>Tổng:</strong>
          {{ calculateTotal(cart).toLocaleString() }} VNĐ
        </div>

        <div class="popup-actions">
          <button @click="goToConfirm">Đặt hàng</button>
          <button @click="closeAllPopup">Đóng</button>
        </div>
      </div>
    </div>

    <div v-if="requestStatus" class="request-status">
      <p>Yêu cầu của bạn đã được gửi thành công!</p>
    </div>

    <!-- POPUP XÁC NHẬN -->
    <div
      v-if="popupStep === 'confirm'"
      class="popup-overlay"
      @click.self="closeAllPopup"
    >
      <div class="popup popup-back">
        <div
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          "
        >
          <h2>Xác nhận đơn hàng</h2>
          <button @click="openCartPopup" class="">Quay lại giỏ hàng</button>
        </div>

        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <div style="display: flex; gap: 15px">
            <img
              :src="getProductImage(item._id)"
              class="cart-image"
              style="border: 1px dashed gray"
            />

            <div class="cart-info">
              <h4>{{ item.name }}</h4>
              <p>Số lượng: {{ item.quantity }}</p>
              <p class="price">{{ item.price.toLocaleString() }} VNĐ</p>
            </div>
          </div>
          <!-- NÚT XOÁ -->
          <button
            class="remove-btn"
            @click="removeFromCart(index)"
            title="Xoá món"
            style="height: max-content"
          >
            Xóa
          </button>
        </div>

        <p>
          <strong>Tổng cộng:</strong>
          {{ calculateTotal(cart).toLocaleString() }} VNĐ
        </p>

        <input v-model="customerName" placeholder="Tên khách hàng" />
        <input v-model="customerPhone" placeholder="Số điện thoại" />
        <div class="popup-actions">
          <button @click="submitRequest">Gửi yêu cầu</button>
          <button @click="closeAllPopup">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./Restaurant.css";
import RestaurantLogic from "./Restaurant.js";
export default {
  name: "RestaurantPage",
  mixins: [RestaurantLogic],
};
</script>