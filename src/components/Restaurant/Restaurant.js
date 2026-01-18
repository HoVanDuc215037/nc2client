import { io } from "socket.io-client";
import axios from 'axios';

export default {
    name: "RestaurantPage",
    data() {
        return {
            products: [],
            cart: [],
            requestStatus: false,
            socket: null,
            tableNumber: null,
            customerName: "",
            customerPhone: "",
            searchQuery: "", //lưu chuỗi tìm kiếm
            ownerId: "",
            BACK_END_URL: "https://nc2server.onrender.com",
            FRONT_END_URL: "http://localhost:8080",
            popupStep: null,
            order_user_token: {
                name: '',
                phone: ''
            },
            ownerEmail: '',
        };
    },
    async created() {
        this.ownerEmail = this.$route.query.ownerEmail;
        //console.log(this.$route.query);
        const encodedTable =
            this.$route.query
                .d4fc4a78d3706edccafb665a8b2fdd9309e82c78625bb0f2b8e7bb9e1c4d21c;
        if (encodedTable) {
            this.tableNumber = atob(encodedTable);
        }
        this.loadProducts();
        this.initSocket();
    },
    computed: {
        filteredProducts() {
            if (!this.searchQuery) {
                return this.products;
            }
            return this.products.filter((product) => {
                const searchQueryLower = this.searchQuery.toLowerCase();
                return (
                    product.name.toLowerCase().includes(searchQueryLower) ||
                    product.description.toLowerCase().includes(searchQueryLower) ||
                    product.price.toString().includes(searchQueryLower)
                );
            });
        },
    },
    methods: {
        initSocket() {
            this.socket = io(this.BACK_END_URL, {
                transports: ["websocket"],
            });
        },
        async loadProducts() {
            try {
                const email = this.$route.query.e;
                const response = await axios.get(`${this.BACK_END_URL}/production/email`, {
                    params: {
                        email: email,
                        page: 1,
                        pageSize: 5
                    }
                });
                this.products = await response.data;
            } catch (err) {
                console.error("Không tải được sản phẩm", err);
            }
        },
        submitRequest() {
            if (!this.customerName || !this.customerPhone) {
                alert("Vui lòng nhập tên và số điện thoại");
                return;
            }
            localStorage.setItem(
                "order_user_token",
                JSON.stringify({
                    name: this.customerName,
                    phone: this.customerPhone,
                })
            );
            const orderData = {
                _id: Date.now(),
                ownerEmail: this.$route.query.e,
                table: Number(this.$route.query.t),
                customer_name: this.customerName,
                customer_phone: this.customerPhone,
                products: this.cart,
                total: this.calculateTotal(this.cart),
                status: "pending",
                createdAt: new Date(),
            };
            this.socket.emit("customer_order", orderData);
            console.log("ORDER SENT:", orderData);
            this.cart = [];
            this.closeAllPopup();
            alert('Tạo đơn hàng thành công');
            this.closeAllPopup();
        },
        isInCart(productId) {
            return this.cart.some(item => item._id === productId);
        },
        hasPendingOrder(tableNumber) {
            return this.tempOrders.some(
                o => o.table === tableNumber
            );
        },
        openTable(item) {
            this.selectedOrder = this.tempOrders.find(
                o => o.table === item.meta.tableNumber
            );
            this.showPopup = !!this.selectedOrder;
        },
        addToCart(product) {
            this.cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                //image: product.image,
                quantity: 1,
            });
        },
        removeFromCart(index) {
            this.cart.splice(index, 1);
            if (this.cart.length === 0) {
                this.closeAllPopup();
            }
        },
        showPopup() {
            this.isPopupVisible = true;
        },
        hidePopup() {
            this.isPopupVisible = false;
        },
        openCartPopup() {
            this.popupStep = 'cart';
        },
        goToConfirm() {
            this.loadUserToken();
            this.popupStep = 'confirm';
        },
        loadUserToken() {
            const token = localStorage.getItem("order_user_token");
            if (token) {
                try {
                    const data = JSON.parse(token);
                    this.customerName = data.name || "";
                    this.customerPhone = data.phone || "";
                } catch (e) {
                    localStorage.removeItem("order_user_token");
                }
            }
        },
        closeAllPopup() {
            this.popupStep = null;
        },
        calculateTotal(cart) {
            return cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
        },
        goTohome() {
            this.$router.push("/");
        },
        getProductImage(productId) {
            const product = this.products.find(p => p._id === productId);
            return product ? product.image : '';
        },
    },
};