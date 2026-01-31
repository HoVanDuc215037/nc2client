<template>
  <div class="statistic-page">
    <div class="header">Thống kê</div>
    <div class="filter">
      <button
        v-for="t in timeTypes"
        :key="t"
        :class="{ active: timeType === t }"
        @click="changeTimeType(t)"
      >
        {{ t }}
      </button>
    </div>
    <div class="card revenue">
      <div class="label">Tổng doanh thu</div>
      <div class="value">0</div>
    </div>
    <div class="cards">
      <div class="card">
        <div class="label">Đơn hàng</div>
        <div class="value">{{ stat.length }}</div>
      </div>
      <div class="card">
        <div class="label">Giá trị TB / đơn</div>
        <div class="value">0</div>
      </div>
    </div>
  </div>
</template>
<script>
import "./ManageStatistic.css";
import ManageStatisticLogic from "./ManageStatistic.js";

export default {
  name: "ManageStatisticPage",
  mixins: [ManageStatisticLogic],
};
</script>