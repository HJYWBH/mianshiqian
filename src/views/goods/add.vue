<template>
  <div class="addgoodlist">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <el-form ref="goossCarcatListForm" :model="goossCarcatListForm" label-width="100px">
      <el-tabs v-model="activeName" :tab-position="'left'" style="margin-top:15px">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="goossCarcatListForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goossCarcatListForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goossCarcatListForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goossCarcatListForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="goodsCart"
              :props="xuanxiang"
              clearable
              v-model="goossCarcatListForm.goods_cat"
              @change="getCa"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :headers="qqtou()"
            :on-success="success"
            :before-upload="scqian"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="goossCarcatListForm.goods_introduce"
            ref="myQuillEditor"
            :options="editorOption"
            style="height:400px;border-bottom:1px solid #ccc"
          ></quill-editor>
        </el-tab-pane>
      </el-tabs>
      <el-button type="success" style="margin-top:15px;float:right" @click="addGood">添加商品</el-button>
    </el-form>
  </div>
</template>
<script>
import { getCate } from '@/api/cateList_api.js'
import { addGood } from '@/api/goodlist_api.js'
export default {
  data () {
    return {
      editorOption: {},
      fileList: [],
      xuanxiang: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      goodsCart: [],
      goossCarcatListForm: {
        goods_name: '',
        goods_weight: '',
        goods_price: '',
        goods_number: '',
        goods_cat: '',
        // 用户图片数据，它是一个数组，里面的每一个值都是对象{pic:path}
        pics: [],
        goods_introduce: '',
        attrs: [],
        goods_state: 1
      },
      activeName: 0
    }
  },
  methods: {
    scqian (file) {
      if (file.type.indexOf('image/') === -1) {
        this.$message({
          type: 'warning',
          message: '请选择正确的图片格式'
        })
        return false
      }
    },
    success (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      this.goossCarcatListForm.pics.push({ pic: response.data.tmp_path })
    },
    qqtou () {
      var token = localStorage.getItem('mianshiqian')
      return { Authorization: token }
    },
    handleRemove (file, fileList) {
      if (!file.response) {
        return
      }
      // console.log(file)
      // console.log(fileList)
      for (var i = 0; i < this.goossCarcatListForm.pics.length; i++) {
        if (
          this.goossCarcatListForm.pics[i].pic === file.response.data.tmp_path
        ) {
          this.goossCarcatListForm.pics.splice(i, 1)
        }
      }
    },
    addGood () {
      addGood(this.goossCarcatListForm).then(res => {
        console.log(res)
        if (res.data.meta.status === 201) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          this.$router.push({ name: 'lists' })
        }
      })
    },
    getCa (val) {
      this.goossCarcatListForm.goods_cat = val.join(',')
    }
  },
  mounted () {
    getCate(3)
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.goodsCart = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
