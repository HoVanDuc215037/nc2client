<template>
  <div class="login-page">
    <div class="actions">
      <p @click="goTohome">Trang chủ</p>
    </div>
    <h1>Đăng nhập</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Tên người dùng:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Mật khẩu:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Đăng nhập</button>
    </form>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  beforeCreate() {
    const token = Cookies.get("auth_token"); // Lấy cookie auth_token
    //console.log(token);
    if (token) this.$router.push("/manage");
  },

  methods: {
    async handleLogin() {
      try {
        axios.defaults.withCredentials = true;

        const response = await axios.post(
          "https://nc2server.onrender.com/api/auth/login",
          {
            username: this.username,
            password: this.password,
          }
        );
        //console.log(this.username, this.password, response);
        // Kiểm tra nội dung phản hồi
        console.log(response); // Kiểm tra phản hồi từ backend

        // Lưu token vào cookie
        if (response.data.token) {
          const token = response.data.token;
          Cookies.set("auth_token", token, { expires: 7 });
          // Chuyển hướng người dùng đến trang quản lý

          this.$router.push("/manage");
        } else {
          throw new Error("Không có token trong phản hồi");
        }
      } catch (error) {
        console.error("Đăng nhập không thành công:", error);
        alert("Tên người dùng hoặc mật khẩu không đúng");
      }
    },
    goTohome() {
      this.$router.push("/"); // Điều hướng đến trang đăng nhập
    },
  },
};
</script>

<style scoped>
/* CSS cho trang đăng nhập */
.login-page {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9a00, #ff6b00);
  color: #fff;
}

.actions {
  position: absolute;
  top: 20px;
  left: 20px;
}

.actions p {
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
}

form {
  background-color: #fff;
  color: #333;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

form div {
  margin-bottom: 15px;
}

form label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
}

form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

form input:focus {
  outline: none;
  border-color: #ff6b00;
  box-shadow: 0 0 5px rgba(255, 107, 0, 0.5);
}

button {
  width: 100%;
  padding: 10px 15px;
  background-color: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #e65a00;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 107, 0, 0.5);
}

/* .login-page {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
}

form div {
  margin-bottom: 10px;
}

.actions p {
  padding: 10px 20px;
  width: max-content;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
} */
</style>