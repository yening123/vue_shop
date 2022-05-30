<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            :span="4"
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6"
          ><el-button :span="3" type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 表格 -->
      <el-table :data="userslist" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              class="btn_caozuo1"
              @click="editShowDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-delete"
              class="btn_caozuo2"
              @click="removeOpen(scope.row.id)"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-setting"
              class="btn_caozuo3"
              @click="roleDialogOpen(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- ----------------添加用户对话框弹出--------------- -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addFormReset"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormValidation">确 定</el-button>
      </span>
    </el-dialog>

    <!-- ----------------修改用户对话框弹出--------------- -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editFormReset"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormValidation">确 定</el-button>
      </span>
    </el-dialog>

    <!--================ 角色分配权限---------------- -->
    <el-dialog
      title="提示"
      :visible.sync="roleDialogVisible"
      width="30%"
      @close="rolesDialogClosed"
    >
      <p>当前用户:{{ this.userInfo.username }}</p>
      <p>当前角色:{{ this.userInfo.role_name }}</p>
      <span>分配新角色: </span>
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersList();
  },
  data() {
    //-----------------添加用户——自定义校验规则----------------------
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("邮箱格式错误"));
    };

    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("手机格式错误"));
    };
    return {
      userslist: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 1,
      addDialogVisible: false,
      //--------------------添加用户规则---------------------
      addForm: {
        username: "yening",
        password: "123456",
        email: "420454377@qq.com",
        mobile: "13450129396",
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // ----------------修改用户开始-----------------
      editDialogVisible: false,
      editForm: {},
      editRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      //--------------------角色分配开始-------------------
      roleDialogVisible: false,
      roleList: [],
      userInfo: {},
      selectedRoleId: "",
    };
  },

  methods: {
    //--------------------获取用户数据--------------------
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "获取数据失败",
          type: "error",
        });
      }
      this.total = res.data.total;
      this.userslist = res.data.users;
    },
    //--------------------获取用户数据结束--------------------

    //--------------------分页功能--------------------
    //当前显示页数 pagesize 把参数带在里面
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getUsersList(); //重新渲染
    },
    //当前页数
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getUsersList();
    },
    // ------------------分页结束------------------------

    // ------------------状态修改------------------------
    async userStateChange(scopeRow) {
      // console.log(scopeRow);
      const { data: res } = await this.$http.put(
        `users/${scopeRow.id}/state/${scopeRow.mg_state}`
      );
      console.log(res.data);
      if (res.meta.status !== 200) {
        scopeRow.mg_state = !scopeRow.mg_state;
        return this.$message({
          customClass: "focus-message err",
          message: "修改状态",
          type: "error",
        });
      }
      this.$message({
        customClass: "focus-message",
        message: "修改状态成功",
        type: "success",
      });
    },
    // ------------------状态修改结束------------------------

    //---------------------添加用户弹出框--------------------
    addFormReset() {
      this.$refs.addFormRef.resetFields();
    },
    addFormValidation() {
      this.$refs.addFormRef.validate(async (validate) => {
        // console.log(validate); //判断全部表格是否全部合法 ref定在form那里
        if (!validate) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201)
          return this.$message({
            customClass: "focus-message err",
            message: "添加失败",
            type: "error",
          });
        this.$message({
          customClass: "focus-message",
          message: "添加成功",
          type: "success",
        });
        this.addDialogVisible = false;
        //重新渲染当前页面
        this.getUsersList();
      });
    },

    //---------------------修改用户弹出框--------------------
    async editShowDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "获取修改信息失败",
          type: "error",
        });
      }
      this.editForm = res.data;
    },
    editFormReset() {
      this.$refs.editFormRef.resetFields();
    },
    //预验证
    editFormValidation() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message({
            customClass: "focus-message err",
            message: "修改信息失败",
            type: "error",
          });
        }
      });
      this.editDialogVisible = false;
      this.getUsersList();
      this.$message({
        customClass: "focus-message",
        message: "修改信息成功",
        type: "success",
      });
    },
    //---------------------修改用户弹出框结束--------------------

    //---------------------删除用户--------------------
    removeOpen(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              customClass: "focus-message err",
              message: "删除失败",
              type: "error",
            });
          }
          this.$message({
            customClass: "focus-message",
            type: "success",
            message: "删除成功!",
          });
          this.getUsersList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //---------------------删除用户结束--------------------

    //---------------------角色分配权限--------------------
    async roleDialogOpen(scopeRow) {
      this.userInfo = scopeRow;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "获取分配角色权限删除失败",
          type: "error",
        });
      }
      this.roleList = res.data;
      this.roleDialogVisible = true;
      console.log(this.userInfo);
    },
    //点击确认之后
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色！");
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "分配角色失败",
          type: "error",
        });
      }
      this.$message({
        customClass: "focus-message",
        message: "分配成功",
        type: "success",
      });
      this.getUsersList();
      this.roleDialogVisible = false;
    },
    rolesDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = "";
    },
    //---------------------角色分配权限结束--------------------
  },
};
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 20px;
}
</style>