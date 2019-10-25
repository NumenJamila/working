<template>
  <div>
    <Main @mainSearch="mainSearch" :showText="searchText">
      <div class="detail-page customize-container-center">
        <tabItemBar :whichItem="whichItem" @tabClick="tabClick" class="tab-pane-class"></tabItemBar>
        <div class="detail-left">
          <div class="detail-company-name">
            <Icon class="d-icon" type="ios-send-outline" />
            <span class="company-Name">{{companyName}}</span>
            <!-- <span class="tag-name" v-if="formatTag(companyInfo.flag)">[{{formatTag(companyInfo.flag)}}]</span> -->
          </div>
          <div class="nav">
            <ul class="nav-centent">
              <li>
                <a @click="goUrl('CompanyBase')">基础信息</a>
                <span></span>
              </li>
              <!-- <li>
                <a @click="goUrl('CompanyCooperate')" class>合作信息</a>
                <span></span>
              </li>-->
              <li>
                <a @click="goUrl('CompanyAppraise')" class>综合评价</a>
                <span></span>
              </li>
              <li class="numen-active">
                <a @click="goUrl('CorporateInvestmentFinance')" class>投融资</a>
                <span></span>
              </li>
              <!-- <li>
                <a @click="goUrl('CorporateAffiliation')" class>关联</a>
                <span></span>
              </li>-->
              <!-- <li>
                <a @click="goUrl('CompanyNavigation')" class>导航</a>
                <span></span>
              </li>-->
            </ul>
          </div>
          <div class="tab-item" id="financeChart">
            <div class="penetrate-chart">
              <div class="bt-group">
                <button class="save" @click="saveImg">保存</button>
                <button class="reset" @click="resetSvg">重置</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  </div>
</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import Main from "@/components/main";
import tabItemBar from "@/components/tabItemBar";
// import companyinfo from "@/api/companyinfo"
import { getCompanyPartner } from "@/services";
import { state } from "@/store";

// 过渡时间
const DURATION = 0;
// 加减符号半径
const SYMBOLA_S_R = 9;
// 公司
const COMPANY = "1";
// 人
const PERSON = "0";
export default {
  props: {},
  components: {
    Main,
    tabItemBar
  },
  data() {
    return {
      searchText: "",
      whichItem: "SearchCompany",
      companyNo: "",
      companyName: "",
      cooperate: [],
      queryCondition: {
        companyNo: ""
      },
      layoutTree: "",
      diamonds: "",
      i: 0,
      hasChildNodeArr: [],
      originDiamonds: "",
      diagonalUp: "",
      diagonalDown: "",
      tree: {},
      // tree: {
      //   name: "惠州巨合电子商务有限公司(广东省惠州市)",
      //   children: [
      //     { name: "一卡通公司", type: 0 },
      //     {
      //       name: "一卡通公司2",
      //       type: 0,
      //       children: [
      //         {
      //           name: "小公司",
      //           type: 0,
      //           children: [
      //             {
      //               name: "小小小",
      //               type: 0,
      //               children: [{ type: 1, name: "笑小下" }]
      //             }
      //           ]
      //         },
      //         { type: 0, name: "小公司2" }
      //       ]
      //     },
      //     {
      //       name: "一卡通公司2333",
      //       type: 0,
      //       children: [
      //         { type: 0, name: "小公司" },
      //         { type: 0, name: "小公司2" }
      //       ]
      //     },
      //     { name: "一卡通公司", type: 0 },
      //     {
      //       name: "一卡通公司2",
      //       type: 0,
      //       children: [
      //         {
      //           name: "小公司",
      //           type: 0,
      //           children: [
      //             {
      //               name: "小小小",
      //               type: 0,
      //               children: [{ type: 1, name: "笑小下" }]
      //             }
      //           ]
      //         },
      //         { type: 0, name: "小公司2" }
      //       ]
      //     },
      //     {
      //       name: "一卡通公司2333",
      //       type: 0,
      //       children: [
      //         { type: 0, name: "小公司" },
      //         { type: 0, name: "小公司2" }
      //       ]
      //     },
      //     { name: "一卡通公司", type: 0 },
      //     {
      //       name: "一卡通公司2",
      //       type: 0,
      //       children: [
      //         {
      //           name: "小公司",
      //           type: 0,
      //           children: [
      //             {
      //               name: "小小小",
      //               type: 0,
      //               children: [{ type: 1, name: "笑小下" }]
      //             }
      //           ]
      //         },
      //         { type: 0, name: "小公司2" }
      //       ]
      //     },
      //     {
      //       name: "一卡通公司2333",
      //       type: 0,
      //       children: [
      //         { type: 0, name: "小公司" },
      //         { type: 0, name: "小公司2" }
      //       ]
      //     },
      //     { type: 0, name: "一卡通公司2222" }
      //   ],
      //   parents: [
      //     {
      //       name: "大公司",
      //       type: 0,
      //       children: [
      //         {
      //           name: "发发委",
      //           type: 0,
      //           money: "780万元",
      //           children: [{ type: 0, money: "780万元", name: "123" }]
      //         },
      //         {
      //           name: "123发发委",
      //           money: "780万元",
      //           type: 0,
      //           children: [{ money: "780万元", type: 0, name: "123" }]
      //         }
      //       ]
      //     },
      //     {
      //       name: "多多网",
      //       money: "780万元",
      //       type: 0,
      //       children: [{ type: 0, money: "780万元", name: "发哈哈" }]
      //     },
      //     {
      //       name: "龙龙投资",
      //       money: "780万元",
      //       type: 0,
      //       children: [
      //         { type: 1, money: "780万元", name: "王林" },
      //         { type: 1, money: "780万元", name: "张峰" },
      //         { type: 1, money: "780万元", name: "侯明" }
      //       ]
      //     }
      //   ]
      // },
      rootUp: "",
      rootDown: "",
      svg: ""
    };
  },
  computed: {
    // searchText() {
    //   return state.searchText;
    // }
  },
  created() {
    this.companyNo = this.$route.query.companyNo;
    this.searchText = state.searchText;
    this.queryCondition.companyNo = this.companyNo;
    this.GetCompanyPartner();
  },
  mounted() {},
  methods: {
    tabClick(url) {
      this.$router.push({ name: url });
    },
    goUrl(url) {
      this.$router.push({ name: url, query: { companyNo: this.companyNo } });
    },
    GetCompanyPartner() {
      getCompanyPartner(this.queryCondition).then(res => {
        if (res.isSuccess) {
          this.companyName = res.data.companyName;
          this.tree.companyName = res.data.companyName;
          this.tree.parents = res.data.gudong;
          this.tree.children = res.data.touzi;
          this.init();
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    mainSearch(searchText) {
      // this.queryCondition.companyName = searchText;
      // this.doSearchResult();
      this.$router.push("/searchcompany");
    },
    init() {
      // let d3 = this.d3
      // let svgW = document.body.clientWidth;
      let svgW = 1200;
      let svgH = 560;
      // 方块形状
      this.diamonds = {
        w: 145,
        h: 68,
        intervalW: 200,
        intervalH: 150
      };
      // 源头对象
      this.originDiamonds = {
        w: 190,
        h: 40
      };
      this.layoutTree = d3
        .tree()
        .nodeSize([this.diamonds.intervalW, this.diamonds.intervalH])
        .separation(() => 1);
      // 主图
      this.svg = d3
        .select("#financeChart")
        .append("svg")
        .attr("width", svgW)
        .attr("height", svgH)
        .attr("id", "treesvg")
        .call(
          d3
            .zoom()
            .scaleExtent([0, 5])
            .on("zoom", () => {
              // 设置缩放位置以及平移初始位置
              this.svg.attr(
                "transform",
                d3.event.transform.translate(svgW / 2, svgH / 2)
              );
            })
        )
        .attr("style", "position: relative;z-index: 2;")
        .append("g")
        .attr("id", "g")
        .attr("transform", "translate(" + svgW / 2 + "," + svgH / 2 + ")");
      let upTree = null;
      let downTree = null;
      // 拷贝树的数据
      Object.keys(this.tree).map(item => {
        if (item === "parents") {
          upTree = JSON.parse(JSON.stringify(this.tree));
          upTree.children = this.tree[item];
          upTree.parents = null;
        } else if (item === "children") {
          downTree = JSON.parse(JSON.stringify(this.tree));
          downTree.children = this.tree[item];
          downTree.parents = null;
        }
      });
      // hierarchy 返回新的结构 x0,y0初始化起点坐标
      this.rootUp = d3.hierarchy(upTree, d => d.children);
      this.rootUp.x0 = 0;
      this.rootUp.y0 = 0;
      this.rootDown = d3.hierarchy(downTree, d => d.children);
      this.rootDown.x0 = 0;
      this.rootDown.y0 = 0;
      // 上 和 下 结构
      let treeArr = [
        {
          data: this.rootUp,
          type: "up"
        },
        {
          data: this.rootDown,
          type: "down"
        }
      ];
      treeArr.map(item => {
        item.data.children.forEach(this.collapse);
        this.update(item.data, item.type, item.data);
      });
    },
    /*
     *[update 函数描述], [click 函数描述]
     *  @param  {[Object]} source 第一次是初始源对象，后面是点击的对象
     *  @param  {[String]} showtype up表示向上 down表示向下
     *  @param  {[Object]} sourceTree 初始源对象
     */
    update(source, showtype, sourceTree) {
      let _this = this;
      if (source.parents === null) {
        source.isOpen = !source.isOpen;
      }
      let nodes;
      if (showtype === "up") {
        nodes = this.layoutTree(this.rootUp).descendants();
      } else {
        nodes = this.layoutTree(this.rootDown).descendants();
      }
      let links = nodes.slice(1);
      nodes.forEach(d => {
        d.y = d.depth * this.diamonds.intervalH;
      });
      let node = this.svg
        .selectAll("g.node" + showtype)
        .data(nodes, d => d.id || (d.id = showtype + ++this.i));
      let nodeEnter = node
        .enter()
        .append("g")
        .attr("class", d =>
          showtype === "up" && !d.depth ? "hide-node" : "node" + showtype
        )
        .attr("transform", d =>
          showtype === "up"
            ? "translate(" + d.x + "," + -d.y + ")"
            : "translate(" + d.x + "," + d.y + ")"
        );
      // 创建矩形
      nodeEnter
        .append("rect")
        .attr("type", d => d.id)
        .attr("width", d => (d.depth ? this.diamonds.w : this.originDiamonds.w))
        .attr("height", d =>
          d.depth
            ? d.type === COMPANY
              ? this.diamonds.h
              : this.diamonds.h - 10
            : this.originDiamonds.h
        )
        // .attr("height", d =>
        //   d.depth ? this.diamonds.h : this.originDiamonds.h
        // )
        .attr("x", d =>
          d.depth ? -this.diamonds.w / 2 : -this.originDiamonds.w / 2
        )
        .attr("y", d =>
          d.depth
            ? showtype === "up"
              ? -this.diamonds.h / 2
              : 0
            : -this.originDiamonds.h / 2
        )
        .attr("stroke", d =>
          d.data.orgType === COMPANY || !d.depth ? "#ccc" : "#7A9EFF"
        )
        .attr("stroke-width", 1)
        .attr("rx", 0)
        .attr("ry", 0)
        .style("fill", d => {
          if (d.data.orgType === COMPANY || !d.depth) {
            return d._children ? "#ebf7ff" : d.depth ? "#fff" : "#0a97d5";
          } else if (d.data.orgType === PERSON) {
            return d._children ? "#fff" : d.depth ? "#fff" : "#7A9EFF";
          }
        });
      // 创建圆 加减
      nodeEnter
        .append("circle")
        .attr("type", d => d.id || (d.id = showtype + "text" + ++this.i))
        // .attr("r", d =>
        //   d.depth
        //     ? this.hasChildNodeArr.indexOf(d) === -1
        //       ? 0
        //       : SYMBOLA_S_R
        //     : 0
        // )
        .attr("r", d =>
          d.depth
            ? d.data.isChild === "0"
              ? 0
              : SYMBOLA_S_R
            : 0
        )
        .attr("cy", d =>
          d.depth
            ? showtype === "up"
              ? -(SYMBOLA_S_R + this.diamonds.h / 2)
              : this.diamonds.h
            : 0
        )
        .attr("cx", 0)
        .attr("fill", d => (d.children ? "#fff" : "#0a97d5"))
        .attr("stroke", d => (d._children || d.children ? "#0a97d5" : ""))
        .on("click", function(d) {
          _this.click(d, showtype, sourceTree);
          setTimeout(() => {
            if (
              document.querySelector(`text[type="${d.id}"]`).innerHTML === "-"
            ) {
              d.isOpen = false;
              this.innerHTML = "+";
              this.setAttribute("fill", "#0a97d5");
              document
                .querySelector(`text[type="${d.id}"]`)
                .setAttribute("fill", "#fff");
              document
                .querySelector(`rect[type="${d.id}"]`)
                .setAttribute("style", "fill:#ebf7ff");
              document.querySelector(`text[type="${d.id}"]`).innerHTML = "+";
            } else {
              d.isOpen = true;
              this.setAttribute("fill", "#fff");
              document
                .querySelector(`text[type="${d.id}"]`)
                .setAttribute("fill", "#0a97d5");
              document
                .querySelector(`rect[type="${d.id}"]`)
                .setAttribute("style", "fill:#fff");
              document.querySelector(`text[type="${d.id}"]`).innerHTML = "-";
            }
          }, DURATION);
        });
      // 持股比例
      nodeEnter
        .append("g")
        .attr("transform", () => "translate(0,0)")
        .append("text")
        .attr("class", d => (!d.depth ? "proportion-hide" : "proportion"))
        .attr("x", d => (d.x > 0 ? (showtype === "up" ? -30 : 30) : 30))
        .attr(
          "y",
          showtype === "up" ? this.diamonds.h / 1.2 : -this.diamonds.h / 1.2
        )
        .attr("text-anchor", "middle")
        .attr("fill", d => (d.data.orgType === COMPANY ? "#0a97d5" : "#7A9EFF"))
        .text(d => d.data.percent + "%");
      // 公司名称
      // y轴 否表源头的字体距离
      nodeEnter
        .append("text")
        .attr("class", "text-style-name")
        .attr("x", 0)
        .attr("y", showtype === "up" ? -this.diamonds.h / 2 : 0)
        .attr("dy", d =>
          d.depth ? (d.data.companyName.length > 14 ? "1.5em" : "2em") : "0.3em"
        )
        .attr("text-anchor", "middle")
        .attr("fill", d => (d.depth ? "#465166" : "#fff"))
        .text(d =>
          d.depth
            ? showtype === "up"
              ? d.data.holder.length > 14
                ? d.data.holder.substr(0, 14) + "..."
                : d.data.holder
              : d.data.touziCompanyName.length > 14
              ? d.data.touziCompanyName.substr(0, 14) + "..."
              : d.data.touziCompanyName
            : d.data.companyName.length > 14
            ? d.data.companyName.substr(0, 14) + "..."
            : d.data.companyName
        )
        .on("click", function(d) {
          // alert("点击了矩形框内容");
          console.log(d);
        })
        .on("mouseover", function() {
          // console.log("鼠标进来了");
          $(this).css({ color: "#000", "font-weight": 600 });
        })
        .on("mouseout", function() {
          $(this).css({ color: "#333", "font-weight": 500 });
          // console.log("鼠标移开了");
        });
      // 名称过长 第二段
      // nodeEnter
      //   .append("text")
      //   .attr("class", "text-style-name")
      //   .attr("x", 0)
      //   .attr("y", showtype === "up" ? -this.diamonds.h / 2 : 0)
      //   .attr("dy", d => (d.depth ? "3em" : "1.3em"))
      //   .attr("text-anchor", "middle")
      //   .attr("fill", d => (d.depth ? "#465166" : "#fff"))
      //   .text(d => d.data.name.substr(9, d.data.name.length));
      // 认缴金额
      nodeEnter
        .append("text")
        .attr("class", "text-style-money")
        .attr("x", 0)
        .attr("y", showtype === "up" ? -this.diamonds.h / 2 : 0)
        .attr("dy", d =>
          d.data.companyName.substr(9, d.data.companyName.length).length
            ? "5em"
            : "4em"
        )
        .attr("text-anchor", "middle")
        .attr("fill", d => (d.depth ? "#465166" : "#fff"))
        .text(d => d.data.shouldCapi);
      /*
       * 绘制箭头
       * @param  {string} markerUnits [设置为strokeWidth箭头会随着线的粗细发生变化]
       * @param {string} viewBox 坐标系的区域
       * @param {number} markerWidth,markerHeight 标识的大小
       * @param {string} orient 绘制方向，可设定为：auto（自动确认方向）和 角度值
       * @param {number} stroke-width 箭头宽度
       * @param {string} d 箭头的路径
       * @param {string} fill 箭头颜色
       * @param {string} id resolved0表示公司 resolved1表示个人
       * 直接用一个marker达不到两种颜色都展示的效果
       */
      nodeEnter
        .append("marker")
        .attr("id", showtype + "resolved0")
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("orient", "90")
        .attr("refX", () => (showtype === "up" ? "-5" : "15"))
        .attr("stroke-width", 2)
        .attr("fill", "red")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#FD7D00");

      nodeEnter
        .append("marker")
        .attr("id", showtype + "resolved1")
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("orient", "90")
        .attr("refX", () => (showtype === "up" ? "-5" : "15"))
        .attr("stroke-width", 2)
        .attr("fill", "red")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#7A9EFF");
      // 将节点转换到它们的新位置。
      let nodeUpdate = node
        .transition()
        .duration(DURATION)
        .attr("transform", d =>
          showtype === "up"
            ? "translate(" + d.x + "," + -d.y + ")"
            : "translate(" + d.x + "," + d.y + ")"
        );
      // 代表是否展开的+-号,function this指向当前dom
      nodeEnter
        .append("svg:text")
        .attr("type", d => d.id || (d.id = showtype + "text" + ++this.i))
        .on("click", function(d) {
          _this.click(d, showtype, sourceTree);
          setTimeout(() => {
            if (this.innerHTML === "-") {
              d.isOpen = false;
              this.innerHTML = "+";
              this.setAttribute("fill", "#fff");
              document
                .querySelector(`circle[type="${d.id}"]`)
                .setAttribute("fill", "#0a97d5");
              document
                .querySelector(`rect[type="${d.id}"]`)
                .setAttribute("style", "fill:#ebf7ff");
            } else {
              d.isOpen = true;
              this.innerHTML = "-";
              this.setAttribute("fill", "#0a97d5");
              document
                .querySelector(`circle[type="${d.id}"]`)
                .setAttribute("fill", "#fff");
              document
                .querySelector(`rect[type="${d.id}"]`)
                .setAttribute("style", "fill:#fff");
            }
          }, DURATION);
        })
        .attr("x", 0)
        .attr("dy", d =>
          d.depth
            ? showtype === "up"
              ? -(SYMBOLA_S_R / 2 + this.diamonds.h / 2)
              : this.diamonds.h + 4
            : 0
        )
        .attr("text-anchor", "middle")
        .attr("fill", d => (d._children ? "#fff" : "#0a97d5"))
        // .text(d =>
        //   this.hasChildNodeArr.indexOf(d) !== -1
        //     ? source.depth && d.isOpen
        //       ? "-"
        //       : "+"
        //     : ""
        // );
        .text(d =>
          d.data.isChild === "1" ? (source.depth && d.isOpen ? "-" : "+") : ""
        );
      // 将退出节点转换到父节点的新位置.
      let nodeExit = node
        .exit()
        .transition()
        .duration(DURATION)
        .attr("transform", () =>
          showtype === "up"
            ? "translate(" + source.x + "," + -source.y + ")"
            : "translate(" + source.x + "," + parseInt(source.y) + ")"
        )
        .remove();
      nodeExit
        .select("rect")
        .attr("width", this.diamonds.w)
        .attr("height", this.diamonds.h)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
      // 修改线条
      let link = this.svg
        .selectAll("path.link" + showtype)
        .data(links, d => d.id);
      // 在父级前的位置画线。
      let linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link" + showtype)
        .attr("marker-start", d => `url(#${showtype}resolved${d.data.type})`) // 根据箭头标记的id号标记箭头
        .attr("stroke", d => (d.data.type === COMPANY ? "#979797" : "#7A9EFF"))
        .style("fill-opacity", 1)
        .attr("d", () => {
          let o = { x: source.x0, y: source.y0 };
          return _this.diagonal(o, o, showtype);
        });
      let linkUpdate = linkEnter.merge(link);
      // 过渡更新位置.
      linkUpdate
        .transition()
        .duration(DURATION)
        .attr("d", d => _this.diagonal(d, d.parent, showtype));
      // 将退出节点转换到父节点的新位置
      link
        .exit()
        .transition()
        .duration(DURATION)
        .attr("d", () => {
          let o = {
            x: source.x,
            y: source.y
          };
          return _this.diagonal(o, o, showtype);
        })
        .remove();
      // 隐藏旧位置方面过渡.
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    // 拷贝到_children 隐藏1排以后的树
    collapse(source) {
      if (source.children) {
        source._children = source.children;
        source._children.forEach(this.collapse);
        source.children = null;
        this.hasChildNodeArr.push(source);
      }
    },
    click(source, showType, sourceTree) {
      // 不是起点才能点
      if (source.depth) {
        if (source.children) {
          source._children = source.children;
          source.children = null;
        } else {
          source.children = source._children;
          source._children = null;
        }
        this.update(source, showType, sourceTree);
      }
    },
    diagonal(s, d, showtype) {
      let path;
      // if (showtype === "up") {
      //   path = `M ${s.x} ${-s.y + 25}
      //   C${s.x} -${(s.y + d.y) * 0.5},
      //    ${s.x} -${(s.y + d.y) * 0.5},
      //     ${d.x} -${d.y + 34 }`;
      // } else {
      //   path = `M ${s.x} ${s.y}
      //   C${s.x} ${(s.y + d.y) * 0.5},
      //    ${s.x} ${(s.y + d.y) * 0.5},
      //     ${d.x} ${d.y  +58}`;
      // }
      let tempAdd = !!d.depth
        ? -this.diamonds.h / 2
        : -this.originDiamonds.h / 2;
      let tempDec = !!s.depth
        ? -this.diamonds.h / 2
        : -this.originDiamonds.h / 2;
      let tempOth =
        !!d.depth && showtype !== "up" ? -this.diamonds.h / 2 + 12 : 0;

      if (showtype === "up") {
        path = `M ${s.x} -${s.y + tempDec + 12}
        C${s.x} -${(s.y + d.y) * 0.5}
         ${s.x} -${(s.y + d.y) * 0.5}
          ${d.x} -${d.y - tempAdd}`;
      } else {
        path = `M ${s.x} ${s.y}
        C${s.x} ${(s.y + d.y) * 0.5},
         ${s.x} ${(s.y + d.y) * 0.5},
          ${d.x} ${d.y - tempAdd - tempOth}`;
      }

      return path;
    },
    saveImg() {
      alert("保存");
    },
    resetSvg() {
      this.d3.select("#treesvg").remove();
      this.init();
    }
  }
};
</script>

<style lang="scss">
.penetrate-chart {
  .bt-group {
    position: fixed;
    z-index: 999;
    right: 15px;
    bottom: 15px;
    button {
      width: 88px;
      height: 32px;
      display: block;
      border-radius: 18px;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      line-height: 20px;
    }
    .save {
      background: rgba(255, 168, 9, 1);
      color: rgba(255, 255, 255, 1);
    }
    .reset {
      margin-top: 8px;
      color: rgba(255, 168, 9, 1);
      background: white;
      border: 1px solid rgba(255, 168, 9, 1);
    }
  }
}
#treesvg {
  display: block;
  margin: auto;
  #g {
    .linkup,
    .linkdown {
      fill: none;
      stroke-width: 1px;
    }
    .text-style-name {
      color: #333;
      cursor: pointer;
      font-size: 12px; /*no*/
      font-family: PingFangSC-Medium;
      font-weight: 500;
    }
    .text-style-money {
      font-size: 10px; /*no*/
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(70, 81, 102, 1);
    }
    .proportion {
      font-size: 10px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
    }
  }
  .proportion-hide,
  .hide-node {
    display: none;
  }
}
</style>
<style lang="less" scoped>
.detail-page {
  .detail-left {
    width: 1200px;
    float: left;
    .detail-company-name {
      // border-bottom: 1px solid #999;
      padding-bottom: 12px;
      .d-icon {
        color: #0a97d5;
        font-size: 26px;
        line-height: 1;
        vertical-align: top;
      }
      .company-Name {
        color: #0a97d5;
        font-size: 16px;
        padding-right: 10px;
      }
      .tag-name {
        padding-right: 6px;
        color: #009966;
        font-size: 14px;
        font-weight: 400;
      }
    }
    .tab-item {
      background-color: #fff;
      // border: 1px solid #999;
      min-width: 600px;
      min-height: 300px;
      // border-radius: 8px;
      // margin: 20px;
      // padding: 20px;
    }
  }
}

#text {
  font-size: 12px;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.node-active {
  stroke: #555;
  stroke-width: 1.5px;
}
.path-middle,
.path-top,
.path-bottom {
  stroke-opacity: 0.3;
}
.link-active {
  stroke-opacity: 1;
}
.node-hide {
  fill-opacity: 0.3;
}
</style>