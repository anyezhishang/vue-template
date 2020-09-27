<template>
  <el-tabs class="event_tabs" v-model="activeName" @tab-click="tabSelect" type="card">
    <!-- 我的 -->
    <el-tab-pane label="我的" name="myRecord">
      <el-card class="main_card">
        <div slot="header" class="clearfix main_card_header">
          <div>
            <span class="card_header_title">考核期间：</span>
            <el-date-picker
              v-model="myTestDateValue"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择考核期间"
              style="width: 160px"
            ></el-date-picker>
          </div>
          <div>
            <span class="card_header_title">记录人：</span>
            <el-input v-model="myRecorderName" placeholder="请输入记录人" clearable style="width: 150px"></el-input>
          </div>
          <div>
            <span class="card_header_title">记录日期：</span>
            <el-date-picker
              v-model="myRecorderDateArr"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            ></el-date-picker>
          </div>
          <div>
            <span class="card_header_title">事项关键字：</span>
            <el-input v-model="myKeyWord" placeholder="请输入关键字" clearable style="width: 150px"></el-input>
          </div>
          <div class="card_header_action action_right">
            <el-button type="primary" @click="searchMyRecord(false,1)">查询</el-button>
          </div>
        </div>
        <el-table class="card_table" :data="myTableData">
          <el-table-column prop="examineDate" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="examineDate" label="考核期间" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.examineDate.slice(0,7) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="kpiAndTargetValue" label="关联考核指标项"></el-table-column>
          <el-table-column prop="description" label="事项详细">
            <template v-if="scope.row.description" slot-scope="scope">
              <div
                :class="index > 2 && scope.row.isDetailEllipsis ? 'hide' : ''"
                v-for="(item,index) in scope.row.description.split('\n')"
                :key="index"
                @click="changeEllipsis(scope.row)"
              >
                {{item}}
                <span
                  :class="(scope.row.description.split('\n').length > 3 && index === 2 && scope.row.isDetailEllipsis) ? 'showEllipsis' : 'hide'"
                >...</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="addSubtract" label="加/扣分" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.addSubtract === 1 ? '加分' : '扣分' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="partyName" label="当事人" width="70"></el-table-column>
          <el-table-column prop="recorderName" label="记录人" width="70"></el-table-column>
          <el-table-column prop="createDate" label="记录日期" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.status | statusFormat() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="partyName" label="审批人" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.status === 3 || scope.row.status === 4 ? scope.row.partyName : '-'}}</span>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pa_right"
          background
          @current-change="pageChange"
          :current-page="myCurrentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="myTotal"
        ></el-pagination>
      </el-card>
    </el-tab-pane>

    <!-- 填报 -->
    <el-tab-pane label="填报" name="reportRecord">
      <el-card class="main_card">
        <div slot="header" class="clearfix main_card_header">
          <div>
            <span class="card_header_title">考核期间：</span>
            <el-date-picker
              v-model="reportTestDateValue"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择考核期间"
              style="width: 160px"
            ></el-date-picker>
          </div>
          <div>
            <span class="card_header_title">当事人：</span>
            <el-input v-model="reportPartyName" placeholder="请输入当事人" clearable style="width: 150px"></el-input>
          </div>
          <div>
            <span class="card_header_title">记录人：</span>
            <el-input
              v-model="reportRecorderName"
              placeholder="请输入记录人"
              clearable
              style="width: 150px"
            ></el-input>
          </div>
          <div>
            <span class="card_header_title">记录日期：</span>
            <el-date-picker
              v-model="reportRecorderDateArr"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            ></el-date-picker>
          </div>
          <div>
            <span class="card_header_title">事项关键字：</span>
            <el-input v-model="reportKeyWord" placeholder="请输入关键字" clearable style="width: 150px"></el-input>
          </div>
          <div class="card_header_action">
            <el-button type="success" @click="addRecord">新增记录</el-button>
            <el-button type="primary" @click="searchReportRecord(false,1)">查询</el-button>
          </div>
        </div>
        <el-table class="card_table" :data="reportTableData">
          <el-table-column prop="examineDate" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="examineDate" label="考核期间" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.examineDate.slice(0,7) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addSubtract" label="加/扣分" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.addSubtract === 1 ? '加分' : '扣分' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="partyName" label="当事人" width="70"></el-table-column>
          <el-table-column prop="recorderName" label="记录人" width="70"></el-table-column>
          <el-table-column prop="createDate" label="记录日期" width="100"></el-table-column>
          <el-table-column prop="kpiAndTargetValue" label="关联考核指标项"></el-table-column>
          <el-table-column prop="description" label="事项详细">
            <template v-if="scope.row.description" slot-scope="scope">
              <div
                :class="index > 2 && scope.row.isDetailEllipsis ? 'hide' : ''"
                v-for="(item,index) in scope.row.description.split('\n')"
                :key="index"
                @click="changeEllipsis(scope.row)"
              >
                {{item}}
                <span
                  :class="(scope.row.description.split('\n').length > 3 && index === 2 && scope.row.isDetailEllipsis) ? 'showEllipsis' : 'hide'"
                >...</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.status | statusFormat() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recorderName" label="审批人" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.status === 3 || scope.row.status === 4 ? scope.row.partyName : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recorderName" label="操作" width="80">
            <template
              v-if="(scope.row.status === 1 || scope.row.status === 4) && scope.row.recorderId === $store.state.userInfo.id"
              slot-scope="scope"
            >
              <el-button type="primary" size="mini" @click="editRecord(scope)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pa_right"
          background
          @current-change="pageChange"
          :current-page="reportCurrentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="reportTotal"
        ></el-pagination>
      </el-card>
    </el-tab-pane>

    <!--  审批 -->
    <el-tab-pane label="审批" name="recordApproval">
      <el-card class="main_card">
        <div slot="header" class="clearfix main_card_header">
          <div>
            <span class="card_header_title">考核期间：</span>
            <el-date-picker
              v-model="approvalTestDateValue"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择考核期间"
              style="width: 160px"
            ></el-date-picker>
          </div>
          <div>
            <span class="card_header_title">记录日期：</span>
            <el-date-picker
              v-model="approvalRecorderDateArr"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            ></el-date-picker>
          </div>
          <div>
            <span class="card_header_title">事项关键字：</span>
            <el-input v-model="approvalKeyWord" placeholder="请输入关键字" clearable style="width: 150px"></el-input>
          </div>
          <div>
            <span class="card_header_title">状态：</span>
            <el-select v-model="approvalStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="card_header_action action_right">
            <el-button type="primary" @click="searchApprovalRecord(false, 1)">查询</el-button>
          </div>
        </div>
        <el-table class="card_table" :data="approvalTableData">
          <el-table-column prop="examineDate" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="examineDate" label="考核期间" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.examineDate.slice(0,7) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addSubtract" label="加/扣分" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.addSubtract === 1 ? '加分' : '扣分' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="partyName" label="当事人" width="70"></el-table-column>
          <el-table-column prop="recorderName" label="记录人" width="70"></el-table-column>
          <el-table-column prop="createDate" label="记录日期" width="100"></el-table-column>
          <el-table-column prop="kpiAndTargetValue" label="关联考核指标项"></el-table-column>
          <el-table-column prop="description" label="事项详细">
            <template v-if="scope.row.description" slot-scope="scope">
              <div
                :class="index > 2 && scope.row.isDetailEllipsis ? 'hide' : ''"
                v-for="(item,index) in scope.row.description.split('\n')"
                :key="index"
                @click="changeEllipsis(scope.row)"
              >
                {{item}}
                <span
                  :class="(scope.row.description.split('\n').length > 3 && index === 2 && scope.row.isDetailEllipsis) ? 'showEllipsis' : 'hide'"
                >...</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="70">
            <template slot-scope="scope">
              <span>{{scope.row.status | statusFormat() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template
              v-if="scope.row.status === 2 && scope.row.partyId === $store.state.userInfo.id"
              slot-scope="scope"
            >
              <el-button type="warning" size="mini" @click="againstAudit(scope.row.id, 4)">驳回</el-button>
              <el-button type="primary" size="mini" @click="againstAudit(scope.row.id, 3)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="pa_right"
          background
          @current-change="pageChange"
          :current-page="approvalCurrentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="approvalTotal"
        ></el-pagination>
      </el-card>
    </el-tab-pane>

    <el-dialog :visible.sync="addDialogVisible" width="60%">
      <div class="main_card_header">
        <el-checkbox v-model="addChecked" label="填报其他部门" border></el-checkbox>
        <div v-if="!addChecked">
          <span class="card_header_title">当事人：</span>
          <el-autocomplete
            class="inline-input"
            v-model="addPartyName"
            value-key="name"
            :fetch-suggestions="querySearch"
            placeholder="请输入当事人"
            style="width: 150px"
          ></el-autocomplete>
        </div>
        <div v-else>
          <span class="card_header_title">当事人：</span>
          <el-input v-model="addOtherPartyName" placeholder="请输入当事人" clearable style="width: 150px"></el-input>
        </div>
        <div>
          <span class="card_header_title">考核期间：</span>
          <el-date-picker
            v-model="addTestDateValue"
            @change="addTestDateValueChange"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择考核期间"
            style="width: 160px"
          ></el-date-picker>
        </div>
        <div>
          <span class="card_header_title">加/扣分：</span>
          <el-radio-group v-model="addRadio">
            <el-radio-button label="加"></el-radio-button>
            <el-radio-button label="扣"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="dialog_item_margin">
        <span class="card_header_title">关联考核指标项：</span>
        <el-cascader
          :key="refresh"
          v-model="addKpiIdArr"
          :options="addKpiItemOptions"
          :props="addProps"
          separator=" - "
          placeholder="请选择关联考核指标项"
          clearable
          style="width: 100%"
        ></el-cascader>
      </div>
      <div class="dialog_item_margin">
        <span class="card_header_title">事项详细：</span>
        <el-input
          v-model="addEventDetail"
          type="textarea"
          :autosize="{ minRows: 2}"
          placeholder="请输入事项详细"
          clearable
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="temporarySave">暂 存</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
import {
  apiGetRecordPage,
  apiInsertEventRecord,
  apiUpdateEventRecord,
  apiAuditEventRecord
} from "../../../api/event-record";

import { apiGetKpiTree } from "../../../api/evaluation-form";

import { apiGetUserList } from "../../../api/user";

import { getMonthDate, treeFindPath } from "../../../utils/common";

let id = 1;

export default {
  name: "EventRecord",
  data() {
    return {
      activeName: "myRecord",
      testDateValue: "",

      myTestDateValue: getMonthDate("prev"),
      myRecorderName: this.$store.state.userInfo.name,
      myRecorderDateArr: [],
      myKeyWord: "",
      myTableData: [],

      myCurrentPage: 1,
      myTotal: 0, // 总条数

      reportTestDateValue: getMonthDate("prev"),
      reportPartyName: "",
      reportRecorderName: "",
      reportRecorderDateArr: [],
      reportKeyWord: "",
      reportTableData: [],

      reportCurrentPage: 1,
      reportTotal: 0, // 总条数

      approvalTestDateValue: getMonthDate("prev"),
      approvalRecorderDateArr: [],
      approvalKeyWord: "",
      approvalStatus: "",
      approvalTableData: [],

      approvalCurrentPage: 1,
      approvalTotal: 0, // 总条数

      pageSize: 10,

      addChecked: false,
      addPartyName: "",
      addOtherPartyName: "",
      addPartyId: "",
      addUserList: [],
      addTestDateValue: getMonthDate("prev"),
      addRadio: "加",
      addKpiItemOptions: [],
      addProps: {
        value: "id",
        label: "kpiTreeName"
      },
      addKpiIdArr: [],
      // refresh控制重新渲染el-cascader组件，解决清空级联报错的问题
      refresh: true,
      addEventDetail: "",

      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "暂存"
        },
        {
          value: "2",
          label: "待审核"
        },
        {
          value: "3",
          label: "已审核"
        },
        {
          value: "4",
          label: "驳回"
        }
      ],

      addDialogVisible: false
    };
  },
  filters: {
    statusFormat(value) {
      switch (value) {
        case 1:
          return "暂存";
          break;
        case 2:
          return "待审核";
          break;
        case 3:
          return "已审核";
          break;
        case 4:
          return "驳回";
          break;

        default:
          return "暂存";
          break;
      }
    }
  },
  watch: {
    addPartyName() {
      let partyArr = this.addUserList.filter(item => {
        return item.name == this.addPartyName;
      });
      if (partyArr.length === 1) {
        this.addPartyId = partyArr[0].id;
      } else {
        this.addPartyId = undefined;
      }
    }
  },
  created() {
    this.searchMyRecord(true, this.myCurrentPage);
    this.getKpiTree();
  },
  methods: {
    defaultTestDateFormat() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      return year + "-" + month;
    },
    async searchMyRecord(isFirst, pageIndex) {
      try {
        let res = await apiGetRecordPage({
          examineDate:
            this.myTestDateValue != null
              ? this.myTestDateValue + "-01"
              : undefined,
          recorderName: this.myRecorderName,
          startCreateDate:
            this.myRecorderDateArr != null
              ? this.myRecorderDateArr[0]
              : undefined,
          endCreateDate:
            this.myRecorderDateArr != null
              ? this.myRecorderDateArr[1]
              : undefined,
          description: this.myKeyWord,
          pageNum: pageIndex,
          pageSize: this.pageSize
        });
        if (res.data.errorCode === 0) {
          isFirst || this.$message.success("查询成功");
          res.data.data.list.forEach(item => {
            item.isDetailEllipsis = true;
          });
          this.myTableData = res.data.data.list;
          this.myTotal = res.data.data.count;
          this.myCurrentPage = res.data.data.pageNum;
        } else {
          this.$message.error("查询失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("查询失败");
      }
    },
    async searchReportRecord(isFirst, pageIndex) {
      try {
        let res = await apiGetRecordPage({
          examineDate:
            this.reportTestDateValue != null
              ? this.reportTestDateValue + "-01"
              : undefined,
          partyName: this.reportPartyName,
          recorderName: this.reportRecorderName,
          startCreateDate:
            this.reportRecorderDateArr != null
              ? this.reportRecorderDateArr[0]
              : undefined,
          endCreateDate:
            this.reportRecorderDateArr != null
              ? this.reportRecorderDateArr[1]
              : undefined,
          description: this.reportKeyWord,
          pageNum: pageIndex,
          pageSize: this.pageSize
        });
        if (res.data.errorCode === 0) {
          isFirst || this.$message.success("查询成功");
          res.data.data.list.forEach(item => {
            item.isDetailEllipsis = true;
          });
          this.reportTableData = res.data.data.list;
          this.reportTotal = res.data.data.count;
          this.reportCurrentPage = res.data.data.pageNum;
        } else {
          this.$message.error("查询失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("查询失败");
      }
    },
    async searchApprovalRecord(isFirst, pageIndex) {
      try {
        let res = await apiGetRecordPage({
          examineDate:
            this.approvalTestDateValue != null
              ? this.approvalTestDateValue + "-01"
              : undefined,
          partyName: this.$store.state.userInfo.name,
          startCreateDate:
            this.approvalRecorderDateArr != null
              ? this.approvalRecorderDateArr[0]
              : undefined,
          endCreateDate:
            this.approvalRecorderDateArr != null
              ? this.approvalRecorderDateArr[1]
              : undefined,
          description: this.approvalKeyWord,
          status: this.approvalStatus,
          pageNum: pageIndex,
          pageSize: this.pageSize
        });
        if (res.data.errorCode === 0) {
          isFirst || this.$message.success("查询成功");
          res.data.data.list.forEach(item => {
            item.isDetailEllipsis = true;
          });
          this.approvalTableData = res.data.data.list;
          this.approvalTotal = res.data.data.count;
          this.approvalCurrentPage = res.data.data.pageNum;
        } else {
          this.$message.error("查询失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("查询失败");
      }
    },

    pageChange(pageIndex) {
      switch (this.activeName) {
        case "myRecord":
          this.searchMyRecord(false, pageIndex);
          break;
        case "reportRecord":
          this.searchReportRecord(false, pageIndex);
          break;
        case "recordApproval":
          this.searchApprovalRecord(false, pageIndex);
          break;

        default:
          this.searchMyRecord(false, pageIndex);
          break;
      }
    },

    tabSelect(tabDom) {
      // console.log(tab);
      switch (tabDom.index) {
        case "0":
          this.searchMyRecord(true, this.myCurrentPage);
          break;
        case "1":
          this.searchReportRecord(true, this.reportCurrentPage);
          break;
        case "2":
          this.searchApprovalRecord(true, this.approvalCurrentPage);
          break;

        default:
          this.searchMyRecord(true, this.myCurrentPage);
          break;
      }
    },
    async getUserList() {
      try {
        let res = await apiGetUserList();
        if (res.data.errorCode === 0) {
          let addUserList = JSON.parse(JSON.stringify(res.data.data));
          // 除去总监
          this.addUserList = addUserList.filter(item => {
            return item.level !== 3;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getKpiTree() {
      let res = await apiGetKpiTree();
      if (res.data.errorCode === 0) {
        res.data.data.forEach(item => {
          item.id = id + "a";
          id++;
        });

        res.data.data.forEach(item => {
          item.children.forEach(childItem => {
            childItem.id = id + "a";
            id++;
          });
        });
        this.addKpiItemOptions = res.data.data;
      }
    },

    addRecord() {
      this.isAdd = true;
      this.resetAddDialogData();
      this.getUserList();
      this.addDialogVisible = true;
    },
    editRecord(scope) {
      this.isAdd = false;
      this.getUserList();
      this.editEventRecordId = scope.row.id;

      this.addPartyName = scope.row.partyName;
      this.addTestDateValue = scope.row.examineDate.slice(0, 7);
      this.addRadio = scope.row.addSubtract === 1 ? "加" : "扣";
      this.addKpiIdArr = treeFindPath(
        this.addKpiItemOptions,
        data => data.id == scope.row.kpiId
      );
      this.refresh = !this.refresh;
      this.addEventDetail =
        scope.row.description != null ? scope.row.description : "";
      this.recorderId = scope.row.recorderId;
      this.addDialogVisible = true;
    },
    querySearch(queryString, cb) {
      let addUserList = this.addUserList;
      let results = queryString
        ? addUserList.filter(this.createFilter(queryString))
        : addUserList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return item => {
        return item.name.includes(queryString);
      };
    },
    addTestDateValueChange() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let addDateYear = this.addTestDateValue.split("-")[0];
      let addDateMonth = this.addTestDateValue.split("-")[1];
      if (addDateYear > year || (year == addDateYear && addDateMonth > month)) {
        this.$message.error("不能给以后的考核期间添加事件");
        this.addTestDateValue = getMonthDate("prev");
      }
    },

    changeEllipsis(scopeRow) {
      scopeRow.isDetailEllipsis = !scopeRow.isDetailEllipsis;
    },

    async temporarySave() {
      if (this.isAdd) {
        try {
          let res = await apiInsertEventRecord({
            partyId: this.addPartyId,
            examineDate: this.addTestDateValue + "-01",
            addSubtract: this.addRadio === "加" ? 1 : -1,
            kpiId: this.addKpiIdArr[this.addKpiIdArr.length - 1],
            description: this.addEventDetail,
            status: 1,
            recorderId: this.$store.state.userInfo.id
          });
          if (res.data.errorCode === 0) {
            this.$message.success("暂存成功");
            this.resetAddDialogData();
            this.searchReportRecord(true, this.reportCurrentPage);
            this.addDialogVisible = false;
          } else {
            this.$message.error("暂存失败，请检查是否有未选择的和未填的");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("暂存失败，请检查是否有未选择的和未填的");
        }
      } else {
        try {
          let res = await apiUpdateEventRecord({
            userId: this.$store.state.userInfo.id,
            requestData: {
              id: this.editEventRecordId,
              partyId: this.addPartyId,
              examineDate: this.addTestDateValue + "-01",
              addSubtract: this.addRadio === "加" ? 1 : -1,
              kpiId: this.addKpiIdArr[this.addKpiIdArr.length - 1],
              description: this.addEventDetail,
              status: 1,
              recorderId: this.recorderId
            }
          });
          if (res.data.errorCode === 0) {
            this.$message.success("修改暂存成功");
            this.resetAddDialogData();
            this.searchReportRecord(true, this.reportCurrentPage);
            this.addDialogVisible = false;
          } else {
            this.$message.error("修改暂存失败，请检查是否有未选择的和未填的");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("修改暂存失败，请检查是否有未选择的和未填的");
        }
      }
    },
    async submit() {
      this.$confirm(`确定提交吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          if (this.isAdd) {
            try {
              let res = await apiInsertEventRecord({
                partyId: this.addPartyId,
                examineDate: this.addTestDateValue + "-01",
                addSubtract: this.addRadio === "加" ? 1 : -1,
                kpiId: this.addKpiIdArr[this.addKpiIdArr.length - 1],
                description: this.addEventDetail,
                status: 2,
                recorderId: this.$store.state.userInfo.id
              });
              if (res.data.errorCode === 0) {
                this.$message.success("提交成功");
                this.resetAddDialogData();
                this.searchReportRecord(true, this.reportCurrentPage);
                this.addDialogVisible = false;
              } else {
                this.$message.error("提交失败，请检查是否有未选择的和未填的");
              }
            } catch (error) {
              console.log(error);
              this.$message.error("提交失败，请检查是否有未选择的和未填的");
            }
          } else {
            try {
              let res = await apiUpdateEventRecord({
                userId: this.$store.state.userInfo.id,
                requestData: {
                  id: this.editEventRecordId,
                  partyId: this.addPartyId,
                  examineDate: this.addTestDateValue + "-01",
                  addSubtract: this.addRadio === "加" ? 1 : -1,
                  kpiId: this.addKpiIdArr[this.addKpiIdArr.length - 1],
                  description: this.addEventDetail,
                  status: 2,
                  recorderId: this.recorderId
                }
              });
              if (res.data.errorCode === 0) {
                this.$message.success("修改提交成功");
                this.resetAddDialogData();
                this.searchReportRecord(true, this.reportCurrentPage);
                this.addDialogVisible = false;
              } else {
                this.$message.error(
                  "修改提交失败，请检查是否有未选择的和未填的"
                );
              }
            } catch (error) {
              console.log(error);
              this.$message.error("修改提交失败，请检查是否有未选择的和未填的");
            }
          }
        })
        .catch(() => {});
    },
    resetAddDialogData() {
      this.addPartyName = "";
      this.addRadio = "加";
      this.addKpiIdArr = [];
      this.refresh = !this.refresh;
      this.addEventDetail = "";
    },

    async againstAudit(id, status) {
      let text = status === 4 ? "驳回" : "审核通过";
      this.$confirm(`确定${text}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let res = await apiAuditEventRecord({
              userId: this.$store.state.userInfo.id,
              requestData: {
                id,
                status
              }
            });
            if (res.data.errorCode === 0) {
              this.$message.success("操作成功");
              this.searchApprovalRecord(true, this.approvalCurrentPage);
            } else {
              this.$message.error("操作失败");
            }
          } catch (error) {
            console.log(error);
            this.$message.error("操作失败");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.event_tabs {
  background: #fff;
  height: 100%;

  ::v-deep .el-tabs__header {
    margin: 0;
  }

  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);

    .el-tab-pane {
      height: 100%;
    }
  }

  .main_card {
    height: 100%;
    border-top: none;

    .card_table {
      .hide {
        display: none;
      }
      .showEllipsis {
        display: inline-block;
      }
    }
  }

  .main_card_header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .card_header_action {
      flex-basis: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }

    .action_right {
      justify-content: flex-end;
    }
  }

  .card_header_title {
    font-weight: bold;
  }

  .dialog_item_margin {
    margin-top: 20px;
  }
}
</style>