<template>
  <div class="manage-production-root">
    <div id="section-header">Danh sách sản phẩm</div>
    <div class="controls">
      <button class="btn" @click="toggleForm">
        {{ showForm ? "Hủy" : "Thêm" }}
      </button>
      <button class="btn" @click="fetchProducts">Tải lại</button>
    </div>

    <div id="production-infor-form" v-if="showForm" class="form-wrap">
      <h3>Thêm sản phẩm</h3>
      <div class="form-row">
        <label>Name</label>
        <input v-model="form.name" type="text" />
      </div>

      <div class="form-row">
        <label>Description</label>
        <textarea v-model="form.description"></textarea>
      </div>

      <div class="form-row">
        <label>Price</label>
        <input v-model.number="form.price" type="number" min="0" />
      </div>

      <div class="form-row">
        <label>Sale</label>
        <input v-model.number="form.sale" type="number" min="0" />
      </div>

      <div class="form-row">
        <label>Tags</label>

        <div class="tags-list">
          <label v-for="tag in productionTags" :key="tag" class="tag-item">
            <input type="checkbox" :value="tag" v-model="form.tags" />
            {{ tag }}
          </label>
        </div>
      </div>

      <div class="form-row" style="margin-top: 50px">
        <label>Image</label>

        <!-- input file ẩn -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onFileChange"
        />

        <!-- nút bấm -->
        <button class="btn" id="add-picture" @click="selectImage">
          Chọn ảnh
        </button>

        <!-- preview -->
        <div
          v-if="form.image"
          class="preview"
          style="padding: 10px; border: 2px dashed gray; border-radius: 5px"
        >
          <img :src="form.image" alt="preview" />
        </div>
      </div>

      <div class="form-actions">
        <button class="btn primary" @click="submitProduct">Lưu</button>
      </div>
    </div>
    <div class="list-item">
      <div v-for="product in products" :key="product._id" class="product-item">
        <img
          :src="product.image"
          alt="product"
          class="product-image"
          style="border: 2px dashed gray"
        />
        <h3>{{ product.name }}</h3>
        <p class="price">{{ product.price.toLocaleString() }} VNĐ</p>
        <div style="display: flex; flex-direction: row; align-items: center">
          <p style="margin: 0">Loại:&nbsp;</p>
          <div style="max-width: 500px; overflow: scrolls">
            {{ (product.tags || []).join("; ") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./ManageProduction.css";
import ManageProductionLogic from "./ManageProduction.js";
export default {
  name: "ManageProductionPage",
  mixins: [ManageProductionLogic],
};
</script>