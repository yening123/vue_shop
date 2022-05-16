<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button  type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodslist" border="" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="150">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="250">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodslist: [],
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: {
          query: this.queryInfo.query, //这步bu不能漏掉 否则在搜索框搜不了
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取信息失败");
      }
      // this.$message.success("获取信息成功");
      this.goodslist = res.data.goods;
      this.total = res.data.total;

      console.log(res.data.goods);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async removeById(goods_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("删除已取消");
      } else {
        const { data: res } = await this.$http.delete(`goods/${goods_id}`);

        if (res.meta.status !== 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getGoodsList();
      }
    },
    addGoods() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped>
.btn_edit,
.btn_del {
  padding-right: 12px !important;
}

.btn_edit {
  background-color: rgb(7, 192, 248);
}
.btn_del {
  background-color: rgb(180, 7, 248);
}

.el-table {
  margin-top: 20px;
}
</style>