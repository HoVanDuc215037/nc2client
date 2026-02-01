import axios from "axios";
import Cookies from "js-cookie";
export default {
    name: "ManageStatisticPage",

    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",
            email: '',
            timeTypes: ["Ngày", "Tuần", "Tháng"],
            timeType: "Tuần",
            stat: {
                totalRevenue: 0,
                totalOrders: 0,
            },
        };
    },

    computed: {
        avgOrderValue() {
            if (this.stat.totalOrders === 0) return 0;
            return this.stat.totalRevenue / this.stat.totalOrders;
        },
    },

    async created() {
        const token = Cookies.get('auth_token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.email = payload.user.email;
    },

    mounted() {
        this.fetchStatistic();
    },

    methods: {
        changeTimeType(type) {
            this.timeType = type;
            this.fetchStatistic();
        },

        async fetchStatistic() {
            try {
                const res = await axios.get(
                    `${this.BACK_END_URL}/order/done?ownerEmail=${this.email}`
                );
                this.stat = res.data;
            } catch (err) {
                console.error("Lỗi lấy thống kê", err);
            }
        },
    },
};