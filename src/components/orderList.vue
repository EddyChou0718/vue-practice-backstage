<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">購買時間</th>
                    <th width="100">購買人姓名</th>
                    <th width="120">聯絡電話</th>
                    <th>Ｅmail</th>
                    <th >購買項目</th>
                    <th width="120">應付金額</th>
                    <th width="100">是否付款</th>
                    <th width="80">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in orders" :key="item.num">
                    <td>{{$timePlugin.unixtoDateTime(item.create_at)}}</td>
                    <td>{{item.user.name}}</td>
                    <td>{{item.user.tel}}</td>
                    <td>{{item.user.email}}</td>
                    <td >
                        <p v-for="product in item.products" :key="product.product_id">
                            {{product.product.title}} : {{product.qty}} {{product.product.unit}}
                        </p>
                    </td>
                    <td class="text-right">
                        {{item.total | currency}}
                    </td>
                    <td>
                        <span v-if="item.is_paid" class="text-success">已付款</span>
                        <span v-else>尚未付款</span>
                    </td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">                        
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">編輯</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{disabled: !pagination.has_pre}">
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="getOrders(pagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <li class="page-item" v-for="page in pagination.total_pages" :key="page" :class="{active : pagination.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getOrders(page)">{{page}}</a>
                </li>
                <li class="page-item" :class="{disabled: !pagination.has_next}" @click.prevent="getOrders(pagination.current_page + 1)">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
        <!-- Modal -->
        <div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog " role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>修改訂單</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="name">購買人姓名</label>
                            <input type="text" class="form-control" id="name" placeholder="請輸入姓名"
                                v-model="tempOrder.user.name">
                        </div>
                        <div class="form-group">
                            <label for="tel">Email</label>
                            <input type="text" class="form-control" id="tel" placeholder="請輸入聯絡電話"
                                v-model="tempOrder.user.tel">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" placeholder="請輸入Email"
                                v-model="tempOrder.user.email">
                        </div>
                        <!-- <div class="form-group">
                            <label>購買項目</label>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="item in tempOrder.products" :key="item.id">
                                    <div class="row">
                                        <div class="col">{{item.product.title}}</div>
                                        <div class="col input-group">
                                            <input type="number" class="text-right form-control" v-model="item.qty">
                                            <div class="input-group-append">
                                                <span class="input-group-text">{{item.product.unit}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div> -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateOrder()">確認</button>
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
            tempOrder: {
                user: {}
            },
            orders: [],
            pagination: {},
            isLoading: false
        }
    },
    methods: {
        getOrders(page=1) {
            const api = `${PATH}/api/${APIPATH}/admin/orders?page=${page}`;
            this.isLoading = true;
            this.$http.get(api).then((res) => {
                console.log(res)
                this.orders = res.data.orders;
                this.pagination = res.data.pagination
                this.isLoading = false;
            })
        },
        updateOrder(id) {
            let api = `${PATH}/api/${APIPATH}/admin/order/${id}`;
            this.$http.put(api, {
                data: this.tempOrder
            }).then((res) => {
                console.log(res.data)
                if (res.data.success) {
                    this.getOrders()
                    this.$bus.$emit('message:push', res.data.message, 'success')
                } else {
                    this.$bus.$emit('message:push', '更新失敗', 'danger')
                }
                $('#orderModal').modal('hide');
            })
        },
        openModal(item) {
            this.tempOrder = Object.assign({}, item)
            $('#orderModal').modal('show');
        }
    },
    created() {
        this.getOrders();
    }
}
</script>