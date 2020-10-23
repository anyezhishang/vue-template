<!-- 第一页 -->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix card_header">
      <div class="margin_right">
        <span class="card_header_title">姓名：</span>
        <el-input
          v-model="input"
          placeholder="姓名"
          clearable
          @keyup.enter.native="search(1)"
          style="width: 150px"
        ></el-input>
      </div>
      <div class="margin_right">
        <span class="card_header_title">日期：</span>
        <el-date-picker
          v-model="dateArr"
          :unlink-panels="true"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px"
        ></el-date-picker>
      </div>
      <el-button type="primary" @click="search(1)">查询</el-button>
    </div>

    <el-table class="card_table" border :data="tableData">
      <el-table-column prop="date" align="center" label="日期" width="120"></el-table-column>
      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="address" align="center" label="地址"></el-table-column>
    </el-table>

    <el-pagination
      class="pa_margin_top"
      background
      @current-change="pageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "FirstPage",
  data() {
    return {
      input: "",
      dateArr: [],

      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],

      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {},
  methods: {
    pageChange() {},

    search() {}
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: calc(100% - 2px);

  .pa_margin_top {
    margin-top: 10px;
  }
}

.card_header {
  display: flex;

  .margin_right {
    margin-right: 40px;
  }
}

.card_header_title {
  font-weight: bold;
}
</style>