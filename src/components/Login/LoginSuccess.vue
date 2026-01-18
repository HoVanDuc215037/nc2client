<template>
  <div class="hello">
    <h1>Đăng nhập thành công. Đang chuyển hướng bạn đến trang quản lý</h1>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "LoginSuccessPage",
  data() {
    return {
      encodedToken: "",
    };
  },
  beforeCreate() {
    const token =
      this.$route.query
        .e078cb80a315c1545d5396567810bf94dc360f30bfdaae14ca6aad6cf9fe768d;
    if (!token) {
      this.$router.push("/login");
      return;
    }
    Cookies.set("auth_token", token, { expires: 7 });
    this.$router.push("/manage");
  },
  created() {},
  methods: {},
};
</script>