<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click="openModal(true)">建立新優惠碼</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>優惠名稱</th>
                    <th>優惠代碼</th>
                    <th width="120">折價</th>
                    <th width="100">是否啟用</th>
                    <th width="160">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in coupons" :key="item.id">
                    <td>{{item.title}}</td>
                    <td>{{item.code}}</td>
                    <td>{{item.percent}}%</td>
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
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="getCoupon(pagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <li class="page-item" v-for="page in pagination.total_pages" :key="page" :class="{active : pagination.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getCoupon(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{disabled: !pagination.has_next}" @click.prevent="getCoupon(pagination.current_page + 1)">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
        <!-- Modal -->
        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog " role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>建立優惠碼</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="title">優惠名稱</label>
                            <input type="text" class="form-control" id="title" placeholder="請輸入名稱"
                                v-model="tempCoupon.title">
                        </div>
                        <div class="form-group">
                            <label for="title">優惠代碼</label>
                            <input type="text" class="form-control" id="title" placeholder="請輸入名稱"
                                v-model="tempCoupon.code">
                        </div>
                        <div class="form-group">
                            <label for="title">優惠折扣</label>
                            <div class="input-group">
                                <input type="number" min="0" max="100" class="form-control" id="title" placeholder="請輸入名稱"
                                    v-model="tempCoupon.percent" @change="watchCouponPercent()">
                                <div class="input-group-append">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0"
                                    id="is_enabled" v-model="tempCoupon.is_enabled">
                                <label class="form-check-label" for="is_enabled">
                                    是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateCoupon()">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除優惠碼</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠碼(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteCoupon()">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

export default {
    data() {
        return {
            isLoading: false,
            coupons: [],
            tempCoupon: {},
            isNew: false,
            pagination: {},
        }
    },
    methods: {
        getCoupons(page = 1) {
            const api = `${PATH}/api/${APIPATH}/admin/coupons?page=${page}`;
            this.isLoading = true;
            this.$http.get(api).then((res) => {
                console.log(res.data)
                this.coupons = res.data.coupons;
                this.pagination = res.data.pagination;
                this.isLoading = false;
            })
        },
        updateCoupon() {
            let api = `${PATH}/api/${APIPATH}/admin/coupon`;
            let httpMethods = 'post';
            if (!this.isNew) {
                api = `${PATH}/api/${APIPATH}/admin/coupon/${this.tempCoupon.id}`
                httpMethods = 'put'
            }
            this.$http[httpMethods](api, {
                data: this.tempCoupon
            }).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    this.$bus.$emit('message:push', res.data.message, 'success')
                    this.getCoupons();
                } else {
                    this.$bus.$emit('message:push', '更新失敗', 'danger')
                }
                $('#couponModal').modal('hide');
            })
        },
        openModal(isNew, item) {
            if(isNew) {
                this.isNew = true;
                this.tempCoupon = {}       
            } else {
                this.isNew = false;
                this.tempCoupon = Object.assign({}, item)
            }
            $('#couponModal').modal('show');
        },
        openDeleteModal(item) {
            this.tempCoupon = Object.assign({}, item);
            $('#delCouponModal').modal('show')
        },
        deleteCoupon() {
            const api = `${PATH}/api/${APIPATH}/admin/coupon/${this.tempCoupon.id}`;
            this.$http.delete(api).then((res) => {
                console.log(res.data)
                if(!res.data.success) {
                    this.$bus.$emit('message:push', res.data.message, 'danger')
                } else {
                    this.$bus.$emit('message:push', res.data.message, 'success')
                }
                $('#delCouponModal').modal('hide');
                this.getCoupons()
            })
        },
        watchCouponPercent() {
            if(this.tempCoupon.percent > 100) {
                this.tempCoupon.percent = 100;
            }
            if(this.tempCoupon.percent < 0) {
                this.tempCoupon.percent = 0;
            }
        }
    },
    created() {
        this.getCoupons();
    }
}
</script>