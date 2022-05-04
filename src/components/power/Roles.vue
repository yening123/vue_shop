<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >角色列表</el-breadcrumb-item
      >
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!---------------- 表格 ----------------------->
      <el-table :data="rolesList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'row_button_boder',
                i1 === 0 ? 'row_top_boder' : '',
                'row_center',
              ]"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRolesTag(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'row_top_boder']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRolesTag(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级渲染 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRolesTag(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50px">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              class="btn_caozuo1"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-delete"
              class="btn_caozuo2"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-setting"
              class="btn_caozuo3"
              @click="rightsDialogOpen(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- ----------------------分配权限视图-------------------- -->
    <el-dialog
      title="提示"
      :visible.sync="rightsDialogVisible"
      width="30%"
      @close="resetDefaultKey"
    >
      <el-tree
        :data="rightslist"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultkey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightsDialogValidate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      rightsDialogVisible: false,
      rightslist: [],
      // ------------------Tree 树形控件(权限分配)------------------
      rightsProps: {
        children: "children",
        label: "authName",
      },
      //默认权限选中框，存放id
      defaultkey: [], //删除框时要清除被选过的
      roleId: "",
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "获取数据失败",
          type: "error",
        });
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    async deleteRolesTag(role, itemId) {
      const comfirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(comfirmResult);
      if (comfirmResult !== "confirm") return this.$message.info("删除已取消");

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${itemId}`
      );
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "删除权限失败",
          type: "error",
        });
      }
      //防止重新渲染页面
      role.children = res.data;
    },

    //---------------- 分配权限视图 + 获取Tree控件数据-------------------
    resetDefaultKey() {
      this.defaultkey = [];
    },
    async rightsDialogOpen(scopeRow) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "权限列表数据获取失败",
          type: error,
        });
      }
      this.rightslist = res.data;
      //获取三级节点id
      this.getDefaultKeys(scopeRow, this.defaultkey);
      // 下面点击确认要用
      this.roleId = scopeRow.id;
      this.rightsDialogVisible = true;
    },
    //递归实现选取id
    getDefaultKeys(node, arr) {
      //node为上面scopeRow的数据 主管->children->children
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getDefaultKeys(item, arr));
    },
    //分配权限点击确定按钮
    async rightsDialogValidate() {
      //权限被选中的id
      const selectedId = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idstr = selectedId.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idstr,
        }
      );
      console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "分配权限失败",
          type: "error",
        });
      }
      this.$message({
        customClass: "focus-message",
        message: "分配权限成功",
        type: "success",
      });

      this.getRolesList();
      this.rightsDialogVisible = false;
    },
  },
};
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 20px;
}
.row_top_boder {
  border-top: 1px solid rgb(238, 238, 238);
}

.row_button_boder {
  border-bottom: 1px solid rgb(238, 238, 238);
}
.el-tag {
  margin: 10px;
}
.row_center {
  display: flex;
  align-items: center;
}
</style>