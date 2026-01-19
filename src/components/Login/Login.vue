<template>
  <div class="login-page">
    <h1>{{ isRegister ? "Đăng ký" : "Đăng nhập" }}</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label>Tên người dùng:</label>
        <input type="text" v-model="username" required />
      </div>

      <div>
        <label>Mật khẩu:</label>
        <input
          :type="isShowPassword ? 'text' : 'password'"
          v-model="password"
          required
        />
      </div>

      <!-- Chỉ hiện khi đăng ký -->
      <div v-if="isRegister">
        <label>Nhập lại mật khẩu:</label>
        <input
          :type="isShowPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          required
        />
      </div>

      <div style="display: flex; flex-direction: row">
        <input
          type="checkbox"
          id="showPassword"
          style="width: auto"
          @click="showPassword"
        />
        <label for="showPassword" style="margin-bottom: 0px"
          >Hiện mật khẩu</label
        >
      </div>

      <button type="submit">
        {{ isRegister ? "Đăng ký" : "Đăng nhập" }}
      </button>
    </form>

    <div class="divider">HOẶC</div>

    <!-- Google -->
    <a href="https://nc2server.onrender.com/auth/google">
      <button class="google-btn">
        {{ isRegister ? "Đăng ký bằng Google" : "Đăng nhập bằng Google" }}
      </button>
    </a>

    <!-- Chuyển chế độ -->
    <p class="switch-mode">
      <span v-if="!isRegister">
        Chưa có tài khoản?
        <a @click="isRegister = true">Đăng ký</a>
      </span>
      <span v-else>
        Đã có tài khoản?
        <a @click="isRegister = false">Đăng nhập</a>
      </span>
    </p>
  </div>
</template>

<script>
import "./Login.css";
import LoginLogic from "./Login.js";
export default {
  name: "LoginPage",
  mixins: [LoginLogic],
};
</script>