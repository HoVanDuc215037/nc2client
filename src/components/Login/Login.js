//import Cookies from "js-cookie";
//import axios from "axios";

export default {
    name: "LoginPage",
    data() {
        return {
            BACK_END_URL: "http://localhost:3000",
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
        // this.token = Cookies.get('auth_token');
        // if (this.token) { this.$router.push('/manage'); return; }
    },
    methods: {
        // async handleLogin() {
        //     try {
        //         axios.defaults.withCredentials = true;

        //         const response = await axios.post(
        //             this.DOMAIN + "/api/login",
        //             {
        //                 username: this.username,
        //                 password: this.password,
        //             }
        //         );
        //         console.log(this.username, this.password, response);
        //         // Kiểm tra nội dung phản hồi
        //         console.log(response); // Kiểm tra phản hồi từ backend

        //         // Lưu token vào cookie
        //         if (response.data.token) {
        //             const token = response.data.token;
        //             Cookies.set("auth_token", token, { expires: 7 });
        //             // Chuyển hướng người dùng đến trang quản lý

        //             this.$router.push("/manage/order");
        //         } else {
        //             throw new Error("Không có token trong phản hồi");
        //         }
        //     } catch (error) {
        //         console.error("Đăng nhập không thành công:", error);
        //         alert("Tên người dùng hoặc mật khẩu không đúng");
        //     }
        // },
        goTohome() {
            this.$router.push("/"); // Điều hướng đến trang đăng nhập
        },
        handleSubmit() {
            if (this.isRegister) {
                this.handleRegister();
            } else {
                this.handleLogin();
            }
        },

        handleLogin() {
            console.log('LOGIN', this.username, this.password);
            // gọi API login
        },

        handleRegister() {
            if (this.password !== this.confirmPassword) {
                alert('Mật khẩu nhập lại không khớp');
                return;
            }

            console.log('REGISTER', this.username, this.password);
            // gọi API register
        },
        showPassword() {
            this.isShowPassword = !this.isShowPassword;
        }
    },
};