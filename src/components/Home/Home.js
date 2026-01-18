export default {
    name: "HomePage",
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: "Pizza",
                    description: "Món ăn Ý ngon tuyệt",
                    price: 120000,
                },
                {
                    id: 2,
                    name: "Burger",
                    description: "Burger kẹp thịt bò thơm ngon",
                    price: 80000,
                },
                {
                    id: 3,
                    name: "Salad",
                    description: "Salad rau củ tươi mát",
                    price: 60000,
                },
                {
                    id: 4,
                    name: "Lẩu Thái",
                    description: "Món lẩu đậm đà vị Thái",
                    price: 200000,
                },
                {
                    id: 5,
                    name: "Nem nướng",
                    description: "Nem nướng ngon xuất sắc",
                    price: 75000,
                },
            ],
            searchQuery: "",
            isPopupVisible: false, // Điều khiển hiển thị popup
            maxTableCount: 10, // Số lượng bàn tối đa
        };
    },
    computed: {
        filteredProducts() {
            if (!this.searchQuery) {
                return this.products;
            }
            const query = this.searchQuery.toLowerCase();
            return this.products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.price.toString().includes(query)
            );
        },
    },
    methods: {
        showPopup() {
            this.isPopupVisible = true;
        },
        hidePopup() {
            this.isPopupVisible = false;
        },
        proceedToOrder(tableNumber) {
            // Mã hóa số bàn thành Base64
            const encodedTable = btoa(tableNumber.toString());

            // Chuyển hướng đến trang order với query
            this.$router.push({
                path: "/order",
                query: {
                    d4fc4a78d3706edccafb665a8b2fdd9309e82c78625bb0f2b8e7bb9e1c4d21c:
                        encodedTable,
                },
            });
        },
        goToLogin() {
            this.$router.push("/login");
        },
    },
};