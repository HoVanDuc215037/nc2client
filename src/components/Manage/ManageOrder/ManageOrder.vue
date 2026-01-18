<template>
  <div class="manage-order">
    <div id="section-header">Quản lý đơn hàng</div>
    <!-- MAP -->
    <div class="map-area" v-if="mapData">
      <div
        v-for="item in mapData.items"
        :key="item.id"
        :style="tableStyle(item)"
        class="table-item"
        style="display: flex; flex-direction: column; align-items: center"
        @click="openTable(item)"
      >
        <img :src="icons[item.type].icon" style="width: 60px" />
        <div
          v-if="item.type === 'table'"
          :class="{ pending: hasPendingOrder(item.meta.table) }"
        >
          <div
            class="table-label"
            :class="{ active: hasPendingOrder(item.meta.table) }"
          >
            Bàn {{ item.meta.table }}
          </div>
          <span
            v-if="hasPendingOrder(item.meta.table)"
            class="order-dot"
          ></span>
        </div>
      </div>
    </div>
    <!-- POPUP -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h3>Bàn {{ selectedOrder.table }}</h3>
        <p>Khách hàng: {{ selectedOrder.customer_name }}</p>
        <ul>
          <li
            v-for="(p, i) in selectedOrder.products"
            :key="i"
            class="order-item"
          >
            <img :src="p.image" />
            <div>
              <p>{{ p.name }}</p>
              <small>x {{ p.quantity }}</small>
              <div class="price">
                {{ (p.price * p.quantity).toLocaleString() }} VNĐ
              </div>
            </div>
          </li>
        </ul>
        <p class="total">
          Tổng tiền:
          {{ calculateTotal(selectedOrder.products).toLocaleString() }} VNĐ
        </p>
        <button class="done" @click="markOrderDone">Hoàn thành</button>
        <button class="close" @click="closePopup">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
import "./ManageOrder.css";
import ManageOrderLogic from "./ManageOrder.js";
export default {
  name: "ManageOrdersPage",
  mixins: [ManageOrderLogic],
};
</script>