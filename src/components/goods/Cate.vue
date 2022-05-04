<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }"
        >商品分类</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button class="add_btn" type="primary" @click="showCateDialog"
        >添加分类</el-button
      >
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: skyblue"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">等级一</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >等级二</el-tag
          >
          <el-tag type="danger" size="mini" v-else>等级三</el-tag>
        </template>

        <template slot="opt">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            class="btn_caozuo1"
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            class="btn_caozuo2"
          ></el-button>
        </template>
      </tree-table>

      <!-- 分页区域  handleSizeChange 选框选择页 CurrentChange中间选择页 
    current-page当前页面     page-size当前页面显示条数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 10, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- -----------------添加分类试图------------------------- -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateReset"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKey"
            @change="parentCateChanged"
            clearable
            style="width: 100%"
          >
          </el-cascader
        ></el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogValidate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagesize: 5,
        pagenum: 1,
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "等级",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 分页参数
      queryInfo: {
        type: 3,
        pagesize: 10,
        pagenum: 1,
      },
      total: 0,
      //---------添加分类---------
      addCateDialogVisible: false,
      //选择时与级联选择器有关
      addCateForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "blur",
          },
        ],
      },
      //级联选择器
      parentCateList: [],

      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKey: [],
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取货物列表失败");
      }
      this.catelist = res.data.result;
      this.total = res.data.total;
      console.log(res.data);
    },
    // -----------------------分页开始-----------------------
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    // -----------------------分页结束-----------------------

    //------------添加分类--------------------
    showCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      this.parentCateList = res.data;
    },
    //关闭弹窗时重置内容
    addCateReset() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKey = [];
      this.cascaderProps.cat_pid = 0;
      this.cascaderProps.cat_level = 0;
    },
    //----级联选择器改变选择时-------
    parentCateChanged() {
      if (this.selectedKey.length > 0) {
        this.addCateForm.cat_pid = this.selectedKey[
          this.selectedKey.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKey.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCateDialogValidate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message({
            customClass: "focus-message err",
            message: "添加失败",
            type: "error",
          });
        }

        this.$message({
          customClass: "focus-message",
          message: "添加成功",
          type: "success",
        });
        this.getCateList();

        this.addCateDialogVisible = false;
      });
    },
  },
};
</script>

<style lang='less' scoped>
.tree-table {
  margin-top: 15px;
}
.add_btn {
  margin-bottom: 20px;
}
</style>