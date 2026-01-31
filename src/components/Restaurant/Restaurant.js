import { io } from "socket.io-client";
import axios from 'axios';

export default {
    name: "RestaurantPage",
    data() {
        return {
            BACK_END_URL: "http://localhost:3000",
            products: [],
            cart: [],
            requestStatus: false,
            socket: null,
            tableNumber: null,
            customerName: "",
            customerPhone: "",
            searchQuery: "",
            ownerId: "",
            popupStep: null,
            order_user_token: {
                name: '',
                phone: ''
            },
            ownerEmail: '',
            isFilterPopup: false,
            selectedTags: [],
            selectedProduct: null,
            showDetailPopup: false,
        };
    },
    async created() {
        this.ownerEmail = this.$route.query.ownerEmail;
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
            let result = this.products;
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.price.toString().includes(q)
                );
            }
            if (this.selectedTags.length > 0) {
                result = result.filter(product =>
                    this.selectedTags.every(tag =>
                        product.tags?.includes(tag)
                    )
                );
            }
            return result;
        },
        allTags() {
            const tags = new Set();
            this.products.forEach(p => {
                p.tags?.forEach(t => tags.add(t));
            });
            return Array.from(tags);
        }
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
                        email: email
                    }
                });
                console.log(response.data);
                this.products = await response.data;
            } catch (err) {
                console.error("Không tải được sản phẩm", err);
            }
        },
        async submitRequest() {
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
                owner_email: this.$route.query.e,
                table: Number(this.$route.query.t),
                customer_infor: this.customerName + "_" + this.customerPhone,
                productions: this.cart,
                total: this.calculateTotal(this.cart),
                status: "pending",
                createdAt: new Date(),
            };
            this.socket.emit("customer_order", orderData);
            await axios.post(`${this.BACK_END_URL}/order/`, orderData);
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
        openFilterPopup() {
            this.isFilterPopup = true;
        },
        closeFilterPopup() {
            this.isFilterPopup = false;
        },
        toggleTag(tag) {
            if (this.selectedTags.includes(tag)) {
                this.selectedTags = this.selectedTags.filter(t => t !== tag);
            } else {
                this.selectedTags.push(tag);
            }
        },
        resetFilter() {
            this.selectedTags = [];
            this.isFilterPopup = false;
        },
        openDetail(product) {
            this.selectedProduct = product;
            this.showDetailPopup = true;
        },

        closeDetail() {
            this.selectedProduct = null;
            this.showDetailPopup = false;
        },
    },
};