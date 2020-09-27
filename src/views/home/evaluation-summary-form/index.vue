<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix card_header">
      <div>
        <span class="card_header_title">考核期间：</span>
        <el-date-picker
          v-model="testDateValue"
          @change="testDateChange"
          type="month"
          value-format="yyyy-MM"
          placeholder="请选择考核期间"
          style="width: 160px"
        ></el-date-picker>
      </div>
      <el-button type="success" v-print="printObj" @click="hideOperateColumn">打印汇总表</el-button>
    </div>
    <div id="printDiv" class="card_print_limit">
      <div class="card_content_title">财务部{{ syncYearMonth }}绩效考核汇总表</div>
      <div>
        <el-table class="card_table" border :data="totalTableData">
          <el-table-column prop="num" align="center" label="编号" width="50">
            <template slot-scope="scope">
              <span>{{ scope.row.num !== '合计' ? scope.$index + 1 : scope.row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="姓名" width="80"></el-table-column>
          <el-table-column prop="level" align="center" label="层级" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.num === '合计'">{{ scope.row.level }}</span>
              <span v-else>{{ scope.row.level === 1 ? '员工级' : '管理级' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="levelTwoScore" align="center" label="本月分值" width="80"></el-table-column>
          <el-table-column prop="levelScore" align="center" label="等级" width="70"></el-table-column>
          <el-table-column prop="bonus" align="center" label="奖励" width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.bonus !== 0 ? scope.row.bonus : '不奖励' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="comment" header-align="center" label="备注"></el-table-column>
          <el-table-column v-if="isShow" align="center" label="操作" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.num !== '合计'">
                <el-button
                  type="primary"
                  v-if="$store.state.userInfo.name === scope.row.name && scope.row.status === 5"
                  @click="updateState(scope.row.id)"
                >确认无误</el-button>
                <span v-else>{{ scope.row.status === 6 ? '已确认' : '未确认' }}</span>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="card_content_center">
          <div>制表人：</div>
          <div>财务总监：</div>
          <div>副总裁：</div>
        </div>

        <div class="content_footer_desc">绩效奖励计算基数（取平均工资数）：管理层考核计算基数为12000元，员工考核计算基数为8000元。</div>
        <el-table class="desc_table" border :data="computationalBaseData">
          <el-table-column prop="number" align="center" label="编号" width="80"></el-table-column>
          <el-table-column prop="score" align="center" label="考核分数"></el-table-column>
          <el-table-column prop="level" align="center" label="考评等级"></el-table-column>
          <el-table-column prop="factor" align="center" label="奖励对应系数"></el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>

<script>
import {
  apiGetEvaluationList,
  apiUpdateEvaluation
} from "../../../api/evaluation-form";

import { getMonthDate } from "../../../utils/common";

export default {
  name: "EvaluationSummaryForm",
  data() {
    return {
      testDateValue: getMonthDate("prev"),

      printObj: {
        id: "printDiv",
        beginCallback() {
          this.isShow = false;
        },
        endCallback() {
          this.isShow = true;
        }
      },

      totalTableData: [],

      computationalBaseData: [
        {
          number: "1",
          score: ">105",
          level: "优++",
          factor: "10%"
        },
        {
          number: "2",
          score: "101<分数≤105",
          level: "优+",
          factor: "5%"
        },
        {
          number: "3",
          score: "100-101",
          level: "优",
          factor: "200元"
        },
        {
          number: "4",
          score: "97<分数<100",
          level: "良",
          factor: "不奖励"
        },
        {
          number: "5",
          score: "90<分数≤97",
          level: "中",
          factor: "-5%"
        },
        {
          number: "6",
          score: "80<分数≤90",
          level: "差",
          factor: "-10%"
        }
      ],

      isShow: true
    };
  },
  computed: {
    syncYearMonth() {
      let dateArr = this.testDateValue.split("-");
      return dateArr[0] + "年" + dateArr[1] + "月";
    }
  },
  created() {
    this.getEvaluationList();
  },
  methods: {
    async getEvaluationList() {
      this.totalTableData = [];
      let res = await apiGetEvaluationList({
        deptName: this.$store.state.userInfo.deptName,
        level: this.$store.state.userInfo.level,
        examineId: this.$store.state.userInfo.id,
        userId: this.$store.state.userInfo.id,
        requestData: {
          examineDate: this.testDateValue + "-01"
        }
      });

      if (res.data.errorCode === 0 && res.data.data != "") {
        let totalScore = res.data.data.reduce((total, cur) => {
          return total + cur.bonus;
        }, 0);
        res.data.data.push({
          num: "合计",
          name: "-",
          level: "-",
          levelTwoScore: "-",
          levelScore: "-",
          bonus: totalScore,
          comment: "参与酒店公司考核，总部考核作为年终评选依据"
        });
        this.totalTableData = res.data.data;
      }
    },

    testDateChange() {
      this.getEvaluationList();
    },

    async updateState(id) {
      this.$confirm(`是否确认无误？`, "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(async () => {
          try {
            let res = await apiUpdateEvaluation({ id, status: 6 });
            if (res.data.errorCode === 0) {
              this.$message.success("确认成功");
              this.getEvaluationList();
            } else {
              this.$message.error("确认失败");
            }
          } catch (error) {
            this.$message.error("确认失败");
          }
        })
        .catch(() => {});
    },

    hideOperateColumn() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: calc(100% - 2px);
}

.card_header {
  display: flex;
  justify-content: space-between;
}

.card_header_title {
  font-weight: bold;
}

.card_print_limit {
  margin: auto;
  // a4纸宽为210mm，留些边距
  width: 180mm;
}

.card_content_title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.card_content_center {
  display: flex;
  justify-content: space-between;
  margin: 40px 120px 50px 0;
}

.content_footer_desc {
  font-size: 14px;
  margin-bottom: 10px;
}

::v-deep .card_table {
  th {
    padding: 3px 0 !important;
  }
  td {
    padding: 3px 0 !important;
  }
}

::v-deep .desc_table {
  th {
    padding: 0 !important;
  }
  td {
    padding: 0 !important;
  }
}

// 修改上面表格border样式
::v-deep .el-table {
  border-left: 1px solid #000;
  border-top: 1px solid #000;
}

::v-deep .el-table--border th {
  border-right: 1px solid #000;
}

::v-deep .el-table td {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
}

::v-deep .el-table th.is-leaf {
  border-bottom: 1px solid #000;
}

.el-table::before {
  border-bottom: 1px solid #000;
}

.el-table::after {
  border-right: 1px solid #000;
}

::v-deep .el-table thead th {
  color: #000;
  font-weight: normal;
}

// 修改下面表格border样式
::v-deep .desc_table.el-table {
  border-left: 2px solid #000;
  border-top: 2px solid #000;
}

::v-deep .desc_table.el-table--border th {
  border-right: 2px solid #000;
}

::v-deep .desc_table.el-table td {
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
}

::v-deep .desc_table.el-table th.is-leaf {
  border-bottom: 2px solid #000;
}

.desc_table.el-table::before {
  border-bottom: 2px solid #000;
}

.desc_table.el-table::after {
  border-right: 2px solid #000;
}

::v-deep .desc_table.el-table thead th {
  color: #000;
  font-weight: normal;
}
</style>