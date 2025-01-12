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
export default {
  name: "HomePage",
  data() {
    return {
      products: [
        {
          id: 1,
          name: "Pizza",
          description: "Món ăn Ý ngon tuyệt",
          price: 120000,
        },
        {
          id: 2,
          name: "Burger",
          description: "Burger kẹp thịt bò thơm ngon",
          price: 80000,
        },
        {
          id: 3,
          name: "Salad",
          description: "Salad rau củ tươi mát",
          price: 60000,
        },
        {
          id: 4,
          name: "Lẩu Thái",
          description: "Món lẩu đậm đà vị Thái",
          price: 200000,
        },
        {
          id: 5,
          name: "Nem nướng",
          description: "Nem nướng ngon xuất sắc",
          price: 75000,
        },
      ],
      searchQuery: "",
      isPopupVisible: false, // Điều khiển hiển thị popup
      maxTableCount: 10, // Số lượng bàn tối đa
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.price.toString().includes(query)
      );
    },
  },
  methods: {
    showPopup() {
      this.isPopupVisible = true;
    },
    hidePopup() {
      this.isPopupVisible = false;
    },
    proceedToOrder(tableNumber) {
      // Mã hóa số bàn thành Base64
      const encodedTable = btoa(tableNumber.toString());

      // Chuyển hướng đến trang order với query
      this.$router.push({
        path: "/order",
        query: {
          d4fc4a78d3706edccafb665a8b2fdd9309e82c78625bb0f2b8e7bb9e1c4d21c:
            encodedTable,
        },
      });
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
#home-page {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  min-height: 100vh;
}

h1 {
  font-size: 28px;
  color: #ff6b00;
  margin-bottom: 20px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

.search-bar input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
}

.menu .list-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.product-item {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  width: 300px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.product-item h3 {
  font-size: 20px;
  color: #ff6b00;
  margin-bottom: 10px;
}

.product-item p {
  font-size: 16px;
  margin-bottom: 10px;
}

.product-item button {
  background-color: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
}

.product-item button:hover {
  background-color: #e65a00;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.login-button {
  background-color: #fff;
  color: #ff6b00;
  border: 1px solid #ff6b00;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #ff6b00;
  color: #fff;
}

.order-button {
  background-color: #ff6b00;
  color: #fff;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.order-button:hover {
  background-color: #e65a00;
}
</style>

<!-- <script>
import Cookies from "js-cookie"; // Thư viện để lấy cookie

export default {
  name: "HomePage", // Cập nhật tên component ở đây
  data() {
    return {
      isLoggedIn: false, // Biến kiểm tra xem người dùng có đăng nhập không
    };
  },
  created() {
    // Kiểm tra cookie auth_token khi trang Home được tải
    const token = Cookies.get("auth_token"); // Lấy cookie auth_token
    if (token) {
      this.isLoggedIn = true; // Nếu có token, nghĩa là người dùng đã đăng nhập
      this.$router.push("/manage"); // Chuyển hướng đến trang quản lý
    }
  },
  methods: {
    goToLogin() {
      this.$router.push("/login"); // Điều hướng đến trang đăng nhập
    },
    goToOrder() {
      this.$router.push("/order"); // Điều hướng đến trang đặt hàng
    },
  },
};
</script> -->

<style scoped>
/* .home {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  min-height: 100vh;
}

h1 {
  font-size: 28px;
  color: #ff6b00;
  margin-bottom: 20px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

ul li {
  font-size: 18px;
  margin: 10px 0;
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

button {
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.actions button:first-child {
  background-color: #fff;
  color: #ff6b00;
  border: 1px solid #ff6b00;
  padding: 8px 15px;
}

.actions button:first-child:hover {
  background-color: #ff6b00;
  color: #fff;
}

.actions button:last-child {
  background-color: #ff6b00;
  color: #fff;
  font-size: 16px;
  padding: 12px 25px;
}

.actions button:last-child:hover {
  background-color: #e65a00;
} */
/* .home {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  background-color: #fff;
}

.actions {
  margin-top: 20px;
}

.actions button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
}

.actions button:hover {
  background-color: #0056b3;
} */
</style>