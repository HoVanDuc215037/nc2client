import Cookies from 'js-cookie';
import axios from 'axios';

export default {
    name: "ManageStaff",

    data() {
        return {
            BACK_END_URL: "http://localhost:3000",
            defaultAvatar: require('@/assets/user.png'),
            email: '',
            staffs: [],
            showPopup: false,
            newStaff: {
                email: "",
                username: "",
                password: "",
                name: "",
                role: "",
                avatar: null,
                createdBy: "",
                haveRestaurant: false,
                haveMap: false,
            },
        };
    },

    async created() {
        const token = Cookies.get('auth_token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.email = payload.user.email;
        this.loadStaffs();
    },

    methods: {
        async loadStaffs() {
            const res = await axios.get(`${this.BACK_END_URL}/owner/accounts`, {
                params: {
                    ownerEmail: this.email.split('@gmail.com')[0],
                }
            });
            this.staffs = res.data;
        },

        async createStaff() {
            if (!this.newStaff.name || !this.newStaff.email.split) {
                alert("Vui lòng nhập đầy đủ thông tin");
                return;
            }
            this.newStaff.createdBy = this.email;
            this.newStaff.username = this.newStaff.email.split('@')[0];
            this.newStaff.avatar = this.defaultAvatar;
            this.newStaff.role = 'staff';
            this.newStaff.password = '';
            this.newStaff.email = this.newStaff.email.split('@')[0];
            const response = await axios.post(`${this.BACK_END_URL}/owner/account`, {
                account: this.newStaff,
            });
            if (response.data.result) this.staffs.push({ ...this.newStaff, });

            this.closePopup();
        },

        async deleteStaff(id) {
            if (!confirm("Xóa nhân viên này?")) return;
            await axios.delete(`${this.BACK_END_URL}/owner/account`, {
                data: { _id: id },
            });
            this.staffs = this.staffs.filter(s => s._id !== id);
        },

        closePopup() {
            this.showPopup = false;
            this.newStaff = { name: "", email: "" };
        },
    },
}