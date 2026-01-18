import axios from "axios";
import Cookies from "js-cookie";

export default {
    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",

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
        if (!token) return this.$router.push("/login");

        const payload = JSON.parse(atob(token.split(".")[1]));
        this.role = payload.user.role;
        this.account.email = payload.user.email;
        this.accountEmail = payload.user.email;
        this.account.name = payload.user.name;
        this.accountName = payload.user.name;
        //console.log('payload: ', payload.user);
        await this.getProfile();
        //await this.getRelatingInfor();
    },

    methods: {
        async getProfile() {
            const requestEmail = this.accountEmail.split('@gmail.com')[0];
            const res = await axios.get(`${this.BACK_END_URL}/profile`, {
                params: { email: requestEmail },
            });
            this.accountAvatar = res.data.account[0].avatar;
            this.restaurantImage = res.data.restaurant[0].image;
            this.restaurantName = res.data.restaurant[0].name;
            this.restaurantLocation = res.data.restaurant[0].textLocation;
        },

        toggleEdit() {
            if (this.isEdit) this.saveProfile();
            this.isEdit = !this.isEdit;
        },

        closeEdit() {
            this.isEdit = !this.isEdit;
        },

        async saveProfile() {
            await axios.put(`${this.BACK_END_URL}/account/profile`, {
                ...this.account,
            });
            alert("Cập nhật thành công");
        },

        onAvatarChange(e) {
            const file = e.target.files[0];
            this.toBase64(file, base64 => {
                this.previewAvatar = base64;
                this.account.avatar = base64;
            });
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