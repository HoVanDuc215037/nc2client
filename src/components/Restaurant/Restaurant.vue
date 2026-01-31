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
      <button class="header-button" @click="openFilterPopup">Lọc</button>
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
            @click="openDetail(product)"
          />

          <h3 @click="openDetail(product)">{{ product.name }}</h3>
          <p class="price" @click="openDetail(product)">
            {{ product.price.toLocaleString() }} VNĐ
          </p>

          <button v-if="!isInCart(product._id)" @click="addToCart(product)">
            Thêm vào giỏ
          </button>

          <button v-else disabled>Đã thêm</button>
        </div>
      </div>
    </div>
    <div v-if="isPopupVisible" class="popup-overlay">
      <div class="popup">
        <h2>Xác nhận đơn hàng</h2>
        <h3>Giỏ hàng của bạn</h3>
        <ul>
          <li v-for="(item, index) in cart" :key="index">
            {{ item.name }} - {{ item.quantity }} x
            {{ item.price.toLocaleString() }} VNĐ
          </li>
        </ul>
        <p><strong>Tổng cộng:</strong> {{ calculateTotal(cart) }} VNĐ</p>
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
    <div
      v-if="isFilterPopup"
      class="popup-overlay"
      @click.self="closeFilterPopup"
    >
      <div class="popup">
        <h3>Lọc theo tag</h3>

        <div class="tag-list">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="{ active: selectedTags.includes(tag) }"
            class="tag-btn"
          >
            {{ tag }}
          </button>
        </div>

        <div class="popup-actions">
          <button @click="closeFilterPopup">Áp dụng</button>
          <button @click="resetFilter">Hủy</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDetailPopup" class="popup-overlay" @click.self="closeDetail">
    <div class="popup">
      <h3>Chi tiết sản phẩm</h3>

      <img
        :src="selectedProduct.image"
        style="width: 100%; border-radius: 6px; margin-bottom: 10px"
      />

      <p><b>Tên:</b> {{ selectedProduct.name }}</p>
      <p><b>Mô tả:</b> {{ selectedProduct.description || "Không có" }}</p>
      <p><b>Giá:</b> {{ selectedProduct.price.toLocaleString() }} VNĐ</p>

      <p>
        <b>Tags:</b>
        {{ (selectedProduct.tags || []).join(", ") || "Không có" }}
      </p>

      <p>
        <b>Ngày tạo:</b>
        {{ new Date(selectedProduct.createdAt).toLocaleString() }}
      </p>

      <div class="popup-actions">
        <button class="btn" @click="closeDetail">Đóng</button>
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