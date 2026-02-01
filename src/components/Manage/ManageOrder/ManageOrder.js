import axios from "axios";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

export default {
    name: "ManageOrder",

    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",
            room: "",
            restaurant_products: [],
            ownerEmail: "",
            email: "",
            role: "",
            createdBy: "",
            mapData: null,
            tempOrders: [],
            socket: null,
            showPopup: false,
            selectedOrder: null,
            icons: {
                table: {
                    icon: require('@/assets/table.png'),
                },
                entrance: {
                    icon: require('@/assets/door.png'),
                },
                kitchen: {
                    icon: require('@/assets/kitchen.png'),
                }
            },
        };
    },
    computed: {
        tableItems() {
            if (!this.mapData?.items) return [];
            return this.mapData.items.filter(i => i.type === "table");
        },
    },
    async created() {
        this.token = Cookies.get('auth_token');
        const payload = jwtDecode(this.token);
        this.email = payload.user.email;
        this.role = payload.user.role;
        if (this.role === 'owner') this.ownerEmail = this.email;
        else this.ownerEmail = payload.user.createdBy;
        const response = await axios.get(`${this.BACK_END_URL}/owner/restaurant`, {
            params: { email: this.ownerEmail },
        });
        if (response.data?.map) {
            this.mapData = response.data.map;
        }

        const response_product = await axios.get(`${this.BACK_END_URL}/production/email`, {
            params: {
                email: this.ownerEmail.split('@')[0],
            }
        });
        this.restaurant_products = response_product.data;
        this.initSocket();
        await this.loadPendingOrder();
    },
    methods: {
        initSocket() {
            this.room = this.ownerEmail.split('@gmail.com');
            this.socket = io(this.BACK_END_URL, {});
            this.socket.on("connect", () => {
                this.socket.emit("join_owner", this.room);
            });
            this.socket.on("restaurant_order", (order) => {
                const table = this.mapData.items.find(
                    i => i.type === "table" && i.meta.table === order.table
                );
                if (table) {
                    table.meta.currentOrder = order;
                }
            });
            this.socket.on("order_done", (tableID) => {
                console.log(this.mapData.items);
                const table = this.mapData.items.find(
                    i => i.type === 'table' && i.meta.table == tableID
                );

                if (table) {
                    table.meta.currentOrder = null;
                }
            });
        },
        async markOrderDone(tableNumber) {
            if (!this.selectedOrder) return;
            const table = this.mapData.items.find(
                i => i.type === "table" && i.meta.table === tableNumber
            );
            if (table) {
                table.meta.currentOrder = null;
            }
            await axios.post(`${this.BACK_END_URL}/order/update`, {
                orderId: this.selectedOrder._id
            });
            this.socket.emit("update_order_status", {
                room: this.room,
                order: this.selectedOrder,
            });
            this.closePopup();
        },
        async loadRestaurant() {
            const response = await axios.get(`${this.BACK_END_URL}/owner/restaurant`, {
                params: { email: this.ownerEmail },
            });
            if (response.data?.map) {
                this.mapData = response.data.map;
            }
        },
        hasOrder(tableNumber) {
            const table = this.mapData.items.find(
                i => i.type === "table" && i.meta.table === tableNumber
            );
            return !!table?.meta.currentOrder;
        },
        getProductImage(product) {
            const target_product = this.restaurant_products.find(p => p._id === product._id);
            return target_product.image;
        },
        tableStyle(item) {
            let width = '';
            let height = '';
            if (item.type === 'table') { width = '90px'; height = '80px'; }
            if (item.type === 'kitchen') { width = '120px'; height = '80px'; }
            if (item.type === 'entrance') { width = '55px'; height = '80px'; }
            return {
                left: item.x + "px",
                top: item.y + "px",
                width: width,
                height: height,
            };
        },
        openTable(item) {
            if (item.type === "table" && item.meta.currentOrder) {
                this.selectedOrder = item.meta.currentOrder;
                this.showPopup = true;
            }
        },
        closePopup() {
            this.showPopup = false;
            this.selectedOrder = null;
        },
        calculateTotal(productions) {
            return productions.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
            );
        },
        async loadPendingOrder() {
            const response = await axios.get(`${this.BACK_END_URL}/order/pending`, {
                params: {
                    ownerEmail: this.ownerEmail.split('@')[0],
                }
            });
            const orders = response.data;
            this.mapData.items.forEach(item => {
                if (item.type === "table") {
                    item.meta.order = [];
                }
            });
            orders.forEach(order => {
                const table = this.mapData.items.find(
                    i => i.type === "table" && i.meta.table === order.table
                );
                if (table) {
                    table.meta.currentOrder = order;
                }
            });
        }
    },
};