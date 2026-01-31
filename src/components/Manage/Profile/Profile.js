import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

export default {
    data() {
        return {
            BACK_END_URL: "http://localhost:3000",

            role: '',
            isEdit: false,

            previewAvatar: null,
            previewRestaurant: null,

            account: {
                avatar: null,
                name: '',
                email: '',
            },
            accountAvatar: null,
            accountName: '',
            accountEmail: '',

            restaurant: {
                name: '',
                image: null,
                textLocation: '',
                ownerName: '',
            },
            restaurantName: '',
            restaurantImage: null,
            restaurantLocation: '',
            restaurantOwnerName: '',
        };
    },

    async created() {
        const token = Cookies.get("auth_token");
        if (!token) { this.$router.push("/login"); return; }

        const payload = jwtDecode(token);
        this.role = payload.user.role;
        this.account.email = payload.user.email;
        this.accountEmail = payload.user.email;
        this.account.name = payload.user.name;
        this.accountName = payload.user.name;
        await this.getProfile();
    },

    methods: {
        async getProfile() {
            const requestEmail = this.accountEmail.split('@gmail.com')[0];
            const res = await axios.get(`${this.BACK_END_URL}/profile`, {
                params: { email: requestEmail },
            });

            const acc = res.data.account[0];
            const resRestaurant = res.data.restaurant[0];

            this.accountAvatar = acc.avatar;
            this.account.avatar = acc.avatar;

            this.restaurantImage = resRestaurant.image;
            this.restaurantName = resRestaurant.name;
            this.restaurantLocation = resRestaurant.textLocation;
        },

        triggerAvatarInput() {
            this.$refs.avatarInput.click();
        },

        toggleEdit() {
            if (this.isEdit) return;
            this.account.avatar = this.accountAvatar;

            this.isEdit = true;
        },

        closeEdit() {
            this.previewAvatar = null;
            this.isEdit = false;
        },
        async saveProfile() {
            await axios.post(`${this.BACK_END_URL}/update-profile`, {
                email: this.accountEmail.split('@')[0],
                data: {
                    name: this.accountName,
                    avatar: this.account.avatar,
                },
            });
            this.accountAvatar = this.account.avatar;
            this.previewAvatar = null;
            this.isEdit = false;

            alert("Cập nhật thành công");
            this.getProfile();
        },

        onAvatarChange(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                this.previewAvatar = reader.result;
                this.account.avatar = reader.result;
            };
            reader.readAsDataURL(file);
        },


        onRestaurantImageChange(e) {
            const file = e.target.files[0];
            this.toBase64(file, base64 => {
                this.previewRestaurant = base64;
                this.restaurant.image = base64;
            });
        },

        toBase64(file, cb) {
            const reader = new FileReader();
            reader.onload = () => cb(reader.result);
            reader.readAsDataURL(file);
        },
    },
};