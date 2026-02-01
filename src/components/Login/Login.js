import axios from "axios";

export default {
    name: "LoginPage",
    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",
            username: "",
            password: "",
            isRegister: false,
            confirmPassword: "",
            isShowPassword: false
        };
    },
    beforeCreate() {
    },
    created() {
    },
    methods: {
        goTohome() {
            this.$router.push("/");
        },
        handleSubmit() {
            if (this.isRegister) {
                this.handleRegister();
            } else {
                this.handleLogin();
            }
        },

        async handleLogin() {
            try {
                const response = await axios.post(
                    `${this.BACK_END_URL}/sign-in`,
                    {
                        username: this.username,
                        password: this.password,
                    }
                );
                this.$router.push(`/login-success?e078cb80a315c1545d5396567810bf94dc360f30bfdaae14ca6aad6cf9fe768d=${response.data.token}`);
            } catch (err) {
                alert("Sai tài khoản hoặc mật khẩu");
            }
        },

        handleRegister() {
            if (this.password !== this.confirmPassword) {
                alert('Mật khẩu nhập lại không khớp');
                return;
            }
        },
        showPassword() {
            this.isShowPassword = !this.isShowPassword;
        }
    },
};