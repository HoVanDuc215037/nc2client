import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import QRCode from 'qrcode';

export default {
    data() {
        return {
            FRONT_END_URL: "http://localhost:8080",
            items: [],
            floors: [1],
            currentFloor: 1,
            dragging: null,
            offsetX: 0,
            offsetY: 0,
            selectedItemId: null,
            history: [],
            historyIndex: -1,
            clipboard: null,
            haveMap: false,
            haveRestaurant: false,
            editMode: false,
            tableCounter: 1,
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
            activeTab: 'info',
            restaurant_id: '',
            restaurant: {
                name: '',
                createdBy: '',
                image: null,
                textLocation: '',
                map: {},
            },
            token: {},
            BACK_END_URL: "http://localhost:3000",
            email: '',
            showQRPopup: false,
            selectedTable: null,
            qrImage: null,
        }
    },

    computed: {
        filteredItems() {
            return this.items.filter(i => i.floor === this.currentFloor)
        }
    },

    mounted() {
        window.addEventListener('mousemove', this.onMove)
        window.addEventListener('mouseup', this.stopDrag)
        window.addEventListener('keydown', this.handleKeydown)
    },

    beforeUnmount() {
        window.removeEventListener('mousemove', this.onMove)
        window.removeEventListener('mouseup', this.stopDrag)
        window.removeEventListener('keydown', this.handleKeydown)
    },
    async created() {
        this.token = Cookies.get('auth_token');
        const payload = jwtDecode(this.token);
        this.restaurant.haveRestaurant = payload.user.haveRestaurant;
        if (!this.restaurant.haveRestaurant) this.activeTab = 'info'
        else this.activeTab = 'map';
        this.restaurant.createdBy = payload.user.email;
        if (!this.haveMap) this.editMode = true;
        this.email = payload.user.email;

        await this.loadRestaurant()
    },
    methods: {
        async loadRestaurant() {
            try {
                const response = await axios.get(`${this.BACK_END_URL}/owner/restaurant`, {
                    params: {
                        email: this.email
                    }
                });
                if (response.data) {
                    this.restaurant = {
                        name: response.data.name,
                        textLocation: response.data.textLocation,
                        image: response.data.image,
                        createdBy: response.data.createdBy,
                        map: response.data.map
                    }
                    this.restaurant_id = response.data._id
                    this.haveRestaurant = true
                    this.activeTab = 'map'
                }
                if (response.data.map && response.data.map.items?.length) {
                    this.haveMap = true
                    this.items = response.data.map.items
                    this.floors = response.data.map.floors
                    this.editMode = false
                    this.syncTableCounter()
                    this.activeTab = 'map'
                } else {
                    this.haveMap = false
                    this.editMode = true
                    this.activeTab = 'map'
                }
            } catch (err) {
                console.error(err)
            }
        },
        syncTableCounter() {
            const tables = this.items.filter(i => i.type === 'table')
            const max = tables.reduce(
                (m, t) => Math.max(m, t.meta?.table || 0),
                0
            )
            this.tableCounter = max + 1
        },
        switchTab(e, tab) {
            this.activeTab = tab;
            document.querySelectorAll('.tab-header-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        },
        onFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                this.restaurant.image = reader.result;
            };
            reader.readAsDataURL(file);
        },
        selectImage() {
            this.$refs.fileInput.click();
        },
        async saveRestaurant() {
            if (!this.haveRestaurant) {
                await axios.post(`${this.BACK_END_URL}/owner/restaurant`, {
                    restaurant: this.restaurant,
                    email: this.email
                });
                this.haveRestaurant = true
            } else {
                await axios.put(`${this.BACK_END_URL}/owner/restaurant`, {
                    _id: this.restaurant_id,
                    data: this.restaurant,
                });
            }
            this.activeTab = 'map'
        },
        addItem(type) {
            if (!this.editMode) return
            this.saveHistory()
            this.items.push(this.createItem(type))
        },
        createItem(type) {
            const item = {
                id: Date.now(),
                type,
                floor: this.currentFloor,
                x: 50,
                y: 50,
                meta: {}
            }

            if (type === 'table') {
                item.meta.table = this.tableCounter++
            }

            return item
        },
        async selectItem(item) {
            if (this.editMode) this.selectedItemId = item.id;
            else {
                if (this.editMode) return;
                if (item.type !== "table") return;
                const emailWithoutAt = this.email.split("@")[0];
                const tableNumber = item.meta.table;

                const qrContent =
                    `${this.FRONT_END_URL}/restaurant/?e=${emailWithoutAt}&t=${tableNumber}`;

                this.qrImage = await QRCode.toDataURL(qrContent, {
                    width: 300,
                    margin: 2,
                });

                this.selectedTable = tableNumber;
                this.showQRPopup = true;
            }
        },
        clearSelection() {
            this.selectedItemId = null
        },
        onItemMouseDown(item, e) {
            if (!this.editMode) return
            this.selectItem(item)
            this.dragging = item
            this.offsetX = e.offsetX
            this.offsetY = e.offsetY
            this.saveHistory()
        },
        itemStyle(item) {
            return {
                left: item.x + 'px',
                top: item.y + 'px',
                position: 'absolute'
            }
        },
        onMove(e) {
            if (!this.dragging) return
            const rect = this.$refs.canvas.getBoundingClientRect()
            this.dragging.x = e.clientX - rect.left - this.offsetX
            this.dragging.y = e.clientY - rect.top - this.offsetY
        },
        stopDrag() {
            this.dragging = null
        },
        handleKeydown(e) {
            if (!this.editMode) return
            const item = this.items.find(i => i.id === this.selectedItemId)
            if (!item) return
            if (['Delete', 'Backspace'].includes(e.key)) {
                this.deleteSelected()
                return
            }
            if (e.ctrlKey && e.key === 'c') this.clipboard = { ...item }
            if (e.ctrlKey && e.key === 'v') this.paste()
            if (e.ctrlKey && e.key === 'd') this.paste()
            switch (e.key) {
                case 'ArrowLeft': item.x -= 1; break
                case 'ArrowRight': item.x += 1; break
                case 'ArrowUp': item.y -= 1; break
                case 'ArrowDown': item.y += 1; break
            }
        },
        deleteSelected() {
            if (!this.selectedItemId) return
            this.saveHistory()
            this.items = this.items.filter(i => i.id !== this.selectedItemId)
            this.selectedItemId = null
        },
        paste() {
            if (!this.clipboard) return
            this.saveHistory()
            const copy = {
                ...this.clipboard,
                id: Date.now(),
                x: this.clipboard.x + 10,
                y: this.clipboard.y + 10
            }
            this.items.push(copy)
            this.selectedItemId = copy.id
        },
        saveHistory() {
            this.history = this.history.slice(0, this.historyIndex + 1)
            this.history.push(JSON.stringify(this.items))
            this.historyIndex++
        },
        undo() {
            if (this.historyIndex <= 0) return
            this.historyIndex--
            this.items = JSON.parse(this.history[this.historyIndex])
        },
        redo() {
            if (this.historyIndex >= this.history.length - 1) return
            this.historyIndex++
            this.items = JSON.parse(this.history[this.historyIndex])
        },
        addFloor() {
            const next = Math.max(...this.floors) + 1
            this.floors.push(next)
            this.currentFloor = next
        },
        deleteCurrentFloor() {
            if (this.currentFloor === 1) return
            this.saveHistory()
            this.items = this.items.filter(i => i.floor !== this.currentFloor)
            this.floors = this.floors.filter(f => f !== this.currentFloor)
            this.currentFloor = Math.min(...this.floors)
        },
        async saveMap() {
            this.restaurant.map = {
                items: this.items,
                floors: this.floors
            };
            if (!this.restaurant.map) { alert('Chưa tạo map'); return; }
            await axios.post(`${this.BACK_END_URL}/owner/map`, {
                _id: this.restaurant_id,
                map: this.restaurant.map,
                email: this.email
            })
            this.haveMap = true
            this.editMode = false
        },
        async createTableQR() {
            const tables = this.items.filter(i => i.type === "table");
            if (!tables.length) {
                alert("Chưa tạo bàn nào!");
                return;
            }
            const emailWithoutAt = this.email.split("@")[0];
            for (const table of tables) {
                const tableNumber = table.meta.table;

                const qrContent =
                    `${this.FRONT_END_URL}/restaurant/?e=${emailWithoutAt}&t=${tableNumber}`;
                const dataUrl = await QRCode.toDataURL(qrContent, {
                    width: 300,
                    margin: 2,
                });
                const a = document.createElement("a");
                a.href = dataUrl;
                a.download = `QR_BAN_${tableNumber}.png`;
                a.click();
            }
        },
        async handleTableClick(item) {
            if (this.editMode) return;
            if (item.type !== "table") return;
            const emailWithoutAt = this.email.split("@")[0];
            const tableNumber = item.meta.table;

            const qrContent =
                `${this.FRONT_END_URL}/restaurant/?e=${emailWithoutAt}&t=${tableNumber}`;

            this.qrImage = await QRCode.toDataURL(qrContent, {
                width: 300,
                margin: 2,
            });

            this.selectedTable = tableNumber;
            this.showQRPopup = true;
        },
        downloadSingleQR() {
            if (!this.qrImage || !this.selectedTable) return;

            const a = document.createElement("a");
            a.href = this.qrImage;
            a.download = `QR_BAN_${this.selectedTable}.png`;
            a.click();
        },
    }
}