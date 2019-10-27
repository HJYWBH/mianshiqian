<template>
  <div class="index">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input
        v-model="query"
        placeholder="请输入内容"
        class="input-with-select"
        style="width:400px;margin:0 10px 10px 0"
        @keyup.enter.native="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddUser">添加用户</el-button>
    </div>
    <el-table :data="formList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="xiugaiUser(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="bianjihandleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showgrantUserRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="editUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="addDiaoFormVisible">
      <el-form :model="addForm" :label-width="'80px'" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDiaoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="fenpeidialogFormVisible">
      <el-form :model="groutuser" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="groutuser.username" auto-complete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="groutuser.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in fenpeiForm"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fenpeidialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGrountList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="bjdialogFormVisible">
      <el-form :model="bjForm" :label-width="'120px'" :rules="rules" ref="bjForm">
        <el-form-item label="用户名">
          <el-input v-model="bjForm.username" autocomplete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="bjForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="bjForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bjdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tjBianJi">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  bjUser,
  grantUserRole,
  getUserList,
  addUser,
  editUser,
  xiugaiUser
} from '@/api/user_api.js'
import { getAllroleList } from '@/api/role_api.js'
export default {
  data () {
    return {
      bjdialogFormVisible: false,
      bjForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      groutuser: {
        id: '',
        rid: '',
        username: ''
      },
      fenpeiForm: [],
      fenpeidialogFormVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w{2,3}/,
            message: '请输入正确格式邮箱，例：a@b.com',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[345678]\d{9}$/,
            message: '请输入11位正确手机号码',
            trigger: 'blur'
          }
        ]
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addDiaoFormVisible: false,
      value1: true,
      query: '',
      pagenum: 1,
      pagesize: 3,
      total: 0,
      formList: []
    }
  },
  methods: {
    tjBianJi () {
      this.$refs.bjForm.validate(valid => {
        if (valid) {
          bjUser(this.bjForm)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                this.bjdialogFormVisible = false
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            type: 'error',
            message: '用户输入不合法'
          })
          return false
        }
      })
    },
    bianjihandleEdit (row) {
      this.bjdialogFormVisible = true
      this.bjForm.username = row.username
      this.bjForm.email = row.email
      this.bjForm.mobile = row.mobile
      this.bjForm.id = row.id
    },
    submitGrountList () {
      if (!this.groutuser.rid) {
        this.$message({
          type: 'warning',
          message: '请先选择角色'
        })
        return false
      }
      grantUserRole(this.groutuser.id, this.groutuser.rid)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.fenpeidialogFormVisible = false
            this.groutuser.rid = ''
            this.init()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showgrantUserRole (row) {
      this.fenpeidialogFormVisible = true
      this.groutuser.username = row.username
      this.groutuser.id = row.id
      this.groutuser.rid = row.rid
    },
    editUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          editUser(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.pagenum =
                  Math.ceil((this.total - 1) / this.pagesize) < this.pagenum
                    ? --this.pagenum
                    : this.pagenum
                this.init()
              }
            })
            .catch(err1 => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addUser () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.addDiaoFormVisible = false
                this.$refs.addForm.resetFields()
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    showAddUser () {
      this.addDiaoFormVisible = true
    },
    search () {
      this.pagenum = 1
      this.init()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.init()
    },
    xiugaiUser (id, type) {
      xiugaiUser(id, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          this.formList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
    getAllroleList()
      .then(res => {
        if (res.data.meta.status === 200) {
          this.fenpeiForm = res.data.data
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
