import axios from "axios";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

export default {
    name: "ManageOrder",

    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",
            ownerEmail: "",
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
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        this.ownerEmail = payload.user.email;
        //await this.loadRestaurant();
        const response = await axios.get(`${this.BACK_END_URL}/owner/restaurant`, {
            params: { email: this.ownerEmail },
        });
        if (response.data?.map) {
            this.mapData = response.data.map;
            console.log('map data', this.mapData);
        }
        this.initSocket();
    },

    methods: {
        initSocket() {
            //console.log(this.ownerEmail);
            const room = this.ownerEmail.split('@gmail.com');
            this.socket = io(this.BACK_END_URL, {

            });
            this.socket.on("connect", () => {
                this.socket.emit("join_owner", room);
            });
            this.socket.on("restaurant_order", (orders) => {
                console.log("Orders updated:", orders);
                // 🔎 tìm đúng bàn trên map
                const table = this.mapData.items.find(
                    item =>
                        item.type === "table" &&
                        item.meta.table === orders.table
                );
                console.log('found', table);
                if (table) {
                    table.meta.currentOrder = orders;
                    table.meta.orderStatus = "pending";
                }
            });
        },
        markOrderDone() {
            if (!this.selectedOrder) return;

            const table = this.mapData.items.find(
                i =>
                    i.type === "table" &&
                    i.meta.table === this.selectedOrder.table
            );
            console.log('done: ', table);
            if (table) {
                table.meta.currentOrder = null;
                table.meta.orderStatus = null;
            }

            // (tuỳ chọn) báo về BE
            // this.socket.emit("owner:order-done", {
            //     orderId: this.selectedOrder._id,
            // });

            this.closePopup();
        },
        async loadRestaurant() {
            const response = await axios.get(`${this.BACK_END_URL}/owner/restaurant`, {
                params: { email: this.ownerEmail },
            });
            if (response.data?.map) {
                this.mapData = response.data.map;
                //console.log(this.mapData);
            }
        },

        hasPendingOrder(tableNumber) {
            const table = this.mapData.items.find(
                i =>
                    i.type === "table" &&
                    i.meta.table === tableNumber
            );

            return table?.meta.orderStatus === "pending";
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
            if (item.type === 'table' && item.meta.orderStatus === "pending") {
                this.selectedOrder = item.meta.currentOrder;
                this.showPopup = true;
            }
        },
        closePopup() {
            this.showPopup = false;
            this.selectedOrder = null;
        },
        calculateTotal(products) {
            return products.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
            );
        },
    },
};