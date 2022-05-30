<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }">订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input class="searchInput" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderlist" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付</el-tag>
            <el-tag v-else type="success">已付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button @click="editHandle" class="btn_caozuo1" size="small" type="primary" icon="el-icon-edit">
            </el-button>
            <el-button @click="localHandle" class="btn_caozuo2" size="small" type="success" icon="el-icon-location">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

    <!-- 修改信息 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="30%" @close="editHandleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="地址选择" prop="citySelect">
          <el-cascader expand-trigger="hover" :options="citydata" v-model="citySelectedOptions" @change="handleChange"
            :props="props">
          </el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="detailCity">
          <el-input class="detailInput" v-model="editForm.detailCity"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="地址信息" :visible.sync="localDialogVisible" width="30%" @close="localHandleClose">
      <!-- 快递物流信息待完善 -->
      <p>快递物流信息待完善</p>
      <span slot="footer">
        <el-button @click="localDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="localDialogVisible = false">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
 
<script>
import citydata from './citydata'
export default {
  created() {
    this.getOrderList();
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      editDialogVisible: false,
      localDialogVisible: false,
      //级联选择器
      citySelectedOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      citydata: citydata,

      editForm: {
        citySelect: '',
        detailCity: ''
      },
      editFormRules: {
        citySelect: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        detailCity: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders",
        { params: this.queryInfo }
      );
      if (res.meta.status !== 200) {
        return this.$message({
          customClass: "focus-message err",
          message: "添加失败",
          type: "error",
        })
      };
      this.total = res.data.total;
      this.orderlist = res.data.goods;
      console.log(res);
    },
    //显示条数
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getOrderList();
    },
    //当前页数
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getOrderList();
    },
    //修改框关闭时
    editHandleClose() {
      this.$refs.editFormRef.resetFields();
      this.citySelectedOptions = []
    },
    editHandle() {
      this.editDialogVisible = true;
    },

    //级联修改时
    handleChange() {
      console.log(this.citySelectedOptions);
    },

    async localHandle() {
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // console.log(res.data);
      this.localDialogVisible = true;
    },
    localHandleClose() {
    }
  },
}
</script>

<style lang="less" scoped>
.searchInput {
  width: 600px;
}

.el-table {
  margin-top: 20px;
}

.el-cascader {
  width: 400px;
}

.detailInput {
  width: 400px;
}
</style>