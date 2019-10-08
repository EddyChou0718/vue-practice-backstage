<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click="openModal(true)">建立新產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th class="click" width="120" @click="changeSort('category')">
                        分類
                        <span class="fas" 
                        :class="[(sorting && sortBy == 'category') ? 'fa-angle-down' : 'fa-angle-up', sortBy == 'category' ? 'text-primary' : 'text-secondary']"></span>
                    </th>
                    <th>產品名稱</th>
                    <th class="click" width="120" @click="changeSort('origin_price')">
                        原價
                        <span class="fas" 
                        :class="[(sorting && sortBy == 'origin_price') ? 'fa-angle-down' : 'fa-angle-up', sortBy == 'origin_price' ? 'text-primary' : 'text-secondary']"></span>
                    </th>
                    <th class="click" width="120" @click="changeSort('price')">
                        售價
                        <span class="fas" 
                        :class="[(sorting && sortBy == 'price') ? 'fa-angle-down' : 'fa-angle-up', sortBy == 'price' ? 'text-primary' : 'text-secondary']"></span>
                    </th>
                    <th class="click" width="100" @click="changeSort('is_enabled')">
                        是否啟用
                        <span class="fas" 
                        :class="[(sorting && sortBy == 'is_enabled') ? 'fa-angle-down' : 'fa-angle-up', sortBy == 'is_enabled' ? 'text-primary' : 'text-secondary']"></span>
                    </th>
                    <th width="160">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in sortedProducts" :key="item.id">
                    <td>{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td class="text-right">
                        {{item.origin_price | currency}}
                    </td>
                    <td class="text-right">
                        {{item.price | currency}}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">                        
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                            <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{disabled: !pagination.has_pre}">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="page in pagination.total_pages" :key="page" :class="{active : pagination.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{disabled: !pagination.has_next}" @click.prevent="getProducts(pagination.current_page + 1)">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>新增產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label for="image">輸入圖片網址</label>
                                    <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                                </div>
                                <div class="form-group">
                                    <label for="customFile">或 上傳圖片
                                        <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                                    </label>
                                    <input type="file" id="customFile" class="form-control" ref="files" @change="uploadImage()">
                                </div>
                                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                                    class="img-fluid" :src="tempProduct.imageUrl" alt="">
                            </div>
                            <div class="col-sm-8">
                                <div class="form-group">
                                    <label for="title">標題</label>
                                    <input type="text" class="form-control" id="title" placeholder="請輸入標題"
                                        v-model="tempProduct.title">
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="category">分類</label>
                                        <input type="text" class="form-control" id="category" placeholder="請輸入分類"
                                            v-model="tempProduct.category">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">單位</label>
                                        <input type="unit" class="form-control" id="unit" placeholder="請輸入單位"
                                            v-model="tempProduct.unit">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="origin_price">原價</label>
                                        <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價"
                                            v-model="tempProduct.origin_price">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">售價</label>
                                        <input type="number" class="form-control" id="price" placeholder="請輸入售價"
                                            v-model="tempProduct.price">
                                    </div>
                                </div>
                                <hr>

                                <div class="form-group">
                                    <label for="description">產品描述</label>
                                    <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"
                                        v-model="tempProduct.description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="content">說明內容</label>
                                    <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"
                                        v-model="tempProduct.content"></textarea>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0"
                                            id="is_enabled" v-model="tempProduct.is_enabled">
                                        <label class="form-check-label" for="is_enabled">
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateProduct()">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteProduct()">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'

    export default {
        data() {
            return {
                products: [],
                tempProduct: {},
                isNew: false,
                isLoading: false,
                status: {
                    fileUploading: false,
                },
                pagination: {},
                sortBy: 'category',
                sorting: true
            }
        },
        methods: {
            getProducts(page = 1) {
                const api = `${PATH}/api/${APIPATH}/admin/products?page=${page}`;
                this.isLoading = true;
                this.$http.get(api).then((res) => {
                    console.log(res.data)
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                    this.isLoading = false;
                })
            },
            openModal(isNew, item) {
                if (isNew) {
                    this.tempProduct = {};
                    this.isNew = true;
                } else {
                    this.tempProduct = Object.assign({}, item);
                    this.isNew = false;
                }
                $('#productModal').modal('show')
            },
            openDeleteModal(item) {
                this.tempProduct = Object.assign({}, item);
                $('#delProductModal').modal('show')
            },
            updateProduct() {
                let api = `${PATH}/api/${APIPATH}/admin/product`;
                let httpMethods = 'post';
                if (!this.isNew) {
                    api = `${PATH}/api/${APIPATH}/admin/product/${this.tempProduct.id}`
                    httpMethods = 'put'
                }
                this.$http[httpMethods](api, {
                    data: this.tempProduct
                }).then((res) => {
                    console.log(res.data)
                    if (res.data.success) {
                        this.$bus.$emit('message:push', res.data.message, 'success')
                        this.getProducts();
                    } else {
                        this.$bus.$emit('message:push', '更新失敗', 'danger')
                    }
                    $('#productModal').modal('hide');
                })
            },
            deleteProduct() {
                const api = `${PATH}/api/${APIPATH}/admin/product/${this.tempProduct.id}`;
                this.$http.delete(api).then((res) => {
                    console.log(res.data)
                    if(!res.data.success) {
                        this.$bus.$emit('message:push', res.data.message, 'danger')
                    } else {
                        this.$bus.$emit('message:push', res.data.message, 'success')
                    }
                    $('#delProductModal').modal('hide');
                    this.getProducts()
                })
            },
            uploadImage() {
                this.status.fileUploading = true;
                const uploadedFile = this.$refs.files.files[0];
                const formData = new FormData();
                formData.append('file-to-upload', uploadedFile);
                const api = `${PATH}/api/${APIPATH}/admin/upload`;
                this.$http.post(api, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    console.log(res.data);
                    if(res.data.success) {
                        this.$set(this.tempProduct, 'imageUrl', res.data.imageUrl)
                        this.$bus.$emit('message:push', '更新成功', 'success')
                    } else {
                        this.$bus.$emit('message:push', res.data.message, 'danger')
                    }
                    this.status.fileUploading = false;
                })
            },
            changeSort(type) {
                if(type == this.sortBy) {
                    this.sorting = !this.sorting;
                } else {
                    this.sortBy = type;
                    this.sorting = true;
                }
            }
        },
        computed: {
            sortedProducts() {
                if(this.sortBy == 'category') {
                    return this.products.sort((a, b) => {
                        a = a[this.sortBy];
                        b = b[this.sortBy];
                        if(!this.sorting) {
                            return a.localeCompare(b);
                        } else {
                            return b.localeCompare(a);
                        }
                    })
                } else {
                    return this.products.sort((a,b) => {
                        a = a[this.sortBy];
                        b = b[this.sortBy];
                        if(!this.sorting) {
                            return a - b;
                        } else {
                            return b - a;
                        }
                    })
                }
            }
        },
        created() {
            this.getProducts();
        }
    }
</script>