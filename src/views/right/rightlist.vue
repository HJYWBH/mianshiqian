<template>
  <div class="rightlist">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain style="margin-bottom:10px" @click="showAddUserDialog">添加角色</el-button>
    <el-table :data="jueseTableData" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row
              v-for="first in scope.row.children"
              :key="first.id"
              style="margin-bottom:10px;border-bottom:1px #ccc dashed"
            >
              <el-col :span="4">
                <el-tag closable :type="'warning'">{{first.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:6px">
                  <el-col :span="4">
                    <el-tag closable :type="'warning'">{{second.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      closable
                      :type="'success'"
                      v-for="third in second.children"
                      :key="third.id"
                      style="margin-right:4px;margin-bottom:6px"
                      @close="deletezhiding(scope.row,third.id)"
                    >{{third.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-show="scope.row.children.length===0">
              <el-col>已经没有任何数据了</el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showRightList(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 授权角色 -->
    <el-dialog title="授权角色" :visible.sync="treeDialogFormVisible">
      <el-tree
        ref="mytree"
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checked"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addShouQuan">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addUserDialogFormVisible">
  <el-form :model="addUserform" :label-width="'120px'">
    <el-form-item label="角色名称" >
      <el-input v-model="addUserform.roleName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" >
      <el-input v-model="addUserform.roleDesc" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUserRight">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<script>
import { getAllroleList, deleteRoleList, addShouQuan, addUserForm } from '@/api/role_api.js'
import { getAllrightList } from '@/api/right_api.js'
export default {
  data () {
    return {
      addUserDialogFormVisible: false,
      addUserform: {
        roleName: '',
        roleDesc: ''
      },
      roleId: '',
      checked: [],
      rightList: [],
      treeDialogFormVisible: false,
      jueseTableData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    addUserRight () {
      addUserForm(this.addUserform)
        .then((res) => {
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.addUserDialogFormVisible = false
            this.addUserform = {}
            this.init()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    showAddUserDialog () {
      this.addUserDialogFormVisible = true
    },
    addShouQuan () {
      var arr = this.$refs.mytree.getCheckedNodes()
      console.log(arr)
      var temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      var str = temp.join(',')
      //   '109,107,102,154,107,102'
      console.log(str)
      //   去重：只有数组可以去重
      var arr2 = str.split(',')
      //   [109,107,102, 154,107,102]
      console.log(arr2)
      //   new Set:数组去重 new Set:{109,107,102,154}
      var finalArr = [...new Set(arr2)]
      //   ...可以将对象的成员展开为一个一个值 [109,107,102,154]
      addShouQuan(this.roleId, finalArr.join(','))
        .then((res) => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.treeDialogFormVisible = false
            this.init()
          }
        })
    },
    showRightList (row) {
      console.log(row)
      this.treeDialogFormVisible = true
      this.roleId = row.id
      getAllrightList('tree')
        .then((res) => {
          if (res.data.meta.status === 200) {
            this.rightList = res.data.data
          }
          this.checked.length = 0
          row.children.forEach((first) => {
            if (first.children.length > 0 && first.children) {
              first.children.forEach((second) => {
                if (second.children && second.children.length > 0) {
                  second.children.forEach((third) => {
                    this.checked.push(third.id)
                  })
                }
              })
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deletezhiding (row, rightId) {
      console.log(row)
      deleteRoleList(row.id, rightId)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            row.children = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getAllroleList()
        .then(res => {
          if (res.data.meta.status === 200) {
            this.jueseTableData = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
