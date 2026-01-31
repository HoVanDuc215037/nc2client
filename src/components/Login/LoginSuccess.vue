<template>
  <div class="hello">
    <h1>Đăng nhập thành công. Đang chuyển hướng bạn đến trang quản lý</h1>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default {
  name: "LoginSuccessPage",
  data() {
    return {
      encodedToken: "",
      token: "",
    };
  },
  beforeCreate() {},
  created() {
    this.token =
      this.$route.query.e078cb80a315c1545d5396567810bf94dc360f30bfdaae14ca6aad6cf9fe768d;
    if (this.token === "") {
      this.$router.push("/login");
      return;
    }
    Cookies.set("auth_token", this.token, { expires: 7 });
    const payload = jwtDecode(this.token);
    if (payload.user.role === "owner" || payload.user.role === "staff")
      this.$router.push("/manage");
    if (payload.user.role === "admin") this.$router.push("/admin");
  },
  methods: {},
};
</script>