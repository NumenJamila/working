<template>
  <div>
    <Main @mainSearch="mainSearch" :showText="searchText">
      <div class="detail-page customize-container-center">
        <tabItemBar :whichItem="whichItem" @tabClick="tabClick" class="tab-pane-class"></tabItemBar>
        <div class="detail-left">
          <div class="detail-company-name">
            <Icon class="d-icon" type="ios-send-outline" />
            <span class="company-Name">{{companyInfo.companyName}}</span>
            <span class="tag-name" v-for="tag in companyInfo.tagList " :key="tag">[{{tag}}]</span>
          </div>
          <div class="nav">
            <ul class="nav-centent">
              <li>
                <a @click="goUrl('CompanyBase')">基础信息</a>
                <span></span>
              </li>
              <li>
                <a @click="goUrl('CompanyCooperate')" class>合作信息</a>
                <span></span>
              </li>
              <li>
                <a @click="goUrl('CompanyAppraise')" class>综合评价</a>
                <span></span>
              </li>
              <li>
                <a @click="goUrl('CorporateInvestmentFinance')" class>投融资</a>
                <span></span>
              </li>
              <li>
                <a @click="goUrl('CorporateAffiliation')" class>关联</a>
                <span></span>
              </li>
              <li class="numen-active">
                <a @click="goUrl('CompanyNavigation')" class>导航</a>
                <span></span>
              </li>
            </ul>
          </div>
          <div class="tab-item">
            <svg id="svg" width="1200" height="800" />
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
// import { getCompanyInfoByNo } from "@/services";
import { state } from "@/store";

export default {
  data() {
    return {
      whichItem: "SearchCompany",
      companyNo: "",
      companyInfo: {},
      
      queryCondition: {
        companyNo: ""
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
    this.companyNo = this.$route.query.companyNo;
    this.queryCondition.companyNo = this.companyNo;
    // this.GetCompanyInfoByNo();
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
              text: d.properties.name.substring(0, 4)
            },
            Person: {
              x: -(d.r / 2 + offset),
              y: offset,
              text: d.properties.name
            }
          };
          return type;
        }

        text
          .append("tspan")
          .attr("x", function(d) {
            return sType(d)[d.labels[0]].x;
          })
          .attr("y", function(d) {
            return sType(d)[d.labels[0]].y;
          })
          .text(function(d) {
            if (!sType(d)[d.labels[0]]) return;
            return sType(d)[d.labels[0]].text;
          });

        text
          .append("tspan")
          .attr("x", function(d) {
            if (d.labels[0] === COMPANY) {
              return sType(d)[d.labels[0]].x - 8;
            }
          })
          .attr("y", function(d) {
            if (d.labels[0] === COMPANY) {
              return sType(d)[d.labels[0]].y + 18;
            }
          })
          .text(function(d) {
            return d.properties.name.substring(4, 9);
          });

        text
          .append("tspan")
          .attr("x", function(d) {
            if (d.labels[0] === COMPANY) {
              return sType(d)[d.labels[0]].x;
            }
          })
          .attr("y", function(d) {
            if (d.labels[0] === COMPANY) {
              return sType(d)[d.labels[0]].y + 36;
            }
          })
          .text(function(d) {
            if (d.properties.name.length > 13) {
              return d.properties.name.substring(9, 11) + "...";
            } else {
              return d.properties.name.substring(9, d.properties.name.length);
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
                EMPLOY: d.properties.role || "任职",
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
          var msg = d.properties.name;
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
          if (o.properties.name === "易关通(广州)网络科技有限公司") {
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
              if (o.properties.name === _this.options.dominant) {
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
            var role = d.properties.role;
            if (role) offset = role.length > 6 ? 26 : 0;
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
          v["source"] = v.startNode;
          v["target"] = v.endNode;
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
            new type[w.labels[0]]();
            if (w.properties.name === _this.options.dominant) {
              w["color"] = _this.options.color.main.node;
              w["stroke"] = _this.options.color.main.stroke;
            }
            if (v.source === w.id) {
              v.source = w;
            }
            if (v.target === w.id) {
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
    let graph = {
        nodes: [
          {
            id: "120832978",
            labels: ["Person"],
            properties: {
              keyNo: "pbb4fe87230c85f912fed444a8cb2b36",
              role: "",
              name: "\u9648\u7eaa\u8d5e"
            }
          },
          {
            id: "21569546",
            labels: ["Company"],
            properties: {
              keyNo: "61f94ff8f488d1e62f6745cb72a5f2a8",
              registCapi: "100.0",
              name:
                "\u534e\u5bcc\u79d1\u6280(\u5e7f\u5dde)\u6709\u9650\u516c\u53f8",
              econKind:
                "\u6709\u9650\u8d23\u4efb\u516c\u53f8(\u81ea\u7136\u4eba\u6295\u8d44\u6216\u63a7\u80a1)",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "26524336",
            labels: ["Company"],
            properties: {
              keyNo: "781cdc186fe250a90acd8e6273944209",
              registCapi: "0.0",
              name:
                "\u4e2d\u5c71\u5e02\u5927\u6d8c\u9547\u5de5\u79d1\u4fe1\u4e2d\u5c0f\u4f01\u4e1a\u670d\u52a1\u4e2d\u5fc3",
              econKind: "\u4e2a\u4eba\u72ec\u8d44\u4f01\u4e1a",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "150932026",
            labels: ["Person"],
            properties: {
              keyNo: "prf6c719f8471f34cab062e7fdbbaa99",
              role: "\u8463\u4e8b",
              name: "\u9ec4\u6653\u6656"
            }
          },
          {
            id: "147414542",
            labels: ["Person"],
            properties: {
              keyNo: "pr841fdcbd88dccaad0426b55fbaca9f",
              role: "\u8463\u4e8b",
              name: "\u6c5f\u7ee7\u4f1f"
            }
          },
          {
            id: "115999014",
            labels: ["Person"],
            properties: {
              keyNo: "pac9cd9d770f92ba985511cdd4f737ed",
              role: "",
              name: "\u51af\u9896"
            }
          },
          {
            id: "43678837",
            labels: ["Company"],
            properties: {
              keyNo: "c543e049987b4e3389dc0306fc6a071c",
              registCapi: "100.0",
              name:
                "\u6613\u5173\u901a(\u5e7f\u5dde)\u7f51\u7edc\u79d1\u6280\u6709\u9650\u516c\u53f8",
              econKind:
                "\u6709\u9650\u8d23\u4efb\u516c\u53f8(\u6cd5\u4eba\u72ec\u8d44)",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "18255236",
            labels: ["Company"],
            properties: {
              keyNo: "52f935207063df5a3ee5ce365408c93d",
              registCapi: "100.0",
              name:
                "\u97f6\u5173\u5e02\u667a\u521b\u4fe1\u606f\u79d1\u6280\u6709\u9650\u516c\u53f8",
              econKind:
                "\u6709\u9650\u8d23\u4efb\u516c\u53f8(\u81ea\u7136\u4eba\u6295\u8d44\u6216\u63a7\u80a1)",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "42619868",
            labels: ["Company"],
            properties: {
              keyNo: "c07db867c72cc8327902a6cca73eb698",
              registCapi: "300.0",
              name:
                "\u6e5b\u6c5f\u5e02\u6613\u5173\u901a\u53e3\u5cb8\u4fe1\u606f\u670d\u52a1\u6709\u9650\u516c\u53f8",
              econKind: "\u5176\u4ed6\u6709\u9650\u8d23\u4efb\u516c\u53f8",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "2710879",
            labels: ["Company"],
            properties: {
              keyNo: "0c6488bf0ba7f7926fcd0658f3bc0249",
              registCapi: "210.0",
              name:
                "\u5e7f\u5dde\u68ee\u8d6b\u56fd\u9645\u8d38\u6613\u6709\u9650\u516c\u53f8",
              econKind:
                "\u6709\u9650\u8d23\u4efb\u516c\u53f8(\u81ea\u7136\u4eba\u6295\u8d44\u6216\u63a7\u80a1)",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "101505844",
            labels: ["Person"],
            properties: {
              keyNo: "p808de4de29b5982bb04cf63b3d210ae",
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              name: "\u9676\u7136"
            }
          },
          {
            id: "149192924",
            labels: ["Person"],
            properties: {
              keyNo: "prbe20aed59e095d540c35dfbfff9fb1",
              role: "",
              name: "\u6797\u5fb7\u624d"
            }
          },
          {
            id: "144387362",
            labels: ["Person"],
            properties: {
              keyNo: "pr21851f57e95eca86228dd9dc77cfaf",
              role: "\u76d1\u4e8b",
              name: "\u9648\u7eaa\u8d5e"
            }
          },
          {
            id: "133443818",
            labels: ["Person"],
            properties: {
              keyNo: "pe1badc5a19d4f84e69daf73e636e0b9",
              role: "\u76d1\u4e8b",
              name: "\u97e9\u53f8\u742a"
            }
          },
          {
            id: "50454910",
            labels: ["Company"],
            properties: {
              keyNo: "e3cf3d6d766d51ea00c05b19bb4e3d74",
              registCapi: "40000.0",
              name:
                "\u5e7f\u4e1c\u5317\u90e8\u6e7e\u519c\u4ea7\u54c1\u6279\u53d1\u4e2d\u5fc3\u6709\u9650\u516c\u53f8",
              econKind: "\u5176\u4ed6\u6709\u9650\u8d23\u4efb\u516c\u53f8",
              status: "\u5b58\u7eed"
            }
          },
          {
            id: "32587918",
            labels: ["Company"],
            properties: {
              keyNo: "9356944934391cd26e7b3d851477c200",
              registCapi: "100.0",
              name:
                "\u5e7f\u5dde\u6cfd\u62d3\u4fe1\u606f\u79d1\u6280\u6709\u9650\u516c\u53f8",
              econKind:
                "\u6709\u9650\u8d23\u4efb\u516c\u53f8(\u81ea\u7136\u4eba\u6295\u8d44\u6216\u63a7\u80a1)",
              status: "\u5b58\u7eed"
            }
          }
        ],
        relationships: [
          {
            id: "144975012",
            type: "EMPLOY",
            startNode: "149192924",
            endNode: "42619868",
            properties: {
              role: "\u8463\u4e8b\u957f"
            }
          },
          {
            id: "175134769",
            type: "EMPLOY",
            startNode: "120832978",
            endNode: "43678837",
            properties: {
              role: "\u6267\u884c\u8463\u4e8b\u517c\u603b\u7ecf\u7406"
            }
          },
          {
            id: "144975013",
            type: "EMPLOY",
            startNode: "147414542",
            endNode: "42619868",
            properties: {
              role: "\u8463\u4e8b"
            }
          },
          {
            id: "175134770",
            type: "EMPLOY",
            startNode: "133443818",
            endNode: "43678837",
            properties: {
              role: "\u76d1\u4e8b"
            }
          },
          {
            id: "144975014",
            type: "EMPLOY",
            startNode: "150932026",
            endNode: "42619868",
            properties: {
              role: "\u8463\u4e8b"
            }
          },
          {
            id: "144975015",
            type: "EMPLOY",
            startNode: "144387362",
            endNode: "42619868",
            properties: {
              role: "\u76d1\u4e8b"
            }
          },
          {
            id: "129650876",
            type: "LEGAL",
            startNode: "120832978",
            endNode: "26524336",
            properties: {
              role: ""
            }
          },
          {
            id: "67509390",
            type: "INVEST",
            startNode: "120832978",
            endNode: "26524336",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 100,
              shouldCapi: 0
            }
          },
          {
            id: "61963",
            type: "INVEST",
            startNode: "50454910",
            endNode: "42619868",
            properties: {
              role: "\u4f01\u4e1a\u6cd5\u4eba",
              stockPercent: 0,
              shouldCapi: 0
            }
          },
          {
            id: "61964",
            type: "INVEST",
            startNode: "43678837",
            endNode: "42619868",
            properties: {
              role: "\u4f01\u4e1a\u6cd5\u4eba",
              stockPercent: 0,
              shouldCapi: 0
            }
          },
          {
            id: "255964369",
            type: "EMPLOY",
            startNode: "120832978",
            endNode: "2710879",
            properties: {
              role: "\u76d1\u4e8b"
            }
          },
          {
            id: "92935514",
            type: "LEGAL",
            startNode: "115999014",
            endNode: "21569546",
            properties: {
              role: ""
            }
          },
          {
            id: "87873263",
            type: "INVEST",
            startNode: "120832978",
            endNode: "2710879",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 20,
              shouldCapi: 42
            }
          },
          {
            id: "112933864",
            type: "LEGAL",
            startNode: "133443818",
            endNode: "18255236",
            properties: {
              role: ""
            }
          },
          {
            id: "44586805",
            type: "INVEST",
            startNode: "120832978",
            endNode: "32587918",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 80,
              shouldCapi: 80
            }
          },
          {
            id: "89424265",
            type: "LEGAL",
            startNode: "149192924",
            endNode: "42619868",
            properties: {
              role: ""
            }
          },
          {
            id: "44586806",
            type: "INVEST",
            startNode: "115999014",
            endNode: "32587918",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 20,
              shouldCapi: 20
            }
          },
          {
            id: "152209906",
            type: "EMPLOY",
            startNode: "101505844",
            endNode: "21569546",
            properties: {
              role: "\u76d1\u4e8b"
            }
          },
          {
            id: "152209907",
            type: "EMPLOY",
            startNode: "115999014",
            endNode: "21569546",
            properties: {
              role: "\u6267\u884c\u8463\u4e8b\u517c\u603b\u7ecf\u7406"
            }
          },
          {
            id: "12679331",
            type: "INVEST",
            startNode: "101505844",
            endNode: "21569546",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 40,
              shouldCapi: 40
            }
          },
          {
            id: "42523819",
            type: "INVEST",
            startNode: "115999014",
            endNode: "18255236",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 85,
              shouldCapi: 85
            }
          },
          {
            id: "12679330",
            type: "INVEST",
            startNode: "115999014",
            endNode: "21569546",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 60,
              shouldCapi: 60
            }
          },
          {
            id: "42523820",
            type: "INVEST",
            startNode: "133443818",
            endNode: "18255236",
            properties: {
              role: "\u81ea\u7136\u4eba\u80a1\u4e1c",
              stockPercent: 15,
              shouldCapi: 15
            }
          },
          {
            id: "1838832",
            type: "INVEST",
            startNode: "21569546",
            endNode: "43678837",
            properties: {
              role: "\u4f01\u4e1a\u6cd5\u4eba",
              stockPercent: 100,
              shouldCapi: 100
            }
          },
          {
            id: "193391530",
            type: "EMPLOY",
            startNode: "133443818",
            endNode: "18255236",
            properties: {
              role: "\u7ecf\u7406"
            }
          },
          {
            id: "196220446",
            type: "EMPLOY",
            startNode: "115999014",
            endNode: "32587918",
            properties: {
              role: ""
            }
          },
          {
            id: "193391531",
            type: "EMPLOY",
            startNode: "133443818",
            endNode: "18255236",
            properties: {
              role: "\u6267\u884c\u8463\u4e8b"
            }
          },
          {
            id: "196220445",
            type: "EMPLOY",
            startNode: "120832978",
            endNode: "32587918",
            properties: {
              role: "\u6267\u884c\u8463\u4e8b\u517c\u603b\u7ecf\u7406"
            }
          },
          {
            id: "193391529",
            type: "EMPLOY",
            startNode: "115999014",
            endNode: "18255236",
            properties: {
              role: "\u76d1\u4e8b"
            }
          },
          {
            id: "104058242",
            type: "LEGAL",
            startNode: "120832978",
            endNode: "43678837",
            properties: {
              role: ""
            }
          },
          {
            id: "114301666",
            type: "LEGAL",
            startNode: "120832978",
            endNode: "32587918",
            properties: {
              role: ""
            }
          }
        ]
      }
    new chart({
      id: "svg",
      spacing: 15,
      nodes: graph.nodes,
      edges: graph.relationships,
      dominant: "易关通(广州)网络科技有限公司"
    });
  },
  methods: {
    tabClick(url) {
      this.$router.push({ name: url });
    },
    goUrl(url) {
      this.$router.push({ name: url, query: { companyNo: this.companyNo } });
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
      border-bottom: 1px solid #999;
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
  border: 1px solid #999;
  min-width: 600px;
  min-height: 300px;
  border-radius: 8px;
  // margin: 20px;
  // padding: 20px;
  text-align: center;
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
<style type="text/css" scoped>
.nav {
  width: 100%;
  height: 50px;
}
.nav .nav-centent {
  /* width: 800px; */
  width: 1200px; /* 适应没有右侧栏，满屏 */
  margin: 0 auto;
  height: 50px;
}
.nav .nav-centent > li {
  /* width: 120px; */
  height: 50px;
  display: block;
  float: left;
  text-align: center;
  margin-right: 20px;
  position: relative;
  cursor: pointer;
}
.nav .nav-centent li a {
  /* width: 120px; */
  height: 50px;
  display: block;
  font-size: 14px;
  line-height: 50px;
  color: #666;
}
.nav .nav-centent ul {
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 99;
  width: 100%;
}

.nav .nav-centent li a:hover {
  color: #0a97d5;
}
.numen-active a {
  color: #0a97d5 !important;
}
.numen-active {
  position: relative;
}
.numen-active span::after {
  content: "";
  display: block;
  position: absolute;
  bottom: -11px;
  left: 50%;
  transform: translateX(-50%);
  width: 0px;
  height: 0px;
  border-top: 16px solid rgba(0, 0, 0, 0);
  border-right: 16px solid rgba(0, 0, 0, 0);
  border-bottom: 16px solid #0a97d5;
  border-left: 16px solid rgba(0, 0, 0, 0);

  margin-bottom: 10px;
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
