import Cookies from "js-cookie";
import axios from "axios";

export default {
    name: "AdminPage",
    data() {
        return {
            BACK_END_URL: "https://nc2server.onrender.com",
            accounts: [],
            search: "",
            defaultAvatar: "",
            owner: {},
            staff: {},
            showCreate: false,
            newAccount: {
                name: "",
                email: "",
            },
        };
    },

    async created() {
        await this.loadAccounts();
    },

    computed: {
        filteredAccounts() {
            return this.accounts.filter(a =>
                a.name.toLowerCase().includes(this.search.toLowerCase()) ||
                a.email.toLowerCase().includes(this.search.toLowerCase())
            );
        },
    },

    methods: {
        async loadAccounts() {
            const response = await axios.get(`${this.BACK_END_URL}/admin`);
            this.owner = response.data.Owners;
            this.staff = response.data.Staffs;
            console.log(this.owner);
        },

        openCreate() {
            this.showCreate = true;
        },

        closeCreate() {
            this.showCreate = false;
            this.newAccount = { name: "", email: "" };
        },

        async createAccount() {
            if (!this.newAccount.name || !this.newAccount.email) {
                alert("Vui lòng nhập đầy đủ tên và email");
                return;
            }
            this.newAccount.createdBy = "admin@gmail.com";
            this.newAccount.username = this.newAccount.email.split('@')[0];
            this.newAccount.avatar = this.defaultAvatar;
            this.newAccount.role = 'owner';
            this.newAccount.password = '';
            this.newAccount.email = this.newAccount.email.split('@')[0];
            try {
                await axios.post(`${this.BACK_END_URL}/admin/account`, {
                    account: this.newAccount,
                });

                this.closeCreate();
                await this.loadAccounts();
            } catch (err) {
                console.error(err);
                alert("Tạo tài khoản thất bại");
            }
        },


        updateRole(account) {
            console.log("Update role:", account._id, account.role);
        },

        editAccount(account) {
            console.log("Edit:", account);
        },

        async deleteAccount(id) {
            if (!confirm("Xóa tài khoản này?")) return;
            try {
                await axios.post(`${this.BACK_END_URL}/admin/account/delete`, {
                    _id: id,
                });

                await this.loadAccounts();
            } catch (err) {
                console.error(err);
                alert("Tạo tài khoản thất bại");
            }
        },
        signOut() {
            Cookies.remove('auth_token');
            this.token = '';
            this.$router.push('/login');
        }
    },
};