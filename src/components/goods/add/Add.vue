<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/add' }">添加分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert title="警告提示的文案" type="warning" center show-icon :closable='false'>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="300" :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form表单包含tabs标签，这样每个tab中都可以用到form-item -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" :label-position="'top'">
        <!-- 标签页 -->
        <el-tabs v-model="activeIndex" @tab-click="tabClicked" :tab-position="'left'" :before-leave="tabBeforeLeave">
          <el-tab-pane label="基本信息" name="0">
            <!-- <form-item> -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品类别" prop="goods_name">
              <el-cascader expand-trigger="hover" :options="catelist" :props="props" v-model="addForm.goods_cat"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableList" :key="item.attr_id">
              <el-checkbox v-model="item.attr_vals" :label="item1" v-for="(item1, index) in item.attr_vals" :key="index"
                border>
              </el-checkbox>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action文件要上传到的位置 ,list-type预览模式-->
            <el-upload class="upload-demo" :action="uploadAction" :on-preview="handlePreview" :on-remove="handleRemove"
              list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="success" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="PicImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {

  created() {
    //获取所有商品分类数据
    this.getCateList();
  },
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //选中三级分类时保存ID的数组
        goods_cat: [],
        //pics要数组形式
        pics: [],
        goods_introduce: '',
        //attr数组中要什么看文档
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入类别', trigger: 'blur' }
        ]
      },
      // 分类列表
      catelist: [],
      // 级联props
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //动态参数
      manyTableList: [],
      onlyTableList: [],
      uploadAction: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传组件的Headers请求对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,

    }
  },
  methods: {
    //获取所有商品分类数据-----------------
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: 'focus-message err',
          message: '获取数据失败',
          type: 'error'
        })
      }
      this.catelist = res.data;
    },
    //级联选择框选择时--------------------
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //tabs进入另一个时-------------------
    tabBeforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message({
          customClass: 'focus-message err',
          message: '请先选择三级分类',
          type: 'error'
        });
        return false;
      }
    },
    //获取商品动态参数列表信息
    async getManyList() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        {
          params: {
            sel: 'many',
          }
        }
      )
      if (res.meta.status !== 200) {
        this.$message({
          customClass: 'focus-message err',
          message: '请先商品参数分类',
          type: 'error'
        });
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
      });
      this.manyTableList = res.data;
      console.log(this.manyTableList);
    },

    //获取商品静态参数列表信息
    async getOnlyList() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        {
          params: {
            sel: 'only',
          }
        }
      )
      if (res.meta.status !== 200) {
        this.$message({
          customClass: 'focus-message err',
          message: '请先商品参数分类',
          type: 'error'
        });
      }

      this.onlyTableList = res.data;
      console.log(this.onlyTableList);
    },
    //tab选择时-------
    tabClicked() {
      if (this.activeIndex === '1') {
        this.getManyList();
      } else if (this.activeIndex === '2') {
        this.getOnlyList();
      }
    },
    //上传图片--------------------
    //查看图片时
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //删除图片方法
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic:
          response.data.tmp_path
      }
      //2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    // 添加商品
    add() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        //执行添加业务逻辑
        // lodash cloneDeep(obj) 深拷贝 级联要数组 这边要字符串
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // console.log(form);
        //处理动态参数
        this.manyTableList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        //处理静态参数
        this.onlyTableList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        console.log(form);

        //发起请求添加商品
        //商品的名称，必须是唯一的
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败！");
        }
        this.$message.success("添加商品成功！");
        this.$router.push("/goods");
      });
    },
  },

  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
}
</script>

<style lang="less" scoped>
// .el-steps 全局中有配置
.el-checkbox {
  margin-right: 10px;
}

.PicImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>