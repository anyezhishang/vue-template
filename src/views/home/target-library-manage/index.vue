<template>
  <el-container>
    <el-aside width="auto" style="min-width: 355px">
      <el-card class="aside_card">
        <div slot="header" class="clearfix">
          <div class="card_header_title">指标类别 - 指标名称</div>
        </div>
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          :render-content="renderContent"
        ></el-tree>
        <div style="text-align: right; padding-right: 10px">
          <el-button size="mini" type="success" @click="startAdd">新增类别</el-button>
        </div>
      </el-card>
    </el-aside>
    <el-main>
      <el-card class="main_card">
        <div slot="header" class="clearfix">
          <div class="target_title">考核指标详细</div>
        </div>
        <el-table class="card_table" :data="targetDetailTableData">
          <el-table-column prop="serialNumber" label="指标编号" width="180"></el-table-column>
          <el-table-column prop="kpiName" label="指标名称" width="180"></el-table-column>
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="openDetailDialog(scope)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="remove({level: 3}, {id: scope.row.id}, scope)"
              >删除</el-button>
              <el-button
                v-if="scope.$index == targetDetailTableData.length-1"
                size="mini"
                type="success"
                @click="openDetailDialog(scope, true)"
              >新增目标值</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>

    <el-dialog
      :title="handleState | dialogTitleFormat()"
      :visible.sync="kpiDialogVisible"
      width="30%"
    >
      <el-form ref="kpiForm" :rules="kpiFormRules" :model="kpiForm" label-width="60px">
        <el-form-item label="名称" prop="category">
          <el-input v-model.trim="kpiForm.category"></el-input>
        </el-form-item>
        <el-form-item v-if="handleState === 1 || handleState === 2" label="权重" prop="weight">
          <el-input type="number" v-model="kpiForm.weight" style="width: 70px"></el-input>
          <span style="font-weight: bold; margin-left: 5px">%</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="kpiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveKpiItem">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="detailDialogTitle" :visible.sync="detailDialogVisible" width="30%">
      <el-form ref="detailForm" :rules="detailFormRules" :model="detailForm" label-width="80px">
        <el-form-item label="目标值" prop="targetValue">
          <el-input v-model="detailForm.targetValue"></el-input>
        </el-form-item>
        <el-form-item label="评价标准" prop="standard">
          <el-input v-model="detailForm.standard" type="textarea" :autosize="{ minRows: 2}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTargetDetail">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  apiGetCategoryAll,
  apiGetKpiNameInfo,
  apiGetTargetValueInfo,
  apiInsertKpiTree,
  apiUpdateKpiTree,
  apiDeleteKpiTree
} from "../../../api/target-library-manage";

let id = 1000;

export default {
  name: "TargetLibraryManage",
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "category"
      },

      kpiDialogVisible: false,
      handleState: 1,
      kpiForm: {
        category: "",
        weight: ""
      },
      // 同步树形控件上的值
      updateKpiItem: {},

      kpiFormRules: {
        category: [{ required: true, message: "请输入名称", trigger: "blur" }],
        weight: [
          { required: true, message: "请输入权重", trigger: "blur" },
          {
            // 除了数字有其他字符出现都报错
            pattern: /^\d*$/g,
            message: "格式错误，示例：50",
            trigger: "blur"
          }
        ]
      },

      // 记录最后一个大项节点
      lastNode: null,
      // 避免新增子节点时最后大项节点被改变
      parentNode: true,
      addItemNumber: 0,
      addTargetNameNumber: 0,

      editPopoverVisible: false,
      isAdd: true,
      oldCategory: "",

      treeParentData: null,

      // 用来新增目标值后同步更新table中的值
      targetValueNode: null,
      targetValueData: null,

      targetDetailTableData: [],
      detailDialogVisible: false,

      detailForm: {
        targetValue: "",
        standard: ""
      },
      detailFormRules: {
        targetValue: [
          { required: true, message: "请输入目标值", trigger: "blur" }
        ],
        standard: [
          { required: true, message: "请输入评价标准", trigger: "blur" }
        ]
      },

      detailDialogTitle: ""
    };
  },
  filters: {
    dialogTitleFormat(key) {
      switch (key) {
        case 1:
          return "新增指标类别";
          break;

        case 2:
          return "编辑指标类别";
          break;

        case 3:
          return "新增指标名称";
          break;

        case 4:
          return "编辑指标名称";
          break;

        default:
          return "新增指标类别";
          break;
      }
    }
  },
  created() {
    this.getCategoryAll();
  },
  methods: {
    // 获取指标类别
    async getCategoryAll() {
      let res = await apiGetCategoryAll();
      // console.log(res);

      if (res.data.errorCode === 0) {
        // res.data.data.forEach((item, index) => {
        //   item.serialNumber = index + 1 > 9 ? index + 1 : "0" + (index + 1);
        //   this.addItemNumber = index + 1;
        // });

        this.treeData = res.data.data;
      }
    },

    renderContent(h, { node, data, store }) {
      if (node.level === 1 && this.parentNode) {
        this.lastNode = node;
      }

      let editTooltipContent =
        node.level === 1 ? "编辑指标类别" : "编辑指标名称";
      let deleteTooltipContent =
        node.level === 1 ? "删除指标类别" : "删除指标名称";
      // console.log("node:", node);
      // console.log("data:", data);
      return (
        <span
          class="custom-tree-node"
          on-click={() => this.getKpiNameOrTargetValue(node, data)}
        >
          <span style="margin-right: 8px">
            {node.level === 1 ? data.categoryNumber : data.serialNumber}{" "}
            {node.label}
          </span>
          <span style="display: flex;align-items: center;">
            {node.level === 1 && (
              <el-tag size="mini" style="margin-left: 15px; margin-right: 8px">
                权重：{data.weight * 100 + "%"}
              </el-tag>
            )}
            {node.level === 1 && (
              <el-tooltip effect="dark" content="新增指标名称" placement="top">
                <i
                  class="iconfont icon-zengjia"
                  style="font-size: 18px;margin-right: 8px"
                  on-click={() => this.startAppend(data)}
                ></i>
              </el-tooltip>
            )}
            <el-tooltip
              effect="dark"
              content={editTooltipContent}
              placement="top"
            >
              <i
                class="iconfont icon-xiugai"
                style="font-size: 18px;margin-right: 8px"
                on-click={() => this.startEdit(node, data)}
              ></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content={deleteTooltipContent}
              placement="top"
            >
              <i
                class="iconfont icon-shanchu-guanbi"
                style="font-size: 18px;margin-right: 8px;color: #f56c6c"
                on-click={() => this.remove(node, data)}
              ></i>
            </el-tooltip>
          </span>
        </span>
      );
    },
    // 打开新增指标类别dialog
    startAdd() {
      this.handleState = 1;
      this.isAdd = true;
      this.kpiForm.category = "";
      this.kpiForm.weight = "";
      this.kpiDialogVisible = true;
    },
    // 打开新增指标名称dialog
    startAppend(data) {
      // console.log("parentData:", data);
      this.handleState = 3;
      this.kpiForm.category = "";
      this.kpiDialogVisible = true;
      this.treeParentData = data;
    },
    // 打开编辑指标类别或者指标名称dialog
    startEdit(node, data) {
      // console.log("editData：", data);
      // console.log("editNode：", node);

      node.level === 1 ? (this.handleState = 2) : (this.handleState = 4);
      this.isAdd = false;
      this.oldCategory = data.category;
      this.updateKpiItem = data;

      this.kpiForm.category = data.category;
      this.kpiForm.weight = data.weight * 100;
      this.kpiDialogVisible = true;
      this.treeParentData = node.parent.data;
    },

    // 新增或者编辑指标类别和指标名称
    saveKpiItem() {
      this.$refs["kpiForm"].validate(async valid => {
        if (valid) {
          let newKpiForm = JSON.parse(JSON.stringify(this.kpiForm));
          let isCategorySame = false;
          let nextCategoryNumber = 0;
          let nextSerialNumber = 0;
          let parentData = null;
          newKpiForm.weight = newKpiForm.weight / 100;

          if (this.handleState <= 2) {
            isCategorySame = this.treeData.some(item => {
              return item.category == newKpiForm.category;
            });
          } else {
            // 找出新增或者编辑的指标名称的父节点
            parentData = this.treeData.filter(item => {
              return item.category === this.treeParentData.category;
            });
            if (!!parentData[0].children) {
              // 判断新增或者编辑的指标名称是否重复
              isCategorySame = parentData[0].children.some(item => {
                return item.kpiName == newKpiForm.category;
              });
            }
          }

          // 名称重复验证
          if (isCategorySame) {
            this.handleState <= 2
              ? this.$message.info("指标类别名称重复")
              : this.$message.info("指标名称重复");
            return;
          }

          // 新增指标类型时
          if (this.handleState === 1) {
            // 如果为空，则是第一次增，序号为01
            if (this.treeData == "") {
              newKpiForm.categoryNumber = "01";
            } else {
              // 如果不为空，则序号根据最后一项的序号递增
              nextCategoryNumber =
                this.treeData[this.treeData.length - 1].categoryNumber * 1 + 1;
              newKpiForm.categoryNumber =
                nextCategoryNumber <= 9
                  ? "0" + nextCategoryNumber
                  : nextCategoryNumber;
            }

            // 新增指标名称时
          } else if (this.handleState == 3) {
            // 如果父节点下的children为undefined，则是增父节点下第一个指标名称，序号直接为：父节点序号.001
            if (parentData[0].children == undefined) {
              nextSerialNumber = this.treeParentData.categoryNumber + ".001";
            } else {
              // 如果不为undefined，则序号根据最后一项的序号递增
              nextSerialNumber =
                parentData[0].children[
                  parentData[0].children.length - 1
                ].serialNumber.split(".")[1] *
                  1 +
                1 +
                "";

              // 给nextSerialNumber前面加0后再加父节点序号
              nextSerialNumber =
                this.treeParentData.categoryNumber +
                (nextSerialNumber.length === 1
                  ? ".00" + nextSerialNumber
                  : ".0" + nextSerialNumber);
            }

            // 新增指标名称时需要同时传入指标类型序号和指标名称序号
            newKpiForm.categoryNumber = this.treeParentData.categoryNumber;
            newKpiForm.serialNumber = nextSerialNumber;
          }

          this.kpiDialogVisible = false;
          this.parentNode = false;

          switch (this.handleState) {
            // 新增指标类别
            case 1:
              this.parentNode = true;
              let res1 = await apiInsertKpiTree(newKpiForm);
              if (res1.data.errorCode === 0) {
                // if (this.treeData == "") {
                this.getCategoryAll();
                // } else {
                //   this.$refs.tree.insertAfter(newKpiForm, this.lastNode);
                // }
                this.$message.success("新增成功");
              } else {
                this.addItemNumber--;
                this.$message.error("新增失败");
              }
              break;
            // 修改指标类别
            case 2:
              let res2 = await apiUpdateKpiTree({
                oldCategory: this.oldCategory,
                newCategory: newKpiForm.category,
                weight: newKpiForm.weight
              });
              if (res2.data.errorCode === 0) {
                // 同步树形控件上的值
                this.updateKpiItem.category = newKpiForm.category;
                this.updateKpiItem.weight = newKpiForm.weight;
                this.$message.success("修改成功");
              } else {
                this.$message.error("修改失败");
              }
              break;
            // 新增指标名称
            case 3:
              let treeParentData = this.treeParentData;
              // console.log(treeParentData);

              let res3 = await apiInsertKpiTree({
                categoryNumber: newKpiForm.categoryNumber,
                serialNumber: newKpiForm.serialNumber,
                category: treeParentData.category,
                weight: treeParentData.weight,
                kpiName: newKpiForm.category
              });
              if (res3.data.errorCode === 0) {
                const newChild = {
                  categoryNumber: newKpiForm.categoryNumber,
                  serialNumber: newKpiForm.serialNumber,
                  category: newKpiForm.category,
                  kpiName: newKpiForm.category
                };
                if (!treeParentData.children) {
                  this.$set(treeParentData, "children", []);
                }
                treeParentData.children.push(newChild);
                this.$message.success("新增成功");
              } else {
                this.addItemNumber--;
                this.$message.error("新增失败");
              }

              break;
            // 修改指标名称
            case 4:
              let res4 = await apiUpdateKpiTree({
                oldKpiName: this.oldCategory,
                newKpiName: newKpiForm.category
              });
              if (res4.data.errorCode === 0) {
                // 同步树形控件上的值
                this.updateKpiItem.category = newKpiForm.category;
                this.updateKpiItem.kpiName = newKpiForm.category;

                // 同步右边table中的值
                this.targetDetailTableData.forEach(item => {
                  item.kpiName = newKpiForm.category;
                });
                this.$message.success("修改成功");
              } else {
                this.$message.error("修改失败");
              }
              break;

            default:
              break;
          }
        }
      });
    },

    // 删除指标类别或者指标名称或者目标值
    remove(node, data, scope) {
      // console.log("rmnode:", node);
      // console.log("rmdata:", data);
      let title = "";
      switch (node.level) {
        case 1:
          title = "指标类别";
          break;
        case 2:
          title = "指标名称";
          break;
        case 3:
          title = "目标值";
          break;

        default:
          title = "指标类别";
          break;
      }

      if (node.level === 3 && this.targetDetailTableData.length === 1) {
        this.$message.info("请在左边直接删除此指标");
        return;
      }

      this.$confirm(`确定要删除此${title}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let parent = "";
          let children = "";
          let index = "";
          if (node.level === 2) {
            parent = node.parent;
            children = parent.data.children || parent.data;
            index = children.findIndex(d => d.category === data.category);
          }

          try {
            let res = await apiDeleteKpiTree({
              category: node.level === 1 ? data.category : undefined,
              kpiName: node.level === 2 ? data.kpiName : undefined,
              id: node.level === 3 ? data.id : undefined
            });
            // console.log(res);
            if (res.data.errorCode === 0) {
              if (node.level === 1) {
                this.getCategoryAll();
              } else if (node.level == 2) {
                children.splice(index, 1);
                this.getKpiNameOrTargetValue(node, data);
              } else {
                this.targetDetailTableData.splice(scope.$index, 1);
              }

              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.errorMessage);
            }
          } catch (error) {
            this.$message.error("错误：删除失败");
            console.log(error);
          }
        })
        .catch(() => {});
    },

    // 获取指标名称或者目标值
    async getKpiNameOrTargetValue(node, data) {
      // console.log('node:',node);
      // console.log("data:", data);
      if (data.children != undefined) {
        this.addTargetNameNumber = data.children.length;
        return;
      } else if (node.level === 1) {
        this.addTargetNameNumber = 0;

        let res = await apiGetKpiNameInfo(data.category);
        // console.log(res);
        if (res.data.errorCode === 0 && res.data.data != "") {
          this.parentNode = false;
          res.data.data.forEach((item, index) => {
            item.category = item.kpiName;
            // item.serialNumber =
            //   index + 1 > 9
            //     ? data.serialNumber + ".0" + index + 1
            //     : data.serialNumber + ".00" + (index + 1);
            // this.addTargetNameNumber = index + 1;
          });
          if (!data.children) {
            this.$set(data, "children", []);
          }
          data.children = res.data.data;
        }
      } else {
        this.targetValueNode = node;
        this.targetValueData = data;
        let res = await apiGetTargetValueInfo({
          category: node.parent.label,
          kpiName: data.kpiName
        });
        // console.log(res);
        if (res.data.errorCode === 0) {
          res.data.data.forEach(item => {
            item.isTargetEllipsis = true;
            item.isStandardEllipsis = true;
          });
          this.targetDetailTableData = res.data.data;
        }
      }
    },

    changeEllipsis(scopeRow) {
      scopeRow.isTargetEllipsis = !scopeRow.isTargetEllipsis;
      scopeRow.isStandardEllipsis = !scopeRow.isStandardEllipsis;
    },

    openDetailDialog(scope, isAdd) {
      this.detailForm.id = "";
      this.detailForm.kpiName = "";
      this.detailForm.targetValue = "";
      this.detailForm.standard = "";
      this.detailDialogTitle = isAdd ? "新增目标值" : "编辑目标值";

      this.detailForm.kpiName = scope.row.kpiName;
      if (isAdd) {
        this.detailForm.category = scope.row.category;
        this.detailForm.categoryNumber = scope.row.categoryNumber;
        this.detailForm.serialNumber = scope.row.serialNumber;
        this.detailForm.weight = scope.row.weight;
        this.detailForm.standard = scope.row.standard;
      } else {
        this.detailForm.id = scope.row.id;
        this.detailForm.targetValue = scope.row.targetValue;
        this.detailForm.standard = scope.row.standard;

        this.updateDetailData = scope.row;
      }
      this.detailDialogVisible = true;
    },
    // 新增或者编辑目标值
    saveTargetDetail() {
      this.$refs["detailForm"].validate(async valid => {
        if (valid) {
          if (!this.detailForm.id) {
            let res = await apiInsertKpiTree(this.detailForm);
            if (res.data.errorCode === 0) {
              // this.targetDetailTableData.push(this.detailForm);
              this.$message.success("新增成功");
              this.getKpiNameOrTargetValue(
                this.targetValueNode,
                this.targetValueData
              );
            } else {
              this.$message.error("新增失败");
            }
          } else {
            // 修改目标值
            let res = await apiUpdateKpiTree(this.detailForm);
            if (res.data.errorCode === 0) {
              // 修改评价标准
              let res = await apiUpdateKpiTree({
                oldKpiName: this.detailForm.kpiName,
                standard: this.detailForm.standard
              });
              if (res.data.errorCode === 0) {
                // 同步table上的值
                this.getKpiNameOrTargetValue(
                  this.targetValueNode,
                  this.targetValueData
                );
                this.$message.success("修改成功");
              }
            } else {
              this.$message.error("修改失败");
            }
          }

          this.detailDialogVisible = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  background-color: #fff;

  .el-aside {
    .aside_card {
      height: calc(100% - 2px);

      .card_header_title {
        font-weight: bold;
        text-align: center;
      }
    }

    ::v-deep .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }

  .el-main {
    padding: 0;

    .main_card {
      height: calc(100% - 2px);

      ::v-deep .el-card__body {
        padding-top: 0;
      }

      .card_table {
        width: 100%;

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
      }
    }

    .target_title {
      font-weight: bold;
      text-align: center;
    }
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
</style>