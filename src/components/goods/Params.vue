<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/params' }"
        >商品参数</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- 提示框 -->
    <el-card class="box-card">
      <el-alert
        title="只能选择三级级联"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 级联选择器 -->
      <el-row class="goods_fenlei">
        <el-col>
          <span class="wenzi">选择商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="catelistProps"
            v-model="selectedKey"
            @change="selectCateChanged"
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- -----------------tabs标签-------------------- -->
      <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnThree"
            class="addBtn"
            @click="showAddDialog"
          >
            添加动态参数
          </el-button>
          <!-- 动态参数表 -->
          <!--  v-if 这个可以防抖动！！！！！ -->
          <el-table
            v-if="activeName === 'many'"
            :data="manyDataList"
            style="width: 100%"
            border
          >
            <el-table-column type="expand">
              <!-- 展开行 -->
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-tag
                    class="canshu_tag"
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="item.attr_id"
                    closable
                    @close="tagClosed(index, scope.row)"
                    >{{ item }}</el-tag
                  >

                  <el-input
                    style="width: 100px"
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  content="编辑"
                  placement="bottom"
                  effect="light"
                  :enterable="false"
                >
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-edit"
                    class="btn_caozuo1"
                    @click="showEditDialogVisible(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip
                  content="删除"
                  placement="bottom"
                  effect="light"
                  :enterable="false"
                >
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-delete"
                    class="btn_caozuo2"
                    @click="removeParams(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- -------------------静态参数------------------ -->
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            :disabled="isBtnThree"
            class="addBtn"
            @click="showAddDialog"
          >
            添加静态参数
          </el-button>

          <el-table
            v-if="activeName === 'only'"
            :data="onlyDataList"
            style="width: 100%"
            border
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-tag
                    class="canshu_tag"
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="item.attr_id"
                    closable
                    @close="tagClosed(index, scope.row)"
                    >{{ item }}</el-tag
                  >

                  <el-input
                    style="width: 100px"
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  content="编辑"
                  placement="bottom"
                  effect="light"
                  :enterable="false"
                >
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-edit"
                    class="btn_caozuo1"
                    @click="showEditDialogVisible(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip
                  content="删除"
                  placement="bottom"
                  effect="light"
                  :enterable="false"
                >
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-delete"
                    class="btn_caozuo2"
                    @click="removeParams(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- ----------------动、静态公共添加框---------------- -->
    <el-dialog
      :title="textTitle"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input class="addinput" v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogValidate">确 定</el-button>
      </span>
    </el-dialog>

    <!------------------- 编辑对话框------------------------>
    <el-dialog
      :title="'修改' + textTitle"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editFormClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatelist();
  },
  data() {
    return {
      catelist: [],
      catelistProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKey: [],
      activeName: "many",
      //动静态参数
      manyDataList: [],
      onlyDataList: [],

      //-------添加参数所需--------
      addDialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      //-------修改参数所需--------
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      addDialogVisible: false,
    };
  },
  methods: {
    async getCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 3,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "获取catelist失败",
          type: "error",
        });
      }
      this.catelist = res.data;
    },
    //----------- 分类，级联选择器选择时---------
    async selectCateChanged() {
      if (this.selectedKey.length !== 3) {
        this.selectedKey = [];
        this.manyDataList = [];
        this.onlyDataList = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "获取第三级列表数据失败",
          type: "error",
        });
      }
      this.getParamsData();
    },

    //-------------- tab标签选择时 -----------
    tabsHandleClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    //--------------拿到第三列的数据-------------
    async getParamsData() {
      if (this.selectedKey.length !== 3) {
        this.selectedKey = [];
        this.manyDataList = [];
        this.onlyDataList = [];
        return;
      }
      // console.log(this.selectedKey);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取信息失败");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        this.manyDataList = res.data;
        console.log(this.manyDataList);
      }
      this.onlyDataList = res.data;
      console.log(this.onlyDataList);
    },
    //-------------添加参数框-------------
    showAddDialog() {
      this.addDialogVisible = true;
    },
    addDialogValidate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
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
        this.getParamsData();
      });
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //-----------------编辑框------------------
    async showEditDialogVisible(rowId) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${rowId}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取信息失败");
      }
      this.editForm = res.data; //直接赋值
      this.editDialogVisible = true;
      console.log(this.editForm);
    },
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },

    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 201)
          return this.$message({
            customClass: "focus-message err",
            message: "修改失败",
            type: "error",
          });
        this.$message({
          customClass: "focus-message",
          message: "修改成功",
          type: "success",
        });
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // ---------------删除------------------
    async removeParams(rowId) {
      const removeResult = await this.$confirm("确认删除这个参数吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      if (removeResult !== "confirm") {
        return this.$message.info("删除取消");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${rowId}`
      );

      if (res.meta.status !== 200)
        return this.$message({
          customClass: "focus-message err",
          message: "删除失败",
          type: "error",
        });
      this.$message({
        customClass: "focus-message",
        message: "删除成功",
        type: "success",
      });
      this.getParamsData();
    },

    // -----------------el-tag------------------
    //键盘enter确定 或者失去焦点
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 将新添加的值放在attr_vals中
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //后端修改数据
      this.saveVal(row);
      this.inputVisible = false;
    },

    //删除tag
    tagClosed(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveVal(row);
    },
    //保存tag到后台  修或删除
    async saveVal(row) {
      //保存newTag的修改
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          //所需参数
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        this.$message({
          customClass: "focus-message err",
          message: "修改失败",
          type: "error",
        });
      }
      this.$message({
        customClass: "focus-message",
        message: "修改成功",
        type: "success",
      });
    },
    showInput(scopeRow) {
      scopeRow.inputVisible = true;
      //渲染完这个这个页面的元素后执行这个
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  computed: {
    //判断是否选了第三级
    isBtnThree() {
      if (this.selectedKey.length === 3) {
        return false;
      } else {
        return true;
      }
    },
    // 获取第三列的ID
    cateId() {
      if (this.selectedKey.length === 3) {
        return this.selectedKey[2];
      }
      return null;
    },
    textTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态参数";
    },
  },
};
</script>

<style lang='less' scoped>
.goods_fenlei {
  margin-top: 15px;
  font-size: 13px;
}
.wenzi {
  margin-right: 10px;
}
.addBtn {
  margin-bottom: 15px;
}
.addinput {
  width: 410px;
}
.canshu_tag {
  margin: 10px 15px;
}
</style>