<template>
  <el-tabs class="evaluation_form_tabs" v-model="activeName" @tab-click="tabSelect" type="card">
    <!-- 我的考核表 -->
    <el-tab-pane label="我的考核表" name="myEvaluationForm" v-if="$store.state.userInfo.level < 3">
      <el-container>
        <transition name="draw">
          <el-aside
            :width="$store.state.userInfo.level === 1 ? '552px' : '442px'"
            v-show="myLeftAsideShow"
          >
            <el-card class="aside_card">
              <div slot="header" class="clearfix">
                <div class="card_header_title">历史记录</div>
                <div>
                  <span class="card_header_title">考核期间：</span>
                  <el-date-picker
                    v-model="myLeftTestDateValue"
                    @change="leftTestDateChange"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="请选择日期"
                    style="width: 134px; margin-top: 10px;"
                  ></el-date-picker>
                </div>
              </div>
              <el-table class="card_table" :data="leftTableData">
                <el-table-column prop="examineDate" label="期间" width="80">
                  <template slot-scope="scope">
                    <el-link
                      :type="scope.row.examineDate.slice(0, 7) === rightTestDateValue ? 'danger' : 'primary'"
                      @click="mySearchDate(scope.row.examineDate)"
                    >{{ scope.row.examineDate.slice(0, 7) }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="selfScore" label="自评分" width="70"></el-table-column>
                <el-table-column
                  prop="levelOneScore"
                  v-if="$store.state.userInfo.level !== 2"
                  label="一级领导评分"
                  width="110"
                ></el-table-column>
                <el-table-column prop="levelTwoScore" label="二级领导评分" width="110"></el-table-column>
                <el-table-column prop="status" label="状态" width="140">
                  <template slot-scope="scope">
                    <span>{{ scope.row.status | evaluationFormStateFormat() }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-aside>
        </transition>
        <el-main>
          <el-card class="main_card">
            <div slot="header" class="clearfix">
              <div class="card_header_top">
                <el-link
                  type="primary"
                  @click="unfoldShrinkAside"
                >{{ myLeftAsideShow ? '收起历史记录' : '展开历史记录'}}</el-link>
                <el-tag>考核表状态：{{ evaluationFormState | evaluationFormStateFormat() }}</el-tag>
              </div>
              <div
                v-if="evaluationFormState < 4"
                class="card_header_bottom"
                :class="evaluationFormState < 2 ? '' : 'btn_right'"
              >
                <el-button
                  v-if="evaluationFormState < 2"
                  type="success"
                  @click="openAddDialog"
                >新增指标项</el-button>
                <el-button
                  type="primary"
                  v-if="evaluationFormState < 3"
                  @click="startGrade"
                >{{isShow ? '开始自评' : '取消自评'}}</el-button>
              </div>
            </div>

            <el-table class="card_table" :data="rightTableData">
              <el-table-column prop="category" label="指标类别" width="140"></el-table-column>
              <el-table-column prop="weight" label="权重" width="60">
                <template slot-scope="scope">
                  <span>{{ scope.row.weight * 100 + '%' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="serialNumber" label="指标编号" width="80"></el-table-column>
              <el-table-column prop="kpiName" label="指标名称"></el-table-column>
              <el-table-column prop="targetValue" label="目标值">
                <template slot-scope="scope">
                  <span
                    :class="scope.row.isTargetEllipsis ? 'ellipsis' : ''"
                    @click="changeEllipsis(scope.row)"
                  >{{ scope.row.targetValue }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="standard" label="评价标准">
                <template v-if="scope.row.standard" slot-scope="scope">
                  <div
                    :class="index > 2 && scope.row.isStandardEllipsis ? 'hide' : ''"
                    v-for="(item,index) in scope.row.standard.split('\n')"
                    :key="index"
                    @click="changeEllipsis(scope.row)"
                  >
                    {{item}}
                    <span
                      :class="(scope.row.standard.split('\n').length > 3 && index === 2 && scope.row.isStandardEllipsis) ? 'showEllipsis' : 'hide'"
                    >...</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="selfScore" label="自评分" width="100">
                <template slot-scope="scope">
                  <div class="table_my_score">
                    <span v-if="isShow">{{scope.row.selfScore}}</span>
                    <span v-else>
                      <el-input v-model="scope.row.selfScore" type="number" size="mini"></el-input>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="事项详细" width="120px">
                <template slot-scope="scope">
                  <el-popover
                    :ref="`popover-${scope.$index}`"
                    placement="top"
                    width="700"
                    trigger="manual"
                    :key="scope.$index"
                    v-model="scope.row.myDetailPopoverVisible"
                  >
                    <el-table :data="detailTableData">
                      <el-table-column width="80" property="examineDate" label="考核期间">
                        <template slot-scope="scope">
                          <span>{{ scope.row.examineDate.slice(0,7) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="70" property="addSubtract" label="加/扣分">
                        <template slot-scope="scope">
                          <span>{{scope.row.addSubtract === 1 ? '加分' : '扣分' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="70" property="partyName" label="当事人"></el-table-column>
                      <el-table-column width="70" property="recorderName" label="记录人"></el-table-column>
                      <el-table-column width="100" property="createDate" label="记录日期"></el-table-column>
                      <el-table-column property="description" label="事项详细">
                        <template v-if="scope.row.description" slot-scope="scope">
                          <div
                            v-for="(item,index) in scope.row.description.split('\n')"
                            :key="index"
                          >{{item}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column width="70" property="status" label="状态">
                        <template slot-scope="scope">
                          <span>{{scope.row.status | eventStatusFormat() }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-link type="primary" slot="reference" @click="viewIncidentInfo(scope)">查看</el-link>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column v-if="evaluationFormState === 1" label="操作" width="180px">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="openEditDialog(scope)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteKpiItem(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="main_card_bottom">
              <div class="card_bottom_total">
                <span>得分合计：</span>
                <el-tag type="success">自评分：{{ selfScore }}</el-tag>
              </div>
              <div v-if="evaluationFormState < 3">
                <el-divider></el-divider>
                <el-button type="primary" @click="temporarySave">暂存</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-tab-pane>
    <!-- 我的考评表 -->

    <!-- 审核考评表 -->
    <el-tab-pane label="审核考评表" name="auditEvaluationForm" v-if="$store.state.userInfo.level > 1">
      <el-container>
        <transition name="draw">
          <el-aside
            :width="$store.state.userInfo.level === 2 ? '432px' : '542px'"
            v-show="auditLeftAsideShow"
          >
            <el-card class="aside_card">
              <div slot="header" class="clearfix">
                <div class="card_header_title">工作任务列表</div>
                <div class="card_header_content">
                  <div>
                    <span class="card_header_title">考核期间：</span>
                    <el-date-picker
                      v-model="auditLeftTestDateValue"
                      @change="leftTestDateChange"
                      type="month"
                      value-format="yyyy-MM"
                      placeholder="请选择日期"
                      style="width: 134px; margin-right: 20px"
                    ></el-date-picker>
                  </div>
                  <el-checkbox
                    v-model="leftAuditChecked"
                    @change="leftAuditCheckedChange"
                    label="待审"
                    border
                  ></el-checkbox>
                </div>
              </div>
              <el-table class="card_table" :data="leftTableData">
                <el-table-column prop="name" label="姓名" width="80">
                  <template slot-scope="scope">
                    <el-link
                      :type="scope.row.name === leftTestName ? 'danger' : 'primary'"
                      @click="auditSearchName(scope.row.name, scope.row.id)"
                    >{{ scope.row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="level" align="center" label="层级">
                  <template slot-scope="scope">
                    <span>{{ scope.row.level === 1 ? '员工级' : '管理级' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="selfScore" label="自评分" width="70"></el-table-column>
                <el-table-column prop="levelOneScore" label="一级领导评分" width="110"></el-table-column>
                <el-table-column
                  prop="levelTwoScore"
                  v-if="$store.state.userInfo.level === 3"
                  label="二级领导评分"
                  width="110"
                ></el-table-column>
                <el-table-column prop="status" label="状态" width="50">
                  <template slot-scope="scope">
                    <span>{{ scope.row.status | auditTaskListStateFormat($store.state.userInfo.level) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-aside>
        </transition>
        <el-main>
          <el-card class="main_card">
            <div slot="header" class="clearfix">
              <div class="card_header_top">
                <el-link
                  type="primary"
                  @click="unfoldShrinkAside"
                >{{ auditLeftAsideShow ? '收起工作任务' : '展开工作任务'}}</el-link>
                <el-tag>考核表状态：{{ evaluationFormState | evaluationFormStateFormat() }}</el-tag>
              </div>
              <div class="card_header_bottom">
                <el-tag type="success">{{ leftTestName === ' ' ? '暂无' : leftTestName + '的考核表' }}</el-tag>
                <el-button
                  type="primary"
                  v-if="evaluationFormState < ($store.state.userInfo.level === 2 ? 4 : 5)"
                  @click="startAudit"
                >{{isAuditShow ? '开始评定' : '取消评定'}}</el-button>
              </div>
            </div>
            <el-table class="card_table" :data="rightTableData">
              <el-table-column prop="category" label="指标类别" width="140"></el-table-column>
              <el-table-column prop="weight" label="权重" width="60">
                <template slot-scope="scope">
                  <span>{{ scope.row.weight * 100 + '%' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="serialNumber" label="指标编号" width="80"></el-table-column>
              <el-table-column prop="kpiName" label="指标名称"></el-table-column>
              <el-table-column prop="targetValue" label="目标值">
                <template slot-scope="scope">
                  <span
                    :class="scope.row.isTargetEllipsis ? 'ellipsis' : ''"
                    @click="changeEllipsis(scope.row)"
                  >{{ scope.row.targetValue }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="standard" label="评价标准">
                <template v-if="scope.row.standard" slot-scope="scope">
                  <div
                    :class="index > 2 && scope.row.isStandardEllipsis ? 'hide' : ''"
                    v-for="(item,index) in scope.row.standard.split('\n')"
                    :key="index"
                    @click="changeEllipsis(scope.row)"
                  >
                    {{item}}
                    <span
                      :class="(scope.row.standard.split('\n').length > 3 && index === 2 && scope.row.isStandardEllipsis) ? 'showEllipsis' : 'hide'"
                    >...</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="selfScore" label="自评分" width="100">
                <template slot-scope="scope">
                  <div class="table_my_score">
                    <span
                      v-if="isAuditShow || $store.state.userInfo.level !== 1"
                    >{{scope.row.selfScore}}</span>
                    <span v-else>
                      <el-input v-model="scope.row.selfScore" type="number" size="mini"></el-input>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="leftTestName !== $store.state.userInfo.name"
                prop="levelOneScore"
                label="一级领导评分"
                width="110"
              >
                <template slot-scope="scope">
                  <span
                    v-if="isAuditShow || $store.state.userInfo.level !== 2"
                  >{{scope.row.levelOneScore}}</span>
                  <span v-else>
                    <el-input v-model="scope.row.levelOneScore" type="number" size="mini"></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="levelTwoScore" label="二级领导评分" width="110">
                <template slot-scope="scope">
                  <span
                    v-if="isAuditShow || $store.state.userInfo.level !== 3"
                  >{{scope.row.levelTwoScore}}</span>
                  <span v-else>
                    <el-input v-model="scope.row.levelTwoScore" type="number" size="mini"></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="事项详细" width="120px">
                <template slot-scope="scope">
                  <el-popover
                    :ref="`popover-${scope.$index}`"
                    placement="top"
                    width="700"
                    trigger="manual"
                    :key="scope.$index"
                    v-model="scope.row.auditDetailPopoverVisible"
                  >
                    <el-table :data="detailTableData">
                      <el-table-column width="80" property="examineDate" label="考核期间">
                        <template slot-scope="scope">
                          <span>{{ scope.row.examineDate.slice(0,7) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="70" property="addSubtract" label="加/扣分">
                        <template slot-scope="scope">
                          <span>{{scope.row.addSubtract === 1 ? '加分' : '扣分' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="70" property="partyName" label="当事人"></el-table-column>
                      <el-table-column width="70" property="recorderName" label="记录人"></el-table-column>
                      <el-table-column width="100" property="createDate" label="记录日期"></el-table-column>
                      <el-table-column property="description" label="事项详细">
                        <template v-if="scope.row.description" slot-scope="scope">
                          <div
                            v-for="(item,index) in scope.row.description.split('\n')"
                            :key="index"
                          >{{item}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column width="70" property="status" label="状态">
                        <template slot-scope="scope">
                          <span>{{scope.row.status | eventStatusFormat() }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-link type="primary" slot="reference" @click="viewIncidentInfo(scope)">查看</el-link>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>

            <div class="main_card_bottom">
              <div class="card_bottom_total">
                <span>得分合计：</span>
                <el-tag type="success">自评分：{{ selfScore }}</el-tag>
                <el-tag
                  type="success"
                  v-if="leftTestName !== $store.state.userInfo.name"
                >一级领导评分：{{ levelOneScore }}</el-tag>
                <el-tag type="success">二级领导评分：{{ levelTwoScore }}</el-tag>
              </div>
              <div v-if="evaluationFormState < ($store.state.userInfo.level === 2 ? 4 : 5)">
                <el-divider></el-divider>
                <el-button type="primary" @click="submitAudit">提交</el-button>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-tab-pane>
    <!-- 审核考评表 -->

    <el-dialog :title="isAdd ? '新增考核指标项' : '编辑考核指标项'" :visible.sync="myDialogVisible" width="60%">
      <el-cascader
        :key="refresh"
        :props="cascaderProps"
        :options="cascaderOptions"
        v-model="cascaderKpiIdArr"
        separator=" - "
        placeholder="请选择考核指标项"
        clearable
        style="width: 100%"
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="myDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveKpiItem">确 认</el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
import {
  apiGetSelfAduit,
  apiGetEvaluationList,
  apiGetItemList,
  apiInsertEvaluationItem,
  apiUpdateEvaluationItem,
  apiDeleteEvaluationItem,
  apiUpdateEvaluationBatchItem,
  apiGetKpiTree,
  apiGetIncidentInfo
} from "../../../api/evaluation-form";

import { getMonthDate, treeFindPath } from "../../../utils/common";

let id = 1;

export default {
  name: "EvaluationForm",
  data() {
    return {
      activeName:
        this.$store.state.userInfo.level < 3
          ? "myEvaluationForm"
          : "auditEvaluationForm",
      myLeftTestDateValue: null,
      auditLeftTestDateValue: getMonthDate("prev"),
      leftTestName: "",
      leftTableData: [],
      // 待审单选框值
      leftAuditChecked: false,
      evaluationId: null,

      evaluationFormState: 1,
      evaluationFormLevel: 1,
      rightTestDateValue: getMonthDate("prev"),

      myDialogVisible: false,
      cascaderProps: {
        value: "id",
        label: "kpiTreeName"
      },
      cascaderKpiIdArr: [],
      cascaderOptions: [],
      refresh: true,
      isAdd: true,
      kpiIDetailtemId: null,
      weight: null,

      rightTableData: [],

      popoverRefresh: false,
      detailTableData: [],
      isShow: true,
      isAuditShow: true,

      myLeftAsideShow: true,
      auditLeftAsideShow: true
    };
  },
  computed: {
    selfScore() {
      if (this.evaluationFormState === 1 && this.isShow) {
        return "";
      }
      return (
        this.rightTableData.reduce((total, cur) => {
          let weightScore = cur.selfScore * cur.weight;
          return total + weightScore;
        }, 0) + 100
      );
    },
    levelOneScore() {
      if (
        this.evaluationFormState <= 3 &&
        (this.isAuditShow || this.$store.state.userInfo.level != 2)
      ) {
        return "";
      }
      return (
        this.rightTableData.reduce((total, cur) => {
          let weightScore = cur.levelOneScore * cur.weight;
          return total + weightScore;
        }, 0) + 100
      );
    },
    levelTwoScore() {
      if (
        this.evaluationFormState <= 4 &&
        (this.isAuditShow || this.$store.state.userInfo.level != 3)
      ) {
        return "";
      }
      return (
        this.rightTableData.reduce((total, cur) => {
          let weightScore = cur.levelTwoScore * cur.weight;
          return total + weightScore;
        }, 0) + 100
      );
    }
  },
  filters: {
    // 查看事项详情table里的状态
    eventStatusFormat(value) {
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
    },

    // 考核表状态
    evaluationFormStateFormat(value) {
      switch (value) {
        case 1:
          return "制表";
          break;
        case 2:
          return "暂存";
          break;
        case 3:
          return "提交审核";
          break;
        case 4:
          return "一级领导审核通过";
          break;
        case 5:
          return "二级领导审核通过";
          break;
        case 6:
          return "二级领导审核通过";
          break;

        default:
          return "制表";
          break;
      }
    },

    // 工作任务列表
    auditTaskListStateFormat(value, level) {
      if (level === 2) {
        return value < 4 ? "待审" : "已审";
      } else {
        return value < 5 ? "待审" : "已审";
      }
    }
  },
  async created() {
    if (this.$store.state.userInfo.level < 3) {
      // this.leftTestDateValue = null;
      this.getSelfAduit();
    } else {
      await this.getEvaluationList();
    }
    this.getItemList();
    this.getKpiTree();
  },
  methods: {
    // 获取历史记录
    async getSelfAduit() {
      let res = await apiGetSelfAduit({
        examineDate:
          this.myLeftTestDateValue + "-01" === "null-01"
            ? ""
            : this.myLeftTestDateValue + "-01",
        examineId: this.$store.state.userInfo.id
      });
      if (res.data.errorCode === 0) {
        this.leftTableData = res.data.data;
        this.getEvaluationId();
      }
    },
    // 获取工作任务列表
    async getEvaluationList() {
      let res = await apiGetEvaluationList({
        examineId: this.$store.state.userInfo.id,
        requestData: {
          examineDate:
            this.auditLeftTestDateValue + "-01" === "null-01"
              ? ""
              : this.auditLeftTestDateValue + "-01"
        }
      });

      if (res.data.errorCode === 0) {
        let leftTableData = JSON.parse(JSON.stringify(res.data.data));
        // 将管理层能审核的下属过滤出来
        leftTableData = leftTableData.filter(item => {
          if (this.$store.state.userInfo.level === 2) {
            return (
              item.status >= 3 && item.name !== this.$store.state.userInfo.name
            );
          } else {
            if (item.level === 1) {
              return item.status >= 4;
            } else {
              return item.status >= 3;
            }
          }
        });

        leftTableData = this.filterEvaluation(leftTableData);

        // 默认查第一个人的明细
        if (leftTableData != "") {
          this.leftTestName = leftTableData[0].name;
          this.evaluationId = leftTableData[0].id;
        } else {
          this.leftTestName = " ";
        }

        this.leftTableData = leftTableData;
      }
    },
    async getItemList() {
      let res = await apiGetItemList({
        examineDate: this.rightTestDateValue + "-01",
        name:
          this.activeName === "myEvaluationForm"
            ? this.$store.state.userInfo.name
            : this.leftTestName
      });

      if (res.data.errorCode === 0) {
        res.data.data.forEach(item => {
          item.myDetailPopoverVisible = false;
          item.auditDetailPopoverVisible = false;
          item.isTargetEllipsis = true;
          item.isStandardEllipsis = true;
        });
        this.rightTableData = res.data.data;
        if (res.data.data != "") {
          this.evaluationFormState = res.data.data[0].status;
          this.evaluationFormLevel = res.data.data[0].level;
        } else {
          this.evaluationFormState = 1;
          this.evaluationFormLevel = 1;
        }
      }
    },
    async getKpiTree() {
      let res = await apiGetKpiTree();
      if (res.data.errorCode === 0) {
        // 给指标类别加id，因为只有目标值才有id
        res.data.data.forEach(item => {
          item.id = id + "a";
          id++;
        });

        // 给指标名称加id
        res.data.data.forEach(item => {
          item.children.forEach(childItem => {
            childItem.id = id + "a";
            id++;
          });
        });
        this.cascaderOptions = res.data.data;
      }
    },

    // 过滤未审的
    filterEvaluation(leftTableData) {
      return leftTableData.filter(item => {
        if (this.$store.state.userInfo.level === 2) {
          return this.leftAuditChecked ? item.status < 4 : item.status;
        } else {
          return this.leftAuditChecked ? item.status < 5 : item.status;
        }
      });
    },

    // 根据左边table获取主表id
    getEvaluationId() {
      let testDateArr = this.leftTableData.filter(item => {
        return item.examineDate.includes(this.rightTestDateValue);
      });
      if (testDateArr != "") {
        this.evaluationId = testDateArr[0].id;
      }
    },

    async tabSelect(tabDom) {
      // console.log(tabDom);
      if (tabDom.name === "myEvaluationForm") {
        this.rightTestDateValue = getMonthDate("prev");
        this.getSelfAduit();
        this.getItemList();
      } else {
        this.rightTestDateValue = this.auditLeftTestDateValue;
        await this.getEvaluationList();
        this.getItemList();
      }
    },

    unfoldShrinkAside() {
      if (this.activeName === "myEvaluationForm") {
        this.myLeftAsideShow = !this.myLeftAsideShow;
      } else {
        this.auditLeftAsideShow = !this.auditLeftAsideShow;
      }
    },

    // 左边选择考核期间
    leftTestDateChange() {
      if (this.activeName === "myEvaluationForm") {
        this.rightTestDateValue = this.myLeftTestDateValue;
        this.getSelfAduit();
      } else {
        this.rightTestDateValue = this.auditLeftTestDateValue;
        this.getEvaluationList();
      }
      this.getItemList();
    },
    // 所有或未审
    leftAuditCheckedChange() {
      this.getEvaluationList();
    },

    // 我的考核表左边点击期间
    mySearchDate(date) {
      this.rightTestDateValue = date.slice(0, 7);
      this.getItemList();
      this.myLeftAsideShow = false;
    },

    // 审核考评表左边点击姓名
    auditSearchName(name, id) {
      this.rightTestDateValue = this.auditLeftTestDateValue;
      this.leftTestName = name;
      this.evaluationId = id;
      this.getItemList();
      this.auditLeftAsideShow = false;
    },

    // 点击省略的文本事件
    changeEllipsis(scopeRow) {
      scopeRow.isTargetEllipsis = !scopeRow.isTargetEllipsis;
      scopeRow.isStandardEllipsis = !scopeRow.isStandardEllipsis;
    },

    // 查看事项详细
    async viewIncidentInfo(scope) {
      if (
        scope.row.myDetailPopoverVisible &&
        this.activeName === "myEvaluationForm"
      ) {
        scope.row.myDetailPopoverVisible = false;
        return;
      }

      if (
        scope.row.auditDetailPopoverVisible &&
        this.activeName === "auditEvaluationForm"
      ) {
        scope.row.auditDetailPopoverVisible = false;
        return;
      }
      try {
        let res = await apiGetIncidentInfo({
          examineDate: scope.row.examineDate,
          partyId:
            this.activeName === "myEvaluationForm"
              ? this.$store.state.userInfo.id
              : scope.row.examineId,
          kpiId: scope.row.kpiId,
          status: 3
        });

        if (res.data.errorCode === 0) {
          this.detailTableData = res.data.data;
          if (this.activeName === "myEvaluationForm") {
            scope.row.myDetailPopoverVisible = true;
          } else {
            scope.row.auditDetailPopoverVisible = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    openAddDialog() {
      if (this.evaluationFormState > 1) {
        this.$message.info("非制表状态的考核表不能修改");
        return;
      }

      id = 1;
      this.isAdd = true;
      this.cascaderKpiIdArr = [];
      this.refresh = !this.refresh;
      this.myDialogVisible = true;
    },
    openEditDialog(scope) {
      id = 1;
      this.isAdd = false;
      this.cascaderKpiIdArr = treeFindPath(
        this.cascaderOptions,
        data => data.id == scope.row.kpiId
      );
      this.kpiIDetailtemId = scope.row.id;
      this.weight = scope.row.weight;
      this.refresh = !this.refresh;

      this.myDialogVisible = true;
    },

    async saveKpiItem() {
      let kpiId = this.cascaderKpiIdArr[this.cascaderKpiIdArr.length - 1];

      // 判断指标项是否重复
      let isSame = false;
      this.rightTableData.forEach(item => {
        if (item.kpiId === kpiId) {
          isSame = true;
        }
      });
      if (isSame) {
        this.$message.info("指标项不能重复");
        return;
      }

      if (this.isAdd) {
        try {
          let res = await apiInsertEvaluationItem({
            evaluationId: this.evaluationId,
            kpiId: this.cascaderKpiIdArr[this.cascaderKpiIdArr.length - 1]
          });

          if (res.data.errorCode === 0) {
            this.$message.success("新增成功");
            this.getItemList();
            this.myDialogVisible = false;
          } else {
            this.$message.error("新增失败，请检查是否有这个考核期间");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("新增失败，请检查是否有这个考核期间");
        }
      } else {
        try {
          let res = await apiUpdateEvaluationItem({
            evaluationId: this.evaluationId,
            id: this.kpiIDetailtemId,
            kpiId: this.cascaderKpiIdArr[this.cascaderKpiIdArr.length - 1]
          });

          if (res.data.errorCode === 0) {
            this.$message.success("修改成功");
            this.getItemList();
            this.myDialogVisible = false;
          } else {
            this.$message.error("修改失败");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("修改失败");
        }
      }
    },

    async deleteKpiItem(id) {
      this.$confirm(`确定删除此考核项吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let res = await apiDeleteEvaluationItem(id);
            if (res.data.errorCode === 0) {
              this.$message.success("删除成功");
              this.getItemList();
            } else {
              this.$message.error("删除失败");
            }
          } catch (error) {
            console.log(error);
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },

    // 开始自评
    startGrade() {
      if (this.evaluationFormState > 3) {
        this.$message.info("抱歉，您不能再修改");
        return;
      }

      this.isShow = !this.isShow;
      if (this.isShow) {
        this.getItemList();
      }
    },
    // 开始评定
    startAudit() {
      if (this.$store.state.userInfo.level === 2) {
        if (this.evaluationFormState < 3) {
          this.$message.info("抱歉，您还不能审核哦");
          return;
        }
      } else {
        if (this.evaluationFormLevel === 1) {
          if (this.evaluationFormState < 4) {
            this.$message.info("抱歉，您还不能审核哦");
            return;
          }
        } else {
          if (this.evaluationFormState < 3) {
            this.$message.info("抱歉，您还不能审核哦");
            return;
          }
        }
      }

      if (this.evaluationFormState === 5) {
        this.$message.info("抱歉，二级领导审核通过的不能再修改");
        return;
      }

      if (this.leftTestName === this.$store.state.userInfo.name) {
        this.$message.info("抱歉，您不能自己审核自己");
        return;
      }

      this.isAuditShow = !this.isAuditShow;
      if (this.isAuditShow) {
        this.getItemList();
      }
    },

    async temporarySave() {
      if (this.isShow) {
        this.$message.info("请先点击开始自评");
        return;
      }

      let rightTableData = JSON.parse(JSON.stringify(this.rightTableData));
      // 过滤自评分不为空的对象和只取id, weight, selfScore三个属性
      let requestData = rightTableData
        .filter(item => {
          return !!item.selfScore;
        })
        .map(item2 => {
          let newObj = {};
          newObj = (({ id, weight, selfScore }) => ({
            id,
            weight,
            selfScore
          }))(item2);
          return newObj;
        });

      try {
        let res = await apiUpdateEvaluationBatchItem({
          examineDate: this.rightTestDateValue + "-01",
          examineId: this.$store.state.userInfo.id,
          hierarchy: this.$store.state.userInfo.hierarchy,
          id: this.evaluationId,
          status: 2,
          requestData
        });
        if (res.data.errorCode === 0) {
          this.$message.success("暂存成功");
          this.isShow = true;
          this.getSelfAduit();
          this.getItemList();
        } else {
          this.$message.error("暂存失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("暂存失败");
      }
    },

    async submit() {
      if (this.isShow) {
        this.$message.info("请先点击开始自评");
        return;
      }

      let rightTableData = JSON.parse(JSON.stringify(this.rightTableData));
      // 过滤自评分不为空的对象和只取id, weight, selfScore三个属性
      let requestData = rightTableData
        .filter(item => {
          return item.selfScore !== null && item.selfScore !== "";
        })
        .map(item2 => {
          let newObj = {};
          newObj = (({ id, weight, selfScore }) => ({
            id,
            weight,
            selfScore
          }))(item2);
          return newObj;
        });

      if (requestData.length < this.rightTableData.length) {
        this.$message.info("还有未评分的考核项");
        return;
      }

      this.$confirm(`确定提交吗？一旦提交，不能再修改！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let res = await apiUpdateEvaluationBatchItem({
              examineDate: this.rightTestDateValue + "-01",
              hierarchy: this.$store.state.userInfo.hierarchy,
              id: this.evaluationId,
              status: 3,
              requestData
            });
            if (res.data.errorCode === 0) {
              this.$message.success("提交成功");
              this.isShow = true;
              this.getSelfAduit();
              this.getItemList();
            } else {
              this.$message.error("提交失败");
            }
          } catch (error) {
            console.log(error);
            this.$message.error("提交失败");
          }
        })
        .catch(() => {});
    },

    async submitAudit() {
      if (this.isAuditShow) {
        this.$message.info("请先点击开始评定");
        return;
      }

      let rightTableData = JSON.parse(JSON.stringify(this.rightTableData));
      // 过滤自评分不为空的对象和只取id, weight, selfScore三个属性
      let requestData = [];
      if (this.$store.state.userInfo.level === 2) {
        requestData = rightTableData
          .filter(item => {
            return item.levelOneScore !== null && item.levelOneScore !== "";
          })
          .map(item2 => {
            let newObj = {};
            newObj = (({ id, weight, levelOneScore }) => ({
              id,
              weight,
              levelOneScore
            }))(item2);
            return newObj;
          });
      } else {
        requestData = rightTableData
          .filter(item => {
            return item.levelTwoScore !== null && item.levelTwoScore !== "";
          })
          .map(item2 => {
            let newObj = {};
            newObj = (({ id, weight, levelTwoScore }) => ({
              id,
              weight,
              levelTwoScore
            }))(item2);
            return newObj;
          });
      }

      if (requestData.length < this.rightTableData.length) {
        this.$message.info("还有未评分的考核项");
        return;
      }

      this.$confirm(`确定提交吗？一旦提交，不能再修改！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let res = await apiUpdateEvaluationBatchItem({
              examineDate: this.rightTestDateValue + "-01",
              id: this.evaluationId,
              status: this.$store.state.userInfo.level === 2 ? 4 : 5,
              requestData
            });
            if (res.data.errorCode === 0) {
              this.$message.success("提交成功");
              this.isAuditShow = true;
              this.getEvaluationList();
              this.getItemList();
            } else {
              this.$message.error("提交失败");
            }
          } catch (error) {
            console.log(error);
            this.$message.error("提交失败");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.evaluation_form_tabs {
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
}

.el-container {
  height: 100%;
  background-color: #fff;

  .draw-enter-active,
  .draw-leave-active {
    transition: all 1s ease;
  }
  .draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width: 0 !important;
  }

  .target_title {
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    margin-left: 262px;
  }

  .aside_card {
    height: calc(100% - 2px);
    border-top: none;

    .card_header_title {
      font-weight: bold;
      text-align: center;
    }

    .card_header_content {
      display: flex;
      margin-top: 20px;
    }

    .activeDate {
      color: #771caa;
    }
  }

  .el-main {
    padding: 0;

    .main_card {
      height: calc(100% - 2px);

      .main_card_header {
        display: flex;
        justify-content: space-between;
      }

      .card_header_top {
        display: flex;
        justify-content: space-between;

        .header_top_left {
          display: flex;

          div {
            margin-right: 20px;
          }
        }
      }

      .card_header_bottom {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;

        &.btn_right {
          justify-content: flex-end;
        }
      }

      .card_header_title {
        font-weight: bold;
      }

      .card_table {
        width: 100%;

        .table_my_score {
          display: flex;
          justify-content: space-between;

          i {
            font-size: 22px;
            vertical-align: middle;
          }
        }

        .ellipsis {
          text-overflow: ellipsis;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .hide {
          display: none;
        }
        .showEllipsis {
          display: inline-block;
        }

        ::v-deep input::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        ::v-deep input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        ::v-deep input[type="number"] {
          -moz-appearance: textfield;
        }
      }

      .main_card_bottom {
        text-align: right;
        margin-top: 20px;

        .card_bottom_total {
          span {
            &:first-child {
              font-weight: bold;
            }
          }
          ::v-deep .el-tag {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>