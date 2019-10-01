<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                        :style="{backgroundImage: `url(${item.imageUrl}`}">
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                        <h5 class="card-title">
                            <a href="#" class="text-dark">{{item.title}}</a>
                        </h5>
                        <p class="card-text">{{item.content}}</p>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
                            <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
                            <div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                            <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                            查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                            <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center my-5">
            <div class="col-md-6">
                <table class="table">
                    <thead>
                        <th></th>
                        <th>品名</th>
                        <th>數量</th>
                        <th>單價</th>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart.carts" :key="item.id">
                            <td class="align-middle">
                                <button type="button" class="btn btn-outline-danger btn-sm"
                                    @click="removeCartItem(item.id)">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </td>
                            <td class="align-middle">
                                {{ item.product.title }}
                                <div class="text-success" v-if="item.coupon">
                                    已套用優惠券
                                </div>
                            </td>
                            <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                            <td class="align-middle text-right">{{ item.final_total }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right">總計</td>
                            <td class="text-right">{{ cart.total }}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-right text-success">折扣價</td>
                            <td class="text-right text-success">{{ cart.final_total }}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="input-group mb-3 input-group-sm">
                    <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="couponCode">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="addCouponCode()">
                            套用優惠碼
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="my-5 row justify-content-center">
            <form class="col-md-6" @submit.prevent="creatOrder()">
                <div class="form-group">
                    <label for="useremail">Email</label>
                    <input v-validate="'required|email'" type="email" class="form-control" :class="{'is-invalid' : errors.has('email')}" name="email" id="useremail" v-model="form.user.email"
                        placeholder="請輸入 Email">
                    <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
                </div>

                <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input v-validate="'required'" type="text" class="form-control" :class="{'is-invalid' : errors.has('name')}" name="name" id="username" v-model="form.user.name"
                        placeholder="輸入姓名">
                    <span class="text-danger" v-if="errors.has('name')">姓名必須輸入</span>
                </div>

                <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
                </div>

                <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input v-validate="'required'" type="text" class="form-control" :class="{'is-invalid' : errors.has('address')}"  name="address" id="useraddress" v-model="form.user.address"
                        placeholder="請輸入地址">
                    <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
                </div>

                <div class="form-group">
                    <label for="comment">留言</label>
                    <textarea name="" id="comment" class="form-control" cols="30" rows="10"
                        v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                    <button class="btn btn-danger">送出訂單</button>
                </div>
            </form>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog " role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>{{product.title}}</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.image" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                            <p class="mb-0">{{product.content}}</p>
                            <footer class="blockquote-footer text-right">{{product.description}}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h5" v-if="!product.price">{{product.origin_price}} 元</div>
                            <del class="h6" v-if="product.price">原價 {{product.origin_price}} 元</del>
                            <div class="h5" v-if="product.price">現在只要 {{product.price}} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計 <strong>{{product.num * product.price}}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">
                            加入購物車
                        </button>
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
                product: {},
                cart: {},
                isLoading: false,
                couponCode: '',
                status: {
                    loadingItem: ''
                },
                form: {
                    user: {
                        name: '',
                        email: '',
                        tel: '',
                        address: ''
                    },
                    message: ''
                }
            }
        },
        methods: {
            getProducts(page = 1) {
                const api = `${PATH}/api/${APIPATH}/products?page=${page}`;
                this.isLoading = true;
                this.$http.get(api).then((res) => {
                    console.log(res.data);
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                    this.isLoading = false;
                })
            },
            getProduct(id) {
                const api = `${PATH}/api/${APIPATH}/product/${id}`;
                this.status.loadingItem = id;
                this.$http.get(api).then((res) => {
                    this.product = res.data.product;
                    this.status.loadingItem = '';
                    $('#productModal').modal('show')
                })
            },
            addtoCart(id, qty = 1) {
                const api = `${PATH}/api/${APIPATH}/cart`;
                this.status.loadingItem = id;
                const cart = {
                    product_id: id,
                    qty
                };
                this.$http.post(api, {
                    data: cart
                }).then((res) => {
                    this.status.loadingItem = '';
                    this.getCart();
                    $('#productModal').modal('hide');
                })
            },
            getCart() {
                const api = `${PATH}/api/${APIPATH}/cart`;
                this.isLoading = true;
                this.$http.get(api).then((res) => {
                    this.cart = res.data.data;
                    this.isLoading = false;
                })
            },
            removeCartItem(id) {
                const api = `${PATH}/api/${APIPATH}/cart/${id}`;
                this.isLoading = true;
                this.$http.delete(api).then((res) => {
                    this.isLoading = false;
                    this.getCart();
                })
            },
            addCouponCode() {
                const api = `${PATH}/api/${APIPATH}/coupon`;
                const coupon = {
                    code: this.couponCode
                }
                this.$http.post(api, {
                    data: coupon
                }).then((res) => {
                    console.log(res.data);
                    if(res.data.success) {
                        this.getCart()
                    } else {
                        this.$bus.$emit('message:push', res.data.message, 'danger');
                    }
                    this.couponCode = ''
                })
            },
            creatOrder() {
                const api = `${PATH}/api/${APIPATH}/order`;
                this.isLoading = true;
                const order = this.form;
                this.$validator.validate().then((valid) => {
                    if (valid) {
                        this.$http.post(api, {data: order}).then((res) => {
                            console.log(res);
                            this.isLoading = false;
                            if(res.data.success) {
                                this.$router.push(`/customCheckout/${res.data.orderId}`)
                            }
                        })
                    } else {
                        console.log('欄位不完整');
                        this.isLoading = false;
                    }
                });

            }
        },
        created() {
            this.getProducts();
            this.getCart();
        },
    }
</script>