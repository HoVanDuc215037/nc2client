<template>
  <div class="manage">
    <div v-if="isLoggedIn">
      <!-- Header Section -->
      <div class="header">
        <h1>Trang Quản Lý</h1>
        <div class="header-actions">
          <button @click="viewOrders">Xem Đơn Hàng</button>
          <button @click="showFoodManagement">Quản Lý Món Ăn</button>
          <button @click="showRevenueManagement" v-if="userRole === 'admin'">
            Quản Lý Doanh Thu
          </button>
          <button @click="logout">Đăng Xuất</button>
        </div>
      </div>

      <!-- Content Section -->
      <div v-if="activePage === 'orders'">
        <h1>Quản lý đơn hàng</h1>
        <table>
          <thead>
            <tr>
              <th>Bàn số</th>
              <th>Tên Khách Hàng</th>
              <th>Số Điện Thoại</th>
              <th>Sản Phẩm</th>
              <th>Số Lượng</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orders" :key="index">
              <td>{{ order.table || "N/A" }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ order.customer_phone }}</td>
              <td>
                <ul>
                  <li v-for="(item, idx) in order.products" :key="idx">
                    {{ item.name }} - {{ item.quantity }} x {{ item.price }} VNĐ
                  </li>
                </ul>
              </td>
              <td>
                {{
                  order.products.reduce((sum, item) => sum + item.quantity, 0)
                }}
              </td>
              <td>{{ calculateTotal(order.products).toLocaleString() }} VNĐ</td>
              <td>{{ order.status }}</td>
              <td>
                <button
                  v-if="order.status === 'pending'"
                  @click="markOrderAsDone(order._id)"
                >
                  Xác Nhận
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Food Management Section -->
      <div v-if="activePage === 'food'">
        <FoodManagement />
      </div>

      <!-- Revenue Management Section -->
      <div v-if="activePage === 'revenue' && userRole === 'admin'">
        <RevenueManagement />
      </div>
    </div>

    <div v-else>
      <p>Bạn cần phải đăng nhập để truy cập trang này.</p>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import FoodManagement from "./FoodManagement.vue";
import RevenueManagement from "./RevenueManagement.vue";
const Cookies = require("js-cookie");

export default {
  name: "ManagePage",
  components: {
    FoodManagement,
    RevenueManagement,
  },
  data() {
    return {
      orders: [],
      socket: null,
      isLoggedIn: false,
      activePage: "orders",
      userRole: "", // Thêm biến để lưu role của người dùng
    };
  },
  // created() {
  //   const token = Cookies.get("auth_token");
  //   if (token) {
  //     const payload = JSON.parse(atob(token.split(".")[1])); // Decode phần payload của JWT
  //     this.userRole = payload.role;
  //     this.isLoggedIn = true;
  //     this.activePage = "orders";

  //     this.socket = io("https://nc2server.onrender.com", {
  //       transports: ["websocket"],
  //       withCredentials: true,
  //     });

  //     this.socket.on("admin_got_new_request", (order) => {
  //       if (this.userRole === "admin") {
  //         this.orders.push(order);
  //       }
  //     });
  //   } else {
  //     this.$router.push("/");
  //   }
  // },
  methods: {
    calculateTotal(products) {
      return products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    },
    viewOrders() {
      this.activePage = "orders";
    },
    showFoodManagement() {
      this.activePage = "food";
    },
    showRevenueManagement() {
      if (this.userRole === "admin") {
        this.activePage = "revenue";
      }
    },
    logout() {
      Cookies.remove("auth_token");
      this.isLoggedIn = false;
      this.$router.push("/");
    },
    markOrderAsDone(orderId) {
      // Gửi yêu cầu tới server để cập nhật trạng thái
      this.socket.emit("mark_order_as_done", { orderId });

      // Cập nhật trạng thái đơn hàng trong giao diện
      const order = this.orders.find((o) => o._id === orderId);
      if (order) {
        order.status = "done";
      }
    },
  },
  created() {
    const token = Cookies.get("auth_token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      this.userRole = payload.role;
      this.isLoggedIn = true;
      this.activePage = "orders";

      this.socket = io("https://nc2server.onrender.com", {
        transports: ["websocket"],
        withCredentials: true,
      });

      this.socket.on("admin_got_new_request", (order) => {
        if (this.userRole === "admin" || this.userRole === "staff") {
          order.status = "pending"; // Đơn hàng mới luôn có trạng thái pending
          this.orders.push(order);
        }
      });

      this.socket.on("order_status_updated", (data) => {
        const order = this.orders.find((o) => o._id === data.orderId);
        if (order) {
          order.status = data.status;
        }
      });
    } else {
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4caf50;
  color: white;
  padding: 10px;
}

.header h1 {
  margin: 0;
}

.header-actions button {
  background-color: #f4f4f4;
  border: none;
  color: #4caf50;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
}

.header-actions button:hover {
  background-color: #ddd;
}
</style>