import Cookies from 'js-cookie';
import ManageOrdersPage from './ManageOrder/ManageOrder.vue';
import ManageProductionPage from './ManageProduction/ManageProduction.vue';
import ManageStatisticPage from './ManageStatistic/ManageStatistic.vue';
import ManageMapPage from './ManageMap/ManageMap.vue';
import ProfilePage from './Profile/Profile.vue';
import ManageStaffPage from './ManageStaff/ManageStaff.vue';
import axios from 'axios';

export default {
    name: 'ManagePage',
    components: {
        ManageOrdersPage,
        ManageProductionPage,
        ManageStatisticPage,
        ManageMapPage,
        ProfilePage,
        ManageStaffPage,
    },
    data() {
        return {
            token: '',
            activeTab: 'orders',
            role: '',
            email: '',
            name: '',
            avatar: null,
            user: {},
            BACK_END_URL: "https://nc2server.onrender.com",
            defaultAvatar: require('@/assets/user.png'),
            openMenu: null
        };
    },
    beforeCreate() {
    },
    async created() {
        this.token = Cookies.get('auth_token');
        if (!this.token) { this.$router.push('/login'); return; }
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        //console.log(payload.user);
        const haveMap = payload.user.haveMap;
        if (haveMap == false) this.activeTab = 'map';
        this.email = payload.user.email;
        this.role = payload.user.role;
        this.name = payload.user.name;
        const requestEmail = this.email.split('@gmail.com')[0];
        try {
            const response = await axios.get(`${this.BACK_END_URL}/detail`, {
                params: {
                    email: requestEmail,
                }
            });
            if (!response) { this.avatar = ''; return; }
            if (!response.data.account[0].avatar) this.avatar = this.defaultAvatar;
            else this.avatar = response.data.account[0].avatar;
        } catch (error) {
            console.error('Error fetching user data: ', error);
        }
    },
    methods: {
        go(tab, e) {
            this.activeTab = tab;
            document.querySelectorAll('.dashboard-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        },
        logout() {
            Cookies.remove('auth_token');
            this.token = '';
            this.$router.push('/login');
        },
    },
};
