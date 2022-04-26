<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column prop="authName" label="权限管理"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList();
  },
  data() {
    return {
      list: "list",
      rightsList: [],
    };
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/${this.list}`);
      if (res.meta.status !== 200)
        return this.$message({
          customClass: "focus-message err",
          message: "获取Rights数据失败",
          type: "error",
        });
      this.rightsList = res.data;
    },
  },
};
</script>

<style>
</style>