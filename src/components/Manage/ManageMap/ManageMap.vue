<template>
  <div class="manage-map">
    <div id="section-header">
      {{ activeTab === "map" ? "Bản đồ cửa hàng" : "Thông tin cửa hàng" }}
    </div>
    <div class="tab-header">
      <button
        :class="{ active: activeTab === 'info' }"
        @click="activeTab = 'info'"
        style="width: max-content"
      >
        🏪 Thông tin cửa hàng
      </button>

      <button
        :disabled="!haveRestaurant"
        :class="{ active: activeTab === 'map' }"
        @click="activeTab = 'map'"
        style="width: max-content"
      >
        🗺️ Bản đồ
      </button>
    </div>
    <div v-if="activeTab === 'info'" class="restaurant-form">
      <h3>Thông tin cửa hàng</h3>

      <div class="form-group">
        <label>Tên cửa hàng</label>
        <input v-model="restaurant.name" type="text" />
      </div>

      <div class="form-group">
        <label>Vị trí</label>
        <input v-model="restaurant.textLocation" type="text" />
      </div>

      <div class="form-group">
        <label>Ảnh cửa hàng</label>
        <div style="display: flex; flex-direction: row; align-items: center">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onFileChange"
          />
          <button
            class="button"
            id="add-picture"
            @click="selectImage"
            style="width: max-content"
          >
            Chọn ảnh
          </button>
          <div
            v-if="restaurant.image"
            class="preview"
            style="border: 2px dashed #aaa; border-radius: 5px"
          >
            <img :src="restaurant.image" alt="preview" />
          </div>
        </div>
      </div>

      <button @click="saveRestaurant" id="save">💾 Lưu</button>
    </div>
    <div v-if="activeTab === 'map'">
      <div style="width: 90%; flex: 1">
        <div class="toolbar">
          <div class="list-buttons" style="display: flex">
            <div v-if="editMode" style="display: flex">
              <button class="toolbar-buttons" @click="undo">↶ Undo</button>
              <button class="toolbar-buttons" @click="redo">↷ Redo</button>
              <button
                class="toolbar-buttons"
                @click="deleteSelected"
                :disabled="!selectedItemId"
              >
                ❌ Xóa
              </button>
              <button class="save" @click="saveMap" style="width: max-content">
                💾 Lưu
              </button>
            </div>
          </div>
          <button
            v-if="haveMap && !editMode"
            @click="editMode = true"
            style="width: max-content"
          >
            Sửa
          </button>
          <button v-if="!editMode" class="qr-btn" @click="createTableQR">
            Tạo QR bàn
          </button>
        </div>
        <div style="display: flex; position: relative">
          <div v-if="editMode" class="add-wrapper">
            <button class="main-btn">➕</button>
            <div class="add-menu">
              <button class="add-menu-btn" @click="addItem('table')">
                Bàn
              </button>
              <button class="add-menu-btn" @click="addItem('entrance')">
                Cửa
              </button>
              <button class="add-menu-btn" @click="addItem('kitchen')">
                Bếp
              </button>
            </div>
          </div>
          <div class="map-canvas" ref="canvas" @mousedown.self="clearSelection">
            <div
              v-for="item in items"
              :key="item.id"
              class="map-item"
              :class="[item.type, { selected: item.id === selectedItemId }]"
              :style="itemStyle(item)"
              @mousedown="onItemMouseDown(item, $event)"
              @click.stop="selectItem(item)"
            >
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <img :src="icons[item.type].icon" style="width: 60px" />
                <div v-if="item.type === 'table'" class="table-label">
                  Bàn {{ item.meta.table }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./ManageMap.css";
import ManageMapLogic from "./ManageMap.js";

export default {
  name: "ManageMapPage",
  mixins: [ManageMapLogic],
};
</script>