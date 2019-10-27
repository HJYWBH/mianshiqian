<template>
  <div class="lists">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input
        v-model="goodObj.query"
        placeholder="请输入内容"
        class="input-with-select"
        style="width:400px;margin:0 10px 10px 0"
        @keyup.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="$router.push({name: 'add'})">添加商品</el-button>
    </div>
    <el-table :data="goodAllListTableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="580"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="upd_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template>
          <!-- slot-scope="scope" -->
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
    style='background:#ddd;margin-top:15px'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodObj.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { goodAllList } from '@/api/goodlist_api.js'
export default {
  data () {
    return {
      total: 0,
      currentPage4: '',
      goodObj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodAllListTableData: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleSizeChange (val) {
      this.goodObj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.goodObj.pagenum = val
      this.init()
    },
    init () {
      goodAllList(this.goodObj).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.goodAllListTableData = res.data.data.goods
          this.total = res.data.data.total
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
