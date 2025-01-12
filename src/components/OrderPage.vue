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
          :key="product.id"
          class="product-item"
        >
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p><strong>Giá: </strong>{{ product.price.toLocaleString() }} VNĐ</p>
          <button @click="addToCart(product)">Chọn món</button>
        </div>
      </div>
    </div>
    <div v-if="cart.length > 0" class="cart">
      <h2>Giỏ hàng</h2>
      <ul>
        <li v-for="(item, index) in cart" :key="index">
          {{ item.name }} - {{ item.quantity }} x
          {{ item.price.toLocaleString() }} VNĐ
          <button @click="removeFromCart(index)">Xóa</button>
        </li>
      </ul>
      <button @click="showPopup">Gửi yêu cầu</button>
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

    <div v-if="requestStatus" class="request-status">
      <p>Yêu cầu của bạn đã được gửi thành công!</p>
    </div>

    <!-- Popup xác nhận đơn hàng -->
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

        <!-- Mã QR hiển thị sau khi nhấn "Gửi yêu cầu" -->
        <div v-if="qrCodeDataUrl" class="qr-code-container">
          <h3>Mã QR để thanh toán</h3>
          <img :src="qrCodeDataUrl" alt="QR Code" />
        </div>

        <button v-if="!qrCodeDataUrl" @click="submitRequest">
          Gửi yêu cầu
        </button>
        <button v-else @click="hidePopup">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: "OrderPage",
  data() {
    return {
      products: [
        {
          id: 1,
          name: "Kem sinh tố",
          description: "Kem sinh tố",
          price: 50000,
        },
        {
          id: 2,
          name: "Món ngẫu nhiên",
          description: "Món ngẫu nhiên",
          price: 60000,
        },
        { id: 3, name: "Lẩu thái", description: "Lẩu thái", price: 70000 },
        { id: 4, name: "Bún chả", description: "Bún chả", price: 75000 },
        { id: 5, name: "Nem nướng", description: "Nem nướng", price: 80000 },
      ],
      cart: [],
      requestStatus: false,
      socket: null,
      tableNumber: null,
      isPopupVisible: false, // Biến điều khiển hiển thị popup
      customerName: "",
      customerPhone: "",
      searchQuery: "", //lưu chuỗi tìm kiếm
    };
  },
  created() {
    // Giải mã giá trị bàn từ query param
    //SHA256("table") = "0d4fc4a78d3706edccafb665a8b2fdd9309e82c78625bb0f2b8e7bb9e1c4d21c" but remove first '0'
    const encodedTable =
      this.$route.query
        .d4fc4a78d3706edccafb665a8b2fdd9309e82c78625bb0f2b8e7bb9e1c4d21c;
    if (encodedTable) {
      this.tableNumber = atob(encodedTable); // Giải mã Base64
    }
    this.socket = io("https://nc2server.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }

      // Lọc các sản phẩm dựa trên các thuộc tính: name, description, price
      return this.products.filter((product) => {
        const searchQueryLower = this.searchQuery.toLowerCase(); // Chuyển chuỗi tìm kiếm về chữ thường
        return (
          product.name.toLowerCase().includes(searchQueryLower) ||
          product.description.toLowerCase().includes(searchQueryLower) ||
          product.price.toString().includes(searchQueryLower)
        );
      });
    },
  },
  methods: {
    addToCart(product) {
      const existingProduct = this.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    showPopup() {
      this.isPopupVisible = true;
    },
    hidePopup() {
      this.isPopupVisible = false;
    },
    submitRequest() {
      if (!this.customerName || !this.customerPhone) {
        alert("Vui lòng nhập đầy đủ tên và số điện thoại.");
        return;
      }

      const requestData = {
        products: this.cart,
        customer_name: this.customerName,
        customer_phone: this.customerPhone,
        table: this.tableNumber,
      };

      this.socket.emit("new_request", requestData);

      this.requestStatus = true;
      this.cart = [];
      this.customerName = "";
      this.customerPhone = "";
      this.hidePopup(); // Đóng popup sau khi gửi
      setTimeout(() => {
        this.requestStatus = false;
      }, 5000);
    },
    calculateTotal(cart) {
      const total = cart.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);

      // Định dạng số với dấu phẩy
      return total.toLocaleString();
    },
    goTohome() {
      this.$router.push("/"); // Điều hướng đến trang đăng nhập
    },
  },
};
</script>

<style scoped>
#order-page {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

.actions {
  text-align: left;
  margin-bottom: 20px;
}

.actions p {
  color: #ff6b00;
  cursor: pointer;
  font-weight: bold;
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar input {
  width: 80%;
  max-width: 500px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.list-item {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-item p {
  font-size: 14px;
  margin: 5px 0;
}

.product-item button {
  background-color: #ff6b00;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.product-item button:hover {
  background-color: #e65a00;
}

.cart {
  margin-top: 40px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.cart h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.cart ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cart button {
  background-color: #ff6b00;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.popup label {
  display: block;
  margin-top: 10px;
}

.popup input {
  width: 95%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.popup button {
  background-color: #ff6b00;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  margin-left: 10px;
}

.popup button:hover {
  background-color: #e65a00;
}

.request-status {
  text-align: center;
  margin-top: 20px;
  color: #28a745;
  font-weight: bold;
}
</style>

<!-- <style scoped>
/* Styling cho giao diện */
#order-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.menu,
.list-item {
  display: flex;
  flex-wrap: wrap;
}

.product-item {
  border: 1px solid #ccc;
  margin: 10px;
  padding: 15px;
  width: 200px;
  text-align: center;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.cart {
  margin-top: 20px;
}

.cart ul {
  list-style: none;
  padding: 0;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
}

.request-status {
  margin-top: 20px;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  text-align: center;
}

.actions p {
  padding: 10px 20px;
  margin: 0 10px;
  width: max-content;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
}
</style> -->