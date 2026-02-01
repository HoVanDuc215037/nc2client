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
                image: null,
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

            selectedProduct: null,
            showDetailPopup: false,
        };
    },
    async created() {
        const token = Cookies.get('auth_token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.email = payload.user.email;
        this.loadProductions();
    },
    methods: {
        async loadProductions() {
            const emailPseudo = this.email.split('@gmail.com')[0];
            const response = await axios.get(`${this.BACK_END_URL}/production/email`, {
                params: {
                    email: emailPseudo,
                    page: 1,
                    pageSize: 5
                }
            });
            console.log(response.data);
            this.products = this.reverseArrayData(response.data);
        },
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
                this.form.image = reader.result;
            };
            reader.readAsDataURL(file);
        },
        async submitProduct() {
            const payload = {
                ...this.form,
                tags: this.form.tags,
                createdBy: this.email
            };
            const response = await axios.post(
                `${this.BACK_END_URL}/production`,
                payload
            );
            if (response.status == 200) {
                alert("Tạo sản phẩm thành công");
            } else { alert("Lỗi tạo sản phẩm") }
            this.showForm = !this.showForm;
            this.loadProductions();
        },
        openDetail(product) {
            this.selectedProduct = product;
            this.showDetailPopup = true;
        },

        closeDetail() {
            this.selectedProduct = null;
            this.showDetailPopup = false;
        },

        async deleteProduct(id) {
            if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
            try {
                await axios.post(`${this.BACK_END_URL}/production/delete`, {
                    _id: id
                });
                alert("Xóa sản phẩm thành công");
                this.products = this.products.filter(p => p._id !== id);
            } catch (err) {
                console.error(err);
                alert("Xóa sản phẩm thất bại");
            }
        },
    }
};