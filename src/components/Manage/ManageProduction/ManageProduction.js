import Cookies from 'js-cookie';
import axios from 'axios';

export default {
    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",
            email: '',
            products: [],
            tags: [],
            showForm: false,
            form: {
                name: '',
                description: '',
                price: null,
                sale: 1,
                image: null, // base64 string
                tags: []
            },
            productionTags: [
                "Đồ ăn",
                "Đồ uống",
                "Mỳ, bún",
                "Đồ ăn vặt",
                "Tươi sống",
                "Chả",
                "Chiên",
                "Luộc",
                "Thức ăn nhanh",
                "Đồ ngọt",
                "Trà",
                "Cà phê",
                "Có cồn",
                "Chay"
            ],
        };
    },
    async created() {
        const token = Cookies.get('auth_token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.email = payload.user.email;
        const emailPseudo = this.email.split('@gmail.com')[0];
        const response = await axios.get(`${this.BACK_END_URL}/production/email`, {
            params: {
                email: emailPseudo,
                page: 1,
                pageSize: 5
            }
        });
        if (response.data) {
            this.products = this.reverseArrayData(response.data);
        }
    },
    methods: {
        toggleForm() {
            this.showForm = !this.showForm;
        },
        reverseArrayData(arr) {
            return arr.reverse();
        },
        async getProductions() {
            const emailPseudo = this.email.split('@gmail.com')[0];
            const response = await axios.get(`${this.BACK_END_URL}/production/email`, {
                params: {
                    email: emailPseudo,
                    page: 1,
                    pageSize: 5
                }
            });
            return response.data;
        },
        getEmailFromToken() {
            const token = Cookies.get('auth_token');
            if (!token) return null;
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.user && payload.user.email ? payload.user.email : (payload.email || null);
            } catch (e) {
                return null;
            }
        },
        selectImage() {
            this.$refs.fileInput.click();
        },

        onFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                this.form.image = reader.result; // base64
            };
            reader.readAsDataURL(file);
        },
        async submitProduct() {
            const payload = {
                ...this.form,
                tags: this.form.tags, // mảng string
                createdBy: this.email
            };
            const response = await axios.post(
                `${this.BACK_END_URL}/production`,
                payload
            );
            if (response.status == 200) {
                alert("Tạo sản phẩm thành công");
                this.clearInputData();
            } else { alert("Lỗi tạo sản phẩm") }
        },
        clearInputData() { }
    }
};