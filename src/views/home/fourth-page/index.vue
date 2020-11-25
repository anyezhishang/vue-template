<!-- 第四页 -->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix card_header">
      <div class="margin_right">
        <span class="card_header_title">姓名：</span>
        <el-input
          v-model="input"
          placeholder="姓名"
          clearable
          @keyup.enter.native="getArticleList(1)"
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
      <el-button type="primary" @click="getArticleList(1)">查询</el-button>
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
import { apiGetArticleList } from "@/api/first-page";

export default {
  name: "FirstPage",
  data() {
    return {
      input: "",
      dateArr: [],

      tableData: [],

      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getArticleList(1, true);
  },
  methods: {
    async getArticleList(pageIndex, isFirst) {
      try {
        let res = await apiGetArticleList({
          name: this.input,
          beginDate: this.dateArr ? this.dateArr[0] : undefined,
          endDate: this.dateArr ? this.dateArr[1] : undefined,
          pageNum: pageIndex,
          pageSize: this.pageSize
        });
        // console.log(res);

        if (res.data.errorCode === 0) {
          isFirst || this.$message.success("查询成功！");
          this.tableData = res.data.data.list;
          this.total = res.data.data.count;
        } else {
          this.$message.error("查询失败！");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("查询失败！");
      }
    },
    pageChange(pageIndex) {
      this.getArticleList(pageIndex);
    }
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