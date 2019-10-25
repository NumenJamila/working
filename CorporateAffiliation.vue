<template>
  <div>
    <Main @mainSearch="mainSearch" :showText="searchText">
      <div class="detail-page customize-container-center">
        <tabItemBar :whichItem="whichItem" @tabClick="tabClick" class="tab-pane-class"></tabItemBar>
        <div class="detail-left">
          <div class="detail-company-name">
            <Icon class="d-icon" type="ios-send-outline" />
            <span class="company-Name">{{companyName}}</span>
            <!-- <span class="tag-name" v-for="tag in companyInfo.tagList " :key="tag">[{{tag}}]</span> -->
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
              <li>
                <a @click="goUrl('CorporateInvestmentFinance')" class>投融资</a>
                <span></span>
              </li>
              <li class="numen-active">
                <a @click="goUrl('CorporateAffiliation')" class>关联</a>
                <span></span>
              </li>
              <li>
                <a @click="goUrl('CompanyNavigation')" class>导航</a>
                <span></span>
              </li>
            </ul>
          </div>
          <div class="tab-item">
            <svg id="svg" width="1200" height="500" />
            <div class="dots-loader"></div>
          </div>

          <!--向下的三角形-->
          <!-- <div class="border-up-empty">
              <span></span>
          </div>-->
        </div>
      </div>
    </Main>
  </div>
</template>

<script>
// @ means "src"
import * as d3 from "d3";
import $ from "jquery";
import Main from "@/components/main";
import tabItemBar from "@/components/tabItemBar";
// import companyinfo from "@/api/companyinfo"
import { linkedQuery } from "@/services";
import { state } from "@/store";

export default {
  data() {
    return {
      whichItem: "SearchCompany",
      companyNo: "",
      graph: {},
      companyName: "",
      cooperate: [],
      queryCondition: {
        orgCompanyNo: "1", //公司ID
        queryCompanyName: "北京三快公司" //查询的公司名称
        // queryCompanyName: "成都住房通科技公司" //查询的公司名称
      }
    };
  },
  components: {
    Main,
    tabItemBar
  },
  computed: {
    searchText() {
      return state.searchText;
    }
  },
  created() {
    this.companyNo = this.$route.query.companyNo || "";
    // this.queryCondition.companyNo = this.companyNo;
  },
  mounted() {
    var _typeof =
      typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
        ? function(obj) {
            return typeof obj;
          }
        : function(obj) {
            return obj &&
              typeof Symbol === "function" &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          };

    (function() {
      var chart = function chart(options) {
        this.options = $.extend(
          {
            id: "",
            spacing: 15,
            nodes: [],
            edges: [],
            dominant: "",
            color: {
              node: {
                Person: "#f75000",
                Company: "#4682b4"
              },
              opacityNode: {
                Person: "#FFCBB3",
                Company: "#dcecfc"
              },
              line: {
                INVEST: "#fd485e",
                EMPLOY: "#4ea2f0",
                LEGAL: "#4ea2f0"
              },
              stroke: {
                Person: "#FF8247",
                Company: "#6495ED"
              },
              opacityStroke: {
                Person: "#FFE7BA",
                Company: "#B2DFEE"
              },
              main: {
                node: "#EE3B3B",
                stroke: "#EE6363",
                opacityNode: "#FFC1C1",
                opacityStroke: "#FFE4C4"
              }
            }
          },
          options
        );
        var notEnoughOption = false;
        for (var k in this.options) {
          if (this.isEmpty(this.options[k])) {
            notEnoughOption = true;
          }
        }
        !notEnoughOption && this.init();
      };

      chart.prototype.init = function() {
        var _this = this;
        var nodes = _this.options.nodes;
        var edges = _this.options.edges;
        var zoom = d3.zoom().on("zoom", function() {
          g.attr("transform", d3.event.transform);
        });
        var svg = d3.select("#" + this.options.id);
        var width = +svg.attr("width");
        var height = +svg.attr("height");
        var margin = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };
        var g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + ", " + margin.top + ")"
          );

        var edges2 = [];
        var edges3 = [];
        var edges4 = [];

        var state = {
          clicked: false,
          drag: false
        };

        var MIDDLE = "middle";
        var TOP = "top";
        var BOTTOM = "bottom";
        var SELECTED = "selected";
        var UNSELECTED = "unselected";
        var COMPANY = "Company";
        var PERSON = "Person";

        var strokeWidthClick = 5;
        var strokeWidth = 1.5;

        _this.dataSet(edges, nodes);

        var simulation = d3
          .forceSimulation(nodes)
          .force("charge", d3.forceManyBody().strength(-400))
          .force(
            "link",
            d3
              .forceLink(edges)
              .distance(200)
              .strength(2)
          )
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force(
            "collide",
            d3.forceCollide().radius(function(d) {
              return d.r + 50;
            })
          );

        _this.unique(spliceArray(edges, edges2));
        _this.unique(spliceArray(edges2, edges3));
        _this.unique(spliceArray(edges3, edges4));

        _this.setIndex(edges, edges2);
        _this.setIndex(edges3, edges2);
        _this.setIndex(edges4, edges3);

        _this.replaceEmptyItem(edges);
        _this.replaceEmptyItem(edges2);
        _this.replaceEmptyItem(edges3);
        _this.replaceEmptyItem(edges4);

        _this.distinctIndex(edges, edges2);
        _this.distinctIndex(edges2, edges3);
        _this.distinctIndex(edges3, edges4);

        var defs = svg.append("defs");
        for (var i in edges) {
          appendArrow("middlePathArrow" + i, edges[i].index);
        }
        for (var _i in edges2) {
          appendArrow("topPathArrow" + _i, edges2[_i].index);
        }
        for (var _i2 in edges3) {
          appendArrow("bottomPathArrow" + _i2, edges3[_i2].index);
        }

        // middle path
        var middlePath = initPath(MIDDLE, edges);
        var middlePathTextMask = initPathTextMask(MIDDLE, edges);
        var middlePathText = initPathText(MIDDLE, edges);
        // top path
        var topPathRect = initPathRect(TOP);
        var topPath = initPath(TOP, edges2);
        var topPathTextMask = initPathTextMask(TOP, edges2);
        var topPathText = initPathText(TOP, edges2);
        // bottom path
        var bottomPathRect = initPathRect(BOTTOM);
        var bottomPath = initPath(BOTTOM, edges3);
        var bottomPathTextMask = initPathTextMask(BOTTOM, edges3);
        var bottomPathText = initPathText(BOTTOM, edges3);

        // nodes g
        var gs = g
          .selectAll(".circle")
          .data(nodes)
          .enter()
          .append("g")
          .attr("class", "gNodes")
          .attr("transform", "translate(-9999, -9999)")
          .call(
            d3
              .drag()
              .on("start", dragstart)
              .on("drag", dragged)
              .on("end", dragend)
          );

        d3.selection.prototype.moveToFront = function() {
          return this.each(function() {
            this.parentNode.appendChild(this);
          });
        };
        d3.selection.prototype.moveToBack = function() {
          return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
              this.parentNode.insertBefore(this, firstChild);
            }
          });
        };

        gs.on("click", function(d) {
          var _this3 = this;

          d3.selectAll("circle")
            .attr("stroke-width", function(o) {
              return o !== d ? strokeWidth + "px" : strokeWidthClick + "px";
            })
            .attr("r", function(d) {
              return d.r - strokeWidth;
            });
          if (state.clicked) {
            if (!d.selectedNode) {
              // 这是点击没有关联的node
              // unSelected(d, true, this)
              // state.clicked = false;
            } else {
              // 这是点击关联node
              Link(d);
              selected(d, true, this);
            }
          } else {
            // 这是第一次点击
            selected(d, true, this);
            state.clicked = true;
          }
          $(document).click(function(e) {
            // 这是点击非nodes
            if (e.target.getAttribute("class") !== "selected") {
              d3.selectAll("circle").attr("stroke-width", strokeWidth + "px");
              unSelected(d, true, _this3);
              unLink(d);
              state.clicked = false;
            }
          });
        });

        // nodes circle
        var nodesCircle = gs
          .append("circle")
          .attr("r", function(d) {
            return d.r - strokeWidth;
          })
          .attr("id", function(d) {
            return "circle-" + d.index;
          })
          .attr("fill", function(d) {
            return d.color;
          })
          .attr("stroke", function(d) {
            return d.stroke;
          })
          .style("cursor", "pointer");

        // nodes text
        var text = gs
          .append("text")
          .attr("id", "text")
          .style("fill", "#fff")
          .style("cursor", "pointer");

        /**
         * 根据类型决定node文字的属性
         * @param {object} d
         */
        function sType(d) {
          var offset = 5;
          var type = {
            Company: {
              x: -(d.r / 2 + offset),
              y: -d.r / 2 + offset,
              text: d.companyName.substring(0, 4)
            },
            Person: {
              x: -(d.r / 2 + offset),
              y: offset,
              text: d.companyName
            }
          };
          return type;
        }

        text
          .append("tspan")
          .attr("x", function(d) {
            return sType(d)[d.orgType].x;
          })
          .attr("y", function(d) {
            return sType(d)[d.orgType].y;
          })
          .text(function(d) {
            if (!sType(d)[d.orgType]) return;
            return sType(d)[d.orgType].text;
          });

        text
          .append("tspan")
          .attr("x", function(d) {
            if (d.orgType === COMPANY) {
              return sType(d)[d.orgType].x - 8;
            }
          })
          .attr("y", function(d) {
            if (d.orgType === COMPANY) {
              return sType(d)[d.orgType].y + 18;
            }
          })
          .text(function(d) {
            return d.companyName.substring(4, 9);
          });

        text
          .append("tspan")
          .attr("x", function(d) {
            if (d.orgType === COMPANY) {
              return sType(d)[d.orgType].x;
            }
          })
          .attr("y", function(d) {
            if (d.orgType === COMPANY) {
              return sType(d)[d.orgType].y + 36;
            }
          })
          .text(function(d) {
            if (d.companyName.length > 13) {
              return d.companyName.substring(9, 11) + "...";
            } else {
              return d.companyName.substring(9, d.companyName.length);
            }
          });

        function appendArrow(id, _class) {
          defs
            .append("marker")
            .attr("class", "arrow")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("refY", 3)
            .attr("id", "arrow" + _class)
            .attr("fill-opacity", 0.5)
            .append("path")
            .attr("d", "M0,1 L0,5 L5,3 z");
        }

        function ticked() {
          gs.attr("transform", function(d) {
            var cirX = d.x;
            var cirY = d.y;
            return "translate(" + cirX + ", " + cirY + ")";
          });
          updatePath(middlePath, "middle");
          updateText(middlePathText, "middle");
          updateText(middlePathTextMask, "middle");

          updateRect(topPathRect);
          updatePath(topPath, "top");
          updateText(topPathText, "top");
          updateText(topPathTextMask, "top");

          updateRect(bottomPathRect);
          updatePath(bottomPath, "bottom");
          updateText(bottomPathText, "bottom");
          updateText(bottomPathTextMask, "bottom");
        }

        var scale = d3.scaleLinear();
        scale.domain([0, 200]).range([1500, 5000]);
        setTimeout(function() {
          $("body")
            .removeClass("loading")
            .addClass("loaded");
          ticked();
          simulation.stop();
          svg.call(zoom);
        }, scale(nodes.length));
        // simulation.on("tick", ticked);

        function initPathRect(direction) {
          var offset = direction === "top" ? 0 : _this.options.spacing;
          var pathLength = document.querySelector(".path-middle").getBBox()
            .width;
          var rect = g
            .selectAll(".path-rect")
            .data(edges)
            .enter()
            .append("rect")
            .attr("fill", "none")
            .attr(
              "width",
              document.querySelector(".path-middle").getBBox().width
            )
            .attr("height", _this.options.spacing);
          return rect;
        }

        function topPathAttrD(d, i) {
          // x偏移
          var x = trigonoFun(d.x, _this.options.spacing, true).x;
          // y偏移
          var y = trigonoFun(d.x, _this.options.spacing, true).y;
          return (
            "M" +
            (d.target.x - x) +
            " " +
            (d.target.y + y) +
            "L" +
            (d.source.x - x) +
            " " +
            (d.source.y + y) +
            "Z"
          );
        }

        function bottomPathAttrD(d, i) {
          // x偏移
          var x = trigonoFun(d.x, _this.options.spacing, true).x;
          // y偏移
          var y = trigonoFun(d.x, _this.options.spacing, true).y;
          return (
            "M" +
            (d.target.x + x) +
            " " +
            (d.target.y - y) +
            "L" +
            (d.source.x + x) +
            " " +
            (d.source.y - y) +
            "Z"
          );
        }

        function middlePathAttrD(d, i) {
          var x1 = d.source.x;
          var y1 = d.source.y;
          var x2 = d.target.x;
          var y2 = d.target.y;
          // 斜率
          var x = Math.atan2(y2 - y1, x2 - x1);
          x = (180 * x) / Math.PI;
          d["x"] = x;

          edges2.map(function(w, j) {
            if (d.index === w.originalIndex) {
              // set x to the other edge
              w["x"] = d.x;
            }
          });
          edges3.map(function(w, j) {
            if (d.index === w.originalIndex) {
              // set x to the other edge
              w["x"] = d.x;
            }
          });
          return "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
        }

        function appendText(direction, arr, isMask) {
          var selection = direction + "-path-text";
          var text = g
            .selectAll(selection)
            .data(arr)
            .enter()
            .append("text")
            .attr("id", function(d, i) {
              return direction + "Text" + i;
            })
            .attr("dy", 3);
          isMask
            ? text.attr("class", "path-" + direction + "-mask-text")
            : text.attr("class", "path-" + direction + "-text");
          return text;
        }

        function appendTextPath(direction, mask) {
          var idSelection = "#" + direction + "Path";
          mask
            .append("textPath")
            .attr("xlink:href", function(d, i) {
              return "#d" + d.index;
            })
            .attr("id", "text")
            .text(function(d, i) {
              var type = {
                EMPLOY: "任职",
                LEGAL: "法人",
                INVEST: "参股"
              };
              return type[d.type];
            });
          return mask;
        }

        function initPathTextMask(direction, arr) {
          var mask = appendText(direction, arr, true);
          appendTextPath(direction, mask)
            .style("stroke", "white")
            .style("stroke-width", "0.15em");
          return mask;
        }

        function initPathText(direction, arr) {
          var text = appendText(direction, arr);
          appendTextPath(direction, text);
          return text;
        }

        function initPath(direction, arr) {
          var attrClass = "path-" + direction;
          var attrId = direction + "Path";
          var selection = "." + attrId;
          var links = g
            .selectAll(selection)
            .data(arr)
            .enter()
            .append("path")
            .attr("class", attrClass)
            .attr("id", function(d) {
              return "d" + d.index;
            });
          return links;
        }

        /**
         * 三角形根据侧边求其他两边
         * @param {number} x //侧边长度
         * @param {number} a //角度
         * @param {boolean} isComplementaryAngle //是否余角
         */
        function trigonoFun(x, a, isComplementaryAngle) {
          var o = {
            x: 0,
            y: 0
          };
          var alpha = isComplementaryAngle ? 90 - x : x;
          alpha = (alpha * Math.PI) / 180;
          // 偏移
          o.y = Math.sin(alpha) * a;
          o.x = Math.cos(alpha) * a;
          return o;
        }

        function Link(d) {
          linkActive(middlePath, d);
          linkActive(topPath, d);
          linkActive(bottomPath, d);
        }

        gs.on("mouseover", function(d) {
          if (state.clicked || state.drag) return;
          Link(d);
          var msg = d.companyName;
          if ($(this).find("title")[0]) return;
          var title = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          var text = document.createTextNode(msg);
          title.appendChild(text);
          this.appendChild(title);
        });

        function linkActive(link, d) {
          link.style("stroke-opacity", function(o) {
            if (o.source === d || o.target === d) {
              d3.select("#arrow" + o.index).attr("fill-opacity", 1);
              return 1;
            }
          });
        }

        function unLinkActive(link, d) {
          link.style("stroke-opacity", function(o) {
            if (o.source === d || o.target === d) {
              d3.select("#arrow" + o.index).attr("fill-opacity", 0.5);
              return 0.3;
            }
          });
        }

        gs.on("mouseout", function(d) {
          if (state.clicked || state.drag) return;
          unLink(d);
        });

        /**
         * 取消线的hover高亮
         * @param {Object} d
         */
        function unLink(d) {
          unLinkActive(middlePath, d);
          unLinkActive(topPath, d);
          unLinkActive(bottomPath, d);
        }

        /**
         * link置顶
         * @param {Object} d
         */
        function stickyLink(d, nodes) {
          selectFilter(".path-middle", d).raise();
          selectFilter(".path-middle-mask-text", d).raise();
          selectFilter(".path-middle-text", d).raise();
          selectFilter(".path-top", d).raise();
          selectFilter(".path-top-mask-text", d).raise();
          selectFilter(".path-top-text", d).raise();
          selectFilter(".path-bottom", d).raise();
          selectFilter(".path-bottom-mask-text", d).raise();
          selectFilter(".path-bottom-text", d).raise();
        }

        /**
         * node置顶
         * @param {Object} d
         */
        function stickNode(d) {
          nodesCircle.style("stroke-opacity", function(o) {
            if (isConnect(d, o)) {
              d3.select($("#circle-" + o.index).parent("g")[0]).raise();
            }
          });
        }

        var linkIndex = {};
        edges.map(function(d) {
          linkIndex[d.source.index + "," + d.target.index] = 1;
        });

        /**
         * 两个node是否关联
         * @param {Object} a node1 d
         * @param {Object} b node2 d
         */
        function isConnect(a, b) {
          return (
            linkIndex[a.index + "," + b.index] ||
            linkIndex[b.index + "," + a.index] ||
            a.index === b.index
          );
        }

        /**
         * link交互相关
         * @param {number} opacity 透明度
         * @param {Object} d 数据集
         * @param {Object} link d3 link obj
         * @param {String} direction 方向
         * @param {String} state start or end
         */
        function fadePath(opacity, d, link, direction, state) {
          link.style("stroke-opacity", function(o, i) {
            if (o.source === d || o.target === d) {
              // 关联的link
              return 1;
            } else {
              // 不关联的link
              var arrowOpacity = state === "end" ? 0.5 : opacity;
              d3.select("#arrow" + o.index).attr("fill-opacity", arrowOpacity);
              return opacity;
            }
          });
        }

        function fadePathText(opacity, d, text, mask) {
          text.attr("fill-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
          });
          mask.attr("opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
          });
        }

        function fadeNodeText(opacity, d, text) {
          text.style("fill-opacity", function(o) {
            var thisOpacity = isConnect(d, o) ? 1 : opacity;
            return thisOpacity;
          });
        }

        /**
         * 关联node的link过滤器(两边)
         * @param {String} doc d3 selection
         * @param {Object} d
         */
        function selectFilter(doc, d) {
          return d3.selectAll(doc).filter(function(o) {
            return o.source.index === d.index || o.target.index === d.index;
          });
        }

        /**
         * 关联node的link过滤器(一边)
         * @param {String} doc d3 selection
         * @param {Object} d
         */
        function selectFilterNot(doc, d) {
          return d3.selectAll(doc).filter(function(o) {
            return o.source.index !== d.index || o.target.index !== d.index;
          });
        }

        /**
         * 给高亮nodes和其他nodes添加类名
         * @param {String} _class 类名
         * @param {Object} _this node doc
         */
        function toggleSelected(_class, _this) {
          _this.setAttribute("class", _class);
          var text = $(_this).next("text")[0];
          text.setAttribute("class", _class);
          var tspan = $(text).find("tspan");
          tspan.each(function(i, v) {
            v.setAttribute("class", _class);
          });
        }

        /**
         * 选中node及其关联node设置颜色
         * @param {Object} o 数据集
         * @param {Object} _this2 node doc
         */
        function selectedNodeSetColor(o, _this2) {
          if (o.companyName === _this.options.dominant) {
            _this2.setAttribute("fill", _this.options.color.main.node);
            _this2.setAttribute("stroke", _this.options.color.main.stroke);
          } else {
            if (o.color === _this.options.color.node.Company) {
              _this2.setAttribute("fill", _this.options.color.node.Company);
              _this2.setAttribute("stroke", _this.options.color.stroke.Company);
            } else {
              _this2.setAttribute("fill", _this.options.color.node.Person);
              _this2.setAttribute("stroke", _this.options.color.stroke.Person);
            }
          }
        }

        function findCircle(o) {
          return $("#circle-" + o.index);
        }

        /**
         * 切换鼠标手势
         * @param {Object} o 数据集
         * @param {String} cursor 鼠标手势
         */
        function toggleCursor(o, cursor) {
          var circle = findCircle(o);
          var text = circle.next("#text");
          d3.select(circle[0]).style("cursor", cursor);
          d3.select(text[0]).style("cursor", cursor);
        }

        /**
         * 高亮显示关联的node，其他透明化
         * @param {Object} d 数据集
         * @param {Boolean} clicked 是否是点击事件
         * @param {Object} _this2 点击的document
         */
        function selected(d, clicked, _this2) {
          nodesCircle.style("stroke-opacity", function(o) {
            if (!isConnect(d, o)) {
              // 没有关联的nodes
              if (o.companyName === _this.options.dominant) {
                this.setAttribute("fill", _this.options.color.main.opacityNode);
                this.setAttribute(
                  "stroke",
                  _this.options.color.main.opacityStroke
                );
              } else {
                o.color === _this.options.color.node.Company
                  ? this.setAttribute(
                      "fill",
                      _this.options.color.opacityNode.Company
                    )
                  : this.setAttribute(
                      "fill",
                      _this.options.color.opacityNode.Person
                    );
                o.stroke === _this.options.color.stroke.Company
                  ? this.setAttribute(
                      "stroke",
                      _this.options.color.opacityStroke.Company
                    )
                  : this.setAttribute(
                      "stroke",
                      _this.options.color.opacityStroke.Person
                    );
              }
              o["selectedNode"] = false;
              toggleSelected("unSelected", this);
              toggleCursor(o, "default");
            } else {
              // 关联的nodes
              o["selectedNode"] = true;
              selectedNodeSetColor(o, this);
              toggleSelected("selected", this);
              toggleCursor(o, "pointer");
            }
          });
          fadePath(0.1, d, middlePath, "middle", "start");
          fadePath(0.1, d, topPath, "top", "start");
          fadePath(0.1, d, bottomPath, "top", "start");
          fadePathText(0, d, middlePathText, middlePathTextMask, true);
          fadePathText(0, d, topPathText, topPathTextMask, true);
          fadePathText(0, d, bottomPathText, bottomPathTextMask, true);
          fadeNodeText(0, d, text);
        }

        function dragstart(d) {
          state.drag = true;
          if (state.clicked) return;
          selected(d, false, this);
        }

        function dragend(d) {
          d3.selectAll(".gNodes").sort(function(a, b) {
            if (a.index === d.index) return 1;
            else return -1;
          });
          state.drag = false;
          if (state.clicked) return;
          unSelected(d, false, this);
        }

        /**
         * 取消选中高亮
         * @param {Object} d 数据集
         * @param {Boolean} clicked 是否点击事件
         * @param {Object} _this2 点击或者拖拽的document
         */
        function unSelected(d, clicked, _this2) {
          d3.select(_this2).attr("stroke-width", strokeWidth + "px");
          nodesCircle.style("stroke-opacity", function(o) {
            toggleCursor(o, "pointer");
            selectedNodeSetColor(o, this);
          });
          fadeNodeText(1, d, text);
          fadePath(0.3, d, middlePath, MIDDLE, "end");
          fadePath(0.3, d, topPath, TOP, "end");
          fadePath(0.3, d, bottomPath, TOP, "end");
          fadePathText(1, d, middlePathText, middlePathTextMask);
          fadePathText(1, d, topPathText, topPathTextMask);
          fadePathText(1, d, bottomPathText, bottomPathTextMask);
        }

        /**
         * 置顶操作
         * @param {String} _class 类名
         * @param {Object} d
         */
        function sticky(_class, d) {
          d3.selectAll(_class)
            .filter(function(o) {
              return o.source.index !== d.index || o.target.index !== d.index;
            })
            .lower();
        }

        function dragged(d) {
          if (state.clicked) {
            if (findCircle(d).attr("class") === "unSelected") return;
          }
          $(".unSelected")
            .parent("g")
            .each(function(i, v) {
              d3.select(v).lower();
            });

          sticky(".path-middle", d);
          sticky(".path-top", d);
          sticky(".path-bottom", d);

          d.x = d3.event.x;
          d.y = d3.event.y;
          var node = d3.select(this);
          node.attr("transform", function(v, i) {
            return "translate(" + d.x + " ," + d.y + ")";
          });

          updatePath(selectFilter(".path-middle", d), MIDDLE, true);
          updateText(selectFilter(".path-middle-text", d), MIDDLE);
          updateText(selectFilter(".path-middle-mask-text", d), MIDDLE);

          updateRect(selectFilter(".path-top-rect", d), TOP);
          updatePath(selectFilter(".path-top", d), TOP, true);
          updateText(selectFilter(".path-top-text", d), TOP);
          updateText(selectFilter(".path-top-mask-text", d), TOP);

          updateRect(selectFilter(".path-bottom-rect", d), BOTTOM);
          updatePath(selectFilter(".path-bottom", d), BOTTOM, true);
          updateText(selectFilter(".path-bottom-text", d), BOTTOM);
          updateText(selectFilter(".path-bottom-mask-text", d), BOTTOM);
        }

        function textFixedX(direction) {
          return function(d, i) {
            var pathDom = $("#d" + d.index)[0];
            var pathWidth = pathDom.getTotalLength();
            var scale = direction === "middle" ? 2 : 4;
            var offset = 0;
            // var role = d.companyName.role;
            // if (role) offset = role.length > 6 ? 26 : 0;
            var x = pathWidth / scale - d.source.r / 2 - offset;
            return x;
          };
        }

        function textFixedTransform(direction) {
          return function(d, i) {
            var svgDom = $("#d" + d.index)[0].getBBox();
            var x = svgDom.x;
            var y = svgDom.y;
            var rotate0 =
              "rotate(0, " +
              (x + svgDom.width / 2) +
              ", " +
              (y + svgDom.height / 2) +
              ")";
            var rotate180 =
              "rotate(180, " +
              (x + svgDom.width / 2) +
              ", " +
              (y + svgDom.height / 2) +
              ")";
            var rotate =
              d.x > -90 && d.x < 90
                ? direction === "middle"
                  ? rotate0
                  : rotate180
                : direction === "middle"
                ? rotate180
                : rotate0;
            return rotate;
          };
        }

        function updateText(text, direction) {
          text
            .attr("x", textFixedX(direction))
            .attr("transform", textFixedTransform(direction));
        }

        function updateRect(rect) {
          rect
            .attr("x", function(d) {
              return d.source.x;
            })
            .attr("y", function(d) {
              return d.source.y;
            })
            .attr("transform", function(d, i) {
              return (
                "rotate(" + d.x + "," + d.source.x + "," + d.source.y + ")"
              );
            });
        }

        /**
         * 重绘链接线
         * @param {Object} path d3 Selection Object
         * @param {String} direction 上中下哪条线
         * @param {Boolean} isDrag 是否是拖拽事件
         */
        function updatePath(path, direction, isDrag) {
          path
            .attr("d", function(d, i) {
              if (direction === TOP) {
                return topPathAttrD(d, i);
              } else if (direction === BOTTOM) {
                return bottomPathAttrD(d, i);
              } else if (direction === MIDDLE) {
                return middlePathAttrD(d, i);
              }
            })
            .attr("stroke", function(d) {
              return d.color;
            })
            .attr("stroke-width", 1.5);
          if (direction !== MIDDLE) {
            path.attr("marker-end", function(d, i) {
              var arrow = d3.select("#arrow" + d.index);
              arrow
                .attr("fill", _this.options.color.line[d.type])
                .attr("refX", 26)
                .attr("orient", d.x);
              return "url(#arrow" + d.index + ")";
            });
          } else {
            path.attr("marker-end", function(d, i) {
              var arrow = d3.select("#arrow" + d.index);
              arrow
                .attr("fill", _this.options.color.line[d.type])
                .attr("refX", 28)
                .attr("orient", "auto");
              return "url(#arrow" + d.index + ")";
            });
          }
        }
      };

      /**
       * 判断是否为空
       * @param {object} obj
       */
      chart.prototype.isEmpty = function(obj) {
        if (obj == null) return true;
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) return false;
        }
        return false;
      };

      /**
       * 数组去重
       * @param {Array} arr
       */
      chart.prototype.unique = function(arr) {
        var res = new Map();
        return arr.filter(function(a) {
          return !res.has(a) && res.set(a, 1);
        });
      };

      chart.prototype.unrepeat = function(obj) {
        var isArray = obj instanceof Array;
        for (var k in obj) {
          if (k === "undefined") delete obj[k];
          else if (_typeof(obj[k]) == "object") this.unrepeat(obj[k]);
        }
        return obj;
      };

      /**
       * 去除数组empty元素
       * @param {Array} arr
       */
      chart.prototype.replaceEmptyItem = function(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          if (!arr[i] || arr[i] == "") {
            arr.splice(i, 1);
            len--;
            i--;
          }
        }
      };

      /**
       * 去除数组index与另一个数组相同的部分
       * @param {Array} arr1 要去除重复的数组
       * @param {Array} arr2 与之重复的数组
       */
      chart.prototype.distinctIndex = function(arr1, arr2) {
        for (var i in arr1) {
          for (var j in arr2) {
            if (arr1[i].index === arr2[j].index) {
              arr1.splice(i, 1);
            }
          }
        }
      };

      /**
       * 把关系数组的id指向nodes数组
       * @param {Array} d1 关系数组
       * @param {Array} d2 Nodes数组
       */
      chart.prototype.dataSet = function(d1, d2) {
        var _this4 = this;

        var _this = this;

        d1.map(function(v) {
          v["source"] = v.startNodeName;
          v["target"] = v.endNodeName;
        });

        d1.some(function(v, i) {
          var type = _this4.options.color.line;
          v["color"] = type[v.type];
          d2.some(function(w, j) {
            var type = {
              Company: function Company() {
                w["r"] = 35;
                w["stroke"] = _this.options.color.stroke.Company;
                w["color"] = _this.options.color.node.Company;
              },
              Person: function Person() {
                w["r"] = 25;
                w["stroke"] = _this.options.color.stroke.Person;
                w["color"] = _this.options.color.node.Person;
              }
            };
            new type[w.orgType]();
            if (w.companyName === _this.options.dominant) {
              w["color"] = _this.options.color.main.node;
              w["stroke"] = _this.options.color.main.stroke;
            }
            // if (v.source === w.id) {
            //   v.source = w;
            // }
            // if (v.target === w.id) {
            //   v.target = w;
            // }
            if (v.source === w.companyName) {
              v.source = w;
            }
            if (v.target === w.companyName) {
              v.target = w;
            }
          });
        });
      };

      /**
       *
       * @param {Array} d1
       * @param {Array} d2
       */
      chart.prototype.setIndex = function(d1, d2) {
        d1.map(function(v, i) {
          d2.map(function(w, j) {
            if (v.originalIndex === j) {
              v.originalIndex = w.originalIndex;
            }
          });
        });
      };

      /**
       * 把一对一的多重关系分离出新的数组
       * @param {Array} arr1 要从中取数据的数组，不改变原数组
       * @param {Array} arr2 要把数据放到的新数组
       */
      function spliceArray(arr1, arr2) {
        var arr = []; // 存放原数组切割出去的元素的index
        for (var i = 0; i < arr1.length - 1; i++) {
          for (var j = i + 1; j < arr1.length; j++) {
            if (arr1[j] && arr1[i]) {
              if (
                arr1[i].source === arr1[j].source &&
                arr1[i].target === arr1[j].target
              ) {
                arr2[j] = arr1[j];
                arr2[j]["originalIndex"] = arr1[i].index;
                arr.push(j);
                arr1[j]["isRedundancy"] = true;
              }
            }
          }
        }
        return arr;
      }

      window.chart = chart;
    })();
    this.LinkedQuery();
    // this.draw()
  },
  methods: {
    tabClick(url) {
      this.$router.push({ name: url });
    },
    goUrl(url) {
      this.$router.push({ name: url, query: { companyNo: this.companyNo } });
    },
    LinkedQuery() {
      linkedQuery(this.queryCondition).then(res => {
        if (res.isSuccess) {
          let lines = res.data.graph.lines;
          let nodes = res.data.graph.nodes;
          this.graph.lines = lines.map((value, index) => {
            if (value.type == 0) {
              value.type = "EMPLOY";
            } else {
              value.type = "INVEST";
            }
            return value;
          });
          this.graph.nodes = nodes.map((value, index) => {
            if (value.orgType == 0) {
              value.orgType = "Person";
            } else {
              value.orgType = "Company";
            }
            return value;
          });
          this.companyName = res.data.linkInfo.orgCompany.companyName;
          this.$nextTick(function() {
            this.draw();
          });
        }
      });
    },
    GetCompanyInfoByNo() {
      getCompanyInfoByNo(this.queryCondition).then(res => {
        if (res.isSuccess) {
          this.companyInfo = res.data.companyInfo;
          this.cooperate = res.data.cooperate;
          if (this.companyInfo) {
            this.companyInfo.tagList = this.companyInfo.tagName.split(",");
          }
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    draw() {
      var that = this;
      new chart({
        id: "svg",
        spacing: 15,
        nodes: that.graph.nodes,
        edges: that.graph.lines,
        dominant: that.companyName
      });
    },
    mainSearch(searchText) {
      // this.queryCondition.companyName = searchText;
      // this.doSearchResult();
      this.$router.push("/searchcompany");
    }
  }
};
</script>
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
<style scoped>
.loading {
  padding: 1em;
  margin: 1em;
  font-size: 1.5em;
}
.loading * {
  display: none;
}

.dots-loader:not(:required) {
  opacity: 1;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -4px;
  margin-top: -4px;
  text-indent: -9999px;
  display: inline-block;
  width: 8px;
  height: 8px;
  background: transparent;
  border-radius: 100%;
  box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,
    #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;
  animation: dots-loader 5s infinite ease-in-out;
  transform-origin: 50% 50%;
  transform: scale(1);
  transition: 0.3s all;
}

@keyframes dots-loader {
  0% {
    box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,
      #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;
  }
  8.33% {
    box-shadow: #f86 14px -14px 0 7px, #fc6 14px -14px 0 7px,
      #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;
  }
  16.67% {
    box-shadow: #f86 14px 14px 0 7px, #fc6 14px 14px 0 7px, #6d7 14px 14px 0 7px,
      #4ae -14px 14px 0 7px;
  }
  25% {
    box-shadow: #f86 -14px 14px 0 7px, #fc6 -14px 14px 0 7px,
      #6d7 -14px 14px 0 7px, #4ae -14px 14px 0 7px;
  }
  33.33% {
    box-shadow: #f86 -14px -14px 0 7px, #fc6 -14px 14px 0 7px,
      #6d7 -14px -14px 0 7px, #4ae -14px -14px 0 7px;
  }
  41.67% {
    box-shadow: #f86 14px -14px 0 7px, #fc6 -14px 14px 0 7px,
      #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;
  }
  50% {
    box-shadow: #f86 14px 14px 0 7px, #fc6 -14px 14px 0 7px,
      #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;
  }
  58.33% {
    box-shadow: #f86 -14px 14px 0 7px, #fc6 -14px 14px 0 7px,
      #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;
  }
  66.67% {
    box-shadow: #f86 -14px -14px 0 7px, #fc6 -14px -14px 0 7px,
      #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;
  }
  75% {
    box-shadow: #f86 14px -14px 0 7px, #fc6 14px -14px 0 7px,
      #6d7 14px -14px 0 7px, #4ae 14px -14px 0 7px;
  }
  83.33% {
    box-shadow: #f86 14px 14px 0 7px, #fc6 14px -14px 0 7px,
      #6d7 14px 14px 0 7px, #4ae 14px 14px 0 7px;
  }
  91.67% {
    box-shadow: #f86 -14px 14px 0 7px, #fc6 14px -14px 0 7px,
      #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;
  }
  100% {
    box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,
      #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;
  }
}

.loaded .dots-loader {
  opacity: 0;
  z-index: -1;
  pointer-events: none;
  transform: scale(0);
}
</style>
