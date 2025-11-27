import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router";

/**
 * @name 常驻路由
 * @description 除了 redirect/403/404 等隐藏页面，其他页面建议设置唯一的 Name 属性
 */
export const constantRoutes = [
  {
    path: "/error/403",
    component: () => import("@/views/error/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/error/404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/echarts-examples",
    name: "echarts-examples",
    component: () => import("@/views/echarts/index.vue"),
    meta: {
      title: "echarts示例",
      svgIcon: "dashboard",
      affix: true
    }
  },
  {
    path: "/code-viewer",
    name: "code-viewer",
    component: () => import("@/views/CodeViewer.vue"),
    meta: {
      title: "CodeViewer",
      svgIcon: "dashboard",
      affix: true
    }
  },
  {
    path: "/",
    redirect: "/echarts-examples"
  }
];
/**
 * @name 动态路由
 * @description 必须带有唯一的 Name 属性
 */
export const dynamicRoutes = [
  {
    path: "/echarts",
    name: "echarts",
    redirect: "/echarts/line",
    meta: {
      title: "echarts",
      elIcon: "DataBoard"
    },
    children: [
      {
        path: "line",
        name: "line",
        redirect: "/echarts/line/line-basic",
        meta: {
          title: "echarts Line折线图"
        },
        children: [
          {
            path: "line-basic",
            name: "line-basic",
            component: () =>
              import("@/views/echarts/line/line-basic/index.vue"),
            meta: {
              title: "折线图"
            }
          },
          {
            path: "line-advanced",
            name: "line-advanced",
            component: () =>
              import("@/views/echarts/line/line-advanced/index.vue"),
            meta: {
              title: "折线图综合"
            }
          }
        ]
      },
      {
        path: "bar",
        name: "bar",
        redirect: "/echarts/bar/bar-basic",
        meta: {
          title: "echarts Bar柱状图"
        },
        children: [
          {
            path: "bar-basic",
            name: "bar-basic",
            component: () => import("@/views/echarts/bar/bar-basic/index.vue"),
            meta: {
              title: "柱状图"
            }
          },
          {
            path: "bar-texture",
            name: "bar-texture",
            component: () =>
              import("@/views/echarts/bar/bar-texture/index.vue"),
            meta: {
              title: "柱状图纹理背景"
            }
          },
          {
            path: "bar-multi",
            name: "bar-multi",
            component: () => import("@/views/echarts/bar/bar-multi/index.vue"),
            meta: {
              title: "柱状图多个(动画延迟)"
            }
          },
          {
            path: "bar-stack",
            name: "bar-stack",
            component: () => import("@/views/echarts/bar/bar-stack/index.vue"),
            meta: {
              title: "柱状图堆叠"
            }
          },
          {
            path: "bar-stack-negative",
            name: "bar-stack-negative",
            component: () => import("@/views/echarts/bar/bar-stack-negative/index.vue"),
            meta: {
              title: "柱状图反向堆叠(正负柱状图)"
            }
          },
          {
            path: "bar-sort-dynamic",
            name: "bar-sort-dynamic",
            component: () => import("@/views/echarts/bar/bar-sort-dynamic/index.vue"),
            meta: {
              title: "柱状图动态排序"
            }
          },
          {
            path: "bar-top1",
            name: "bar-top1",
            component: () => import("@/views/echarts/bar/bar-top1/index.vue"),
            meta: {
              title: "柱状图Top1(胶囊柱图)"
            }
          },
          {
            path: "bar-top2",
            name: "bar-top2",
            component: () => import("@/views/echarts/bar/bar-top2/index.vue"),
            meta: {
              title: "柱状图Top2"
            }
          },
          {
            path: "bar-top3",
            name: "bar-top3",
            component: () => import("@/views/echarts/bar/bar-top3/index.vue"),
            meta: {
              title: "柱状图Top3(顶部三角形)"
            }
          },
          {
            path: "bar-top-native",
            name: "bar-top-native",
            component: () =>
              import("@/views/echarts/bar/bar-top-native/index.vue"),
            meta: {
              title: "柱状图Top(手写组件)"
            }
          },
          {
            path: "bar-top-native2",
            name: "bar-top-native2",
            component: () =>
              import("@/views/echarts/bar/bar-top-native2/index.vue"),
            meta: {
              title: "柱状图Top(手写组件2)"
            }
          },
          {
            path: "bar-top-native3",
            name: "bar-top-native3",
            component: () =>
              import("@/views/echarts/bar/bar-top-native3/index.vue"),
            meta: {
              title: "柱状图Top(手写组件3)"
            }
          },
          {
            path: "bar-ratio",
            name: "bar-ratio",
            component: () => import("@/views/echarts/bar/bar-ratio/index.vue"),
            meta: {
              title: "柱状图占比"
            }
          },
          {
            path: "bar-ratio-native",
            name: "bar-ratio-native",
            component: () =>
              import("@/views/echarts/bar/bar-ratio-native/index.vue"),
            meta: {
              title: "柱状图占比(手写组件)"
            }
          },
          {
            path: "bar-multi-column",
            name: "bar-multi-column",
            component: () => import("@/views/echarts/bar/bar-multi-column/index.vue"),
            meta: {
              title: "柱状图多列"
            }
          },
          {
            path: "bar-double",
            name: "bar-double",
            component: () => import("@/views/echarts/bar/bar-double/index.vue"),
            meta: {
              title: "柱状图双向"
            }
          },
          {
            path: "bar-level",
            name: "bar-level",
            component: () => import("@/views/echarts/bar/bar-level/index.vue"),
            meta: {
              title: "柱状图分级"
            }
          },
          {
            path: "bar-progress",
            name: "bar-progress",
            component: () => import("@/views/echarts/bar/bar-progress/index.vue"),
            meta: {
              title: "柱状图进度(环形进度图)"
            }
          },
          {
            path: "bar-3d",
            name: "bar-3d",
            component: () => import("@/views/echarts/bar/bar-3d/index.vue"),
            meta: {
              title: "柱状图三维3D"
            }
          },
          {
            path: "bar-2.5d-cube",
            name: "bar-2.5d-cube",
            component: () => import("@/views/echarts/bar/bar-2.5d-cube/index.vue"),
            meta: {
              title: "柱状图伪3D立方体"
            }
          },
          {
            path: "bar-2.5d-cube-custom",
            name: "bar-2.5d-cube-custom",
            component: () => import("@/views/echarts/bar/bar-2.5d-cube-custom/index.vue"),
            meta: {
              title: "柱状图伪3D立方体(自定义类型，渐变)"
            }
          },
          {
            path: "bar-2.5d-cylinder",
            name: "bar-2.5d-cylinder",
            component: () =>
              import("@/views/echarts/bar/bar-2.5d-cylinder/index.vue"),
            meta: {
              title: "柱状图伪3D圆柱体"
            }
          }
        ]
      },
      {
        path: "pictorial-bar",
        name: "pictorial-bar",
        redirect: "/echarts/pictorial-bar/pictorial-bar-basic",
        meta: {
          title: "echarts PictorialBar象形柱状图"
        },
        children: [
          {
            path: "pictorial-bar-basic",
            name: "pictorial-bar-basic",
            component: () =>
              import(
                "@/views/echarts/pictorial-bar/pictorial-bar-basic/index.vue"
              ),
            meta: {
              title: "象形柱状图"
            }
          },
          {
            path: "pictorial-bar-gradient",
            name: "pictorial-bar-gradient",
            component: () =>
              import(
                "@/views/echarts/pictorial-bar/pictorial-bar-gradient/index.vue"
              ),
            meta: {
              title: "象形柱状图渐变"
            }
          },
          {
            path: "pictorial-bar-horizontal",
            name: "pictorial-bar-horizontal",
            component: () =>
              import(
                "@/views/echarts/pictorial-bar/pictorial-bar-horizontal/index.vue"
              ),
            meta: {
              title: "象形柱状图水平"
            }
          },
          {
            path: "pictorial-bar-multi-column",
            name: "pictorial-bar-multi-column",
            component: () =>
              import(
                "@/views/echarts/pictorial-bar/pictorial-bar-multi-column/index.vue"
              ),
            meta: {
              title: "象形柱多列"
            }
          },
          {
            path: "pictorial-bar-cone",
            name: "pictorial-bar-cone",
            component: () =>
              import(
                "@/views/echarts/pictorial-bar/pictorial-bar-cone/index.vue"
              ),
            meta: {
              title: "象形柱锥形三角形"
            }
          },
          {
            path: "pictorial-bar-triangle",
            name: "pictorial-bar-triangle",
            component: () =>
              import(
                "@/views/echarts/pictorial-bar/pictorial-bar-triangle/index.vue"
              ),
            meta: {
              title: "象形柱倒三角形"
            }
          }
        ]
      },
      {
        path: "scatter",
        name: "scatter",
        redirect: "/echarts/scatter/scatter-basic",
        meta: {
          title: "echarts Scatter散点图"
        },
        children: [
          {
            path: "scatter-basic",
            name: "scatter-basic",
            component: () => import("@/views/echarts/scatter/scatter-basic/index.vue"),
            meta: {
              title: "散点图"
            }
          },
          {
            path: "scatter-bubble",
            name: "scatter-bubble",
            component: () => import("@/views/echarts/scatter/scatter-bubble/index.vue"),
            meta: {
              title: "散点图气泡"
            }
          },
          {
            path: "scatter-visual-map",
            name: "scatter-visual-map",
            component: () => import("@/views/echarts/scatter/scatter-visual-map/index.vue"),
            meta: {
              title: "散点图视觉映射"
            }
          },
          {
            path: "scatter-axis",
            name: "scatter-axis",
            component: () => import("@/views/echarts/scatter/scatter-axis/index.vue"),
            meta: {
              title: "散点图轴线分布"
            }
          }
        ]
      },
      {
        path: "pie",
        name: "pie",
        redirect: "/echarts/pie/pie-basic",
        meta: {
          title: "echarts Pie饼图"
        },
        children: [
          {
            path: "pie-basic",
            name: "pie-basic",
            component: () => import("@/views/echarts/pie/pie-basic/index.vue"),
            meta: {
              title: "饼图(渐变色)"
            }
          },
          {
            path: "pie-scale",
            name: "pie-scale",
            component: () => import("@/views/echarts/pie/pie-scale/index.vue"),
            meta: {
              title: "饼图刻度"
            }
          },
          {
            path: "pie-gender",
            name: "pie-gender",
            component: () => import("@/views/echarts/pie/pie-gender/index.vue"),
            meta: {
              title: "饼图性别统计"
            }
          },
          {
            path: "pie-progress",
            name: "pie-progress",
            component: () => import("@/views/echarts/pie/pie-progress/index.vue"),
            meta: {
              title: "饼图环形进度图"
            }
          },
          {
            path: "pie-progress-native",
            name: "pie-progress-native",
            component: () => import("@/views/echarts/pie/pie-progress-native/index.vue"),
            meta: {
              title: "饼图手写环形进度图(SVG, 适合小图)"
            }
          },
          {
            path: "pie-carousel",
            name: "pie-carousel",
            component: () => import("@/views/echarts/pie/pie-carousel/index.vue"),
            meta: {
              title: "饼图轮播（自定义图例）"
            }
          },
          {
            path: "pie-embed",
            name: "pie-embed",
            component: () => import("@/views/echarts/pie/pie-embed/index.vue"),
            meta: {
              title: "饼图嵌套"
            }
          },
          {
            path: "pie-half-rose",
            name: "pie-half-rose",
            component: () => import("@/views/echarts/pie/pie-half-rose/index.vue"),
            meta: {
              title: "饼图玫瑰图"
            }
          },
          {
            path: "pie-ring",
            name: "pie-ring",
            component: () => import("@/views/echarts/pie/pie-ring/index.vue"),
            meta: {
              title: "饼图环形动画"
            }
          },
          {
            path: "pie-rotate",
            name: "pie-rotate",
            component: () => import("@/views/echarts/pie/pie-rotate/index.vue"),
            meta: {
              title: "饼图旋转动画"
            }
          },
          {
            path: "pie-quarter",
            name: "pie-quarter",
            component: () => import("@/views/echarts/pie/pie-quarter/index.vue"),
            meta: {
              title: "饼图3/4"
            }
          },
          {
            path: "pie-3d",
            name: "pie-3d",
            component: () => import("@/views/echarts/pie/pie-3d/index.vue"),
            meta: {
              title: "饼图3D"
            }
          }
        ]
      },
      {
        path: "sunburst",
        name: "sunburst",
        redirect: "/echarts/sunburst/sunburst-basic",
        meta: {
          title: "echarts Sunburst旭日图"
        },
        children: [
          {
            path: "sunburst-basic",
            name: "sunburst-basic",
            component: () => import("@/views/echarts/sunburst/sunburst-basic/index.vue"),
            meta: {
              title: "旭日图"
            }
          }
        ]
      },
      {
        path: "radar",
        name: "radar",
        redirect: "/echarts/radar/radar-basic",
        meta: {
          title: "echarts Radar雷达图"
        },
        children: [
          {
            path: "radar-basic",
            name: "radar-basic",
            component: () => import("@/views/echarts/radar/radar-basic/index.vue"),
            meta: {
              title: "雷达图"
            }
          },
          {
            path: "radar-gradient",
            name: "radar-gradient",
            component: () => import("@/views/echarts/radar/radar-gradient/index.vue"),
            meta: {
              title: "雷达图渐变色"
            }
          },
          {
            path: "radar-group",
            name: "radar-group",
            component: () => import("@/views/echarts/radar/radar-group/index.vue"),
            meta: {
              title: "雷达图分组"
            }
          }
        ]
      },
      {
        path: "gauge",
        name: "gauge",
        redirect: "/echarts/gauge/gauge-basic",
        meta: {
          title: "echarts Gauge仪表盘"
        },
        children: [
          {
            path: "gauge-basic",
            name: "gauge-basic",
            component: () => import("@/views/echarts/gauge/gauge-basic/index.vue"),
            meta: {
              title: "仪表盘(半环形进度图)"
            }
          },
          {
            path: "gauge-progress",
            name: "gauge-progress",
            component: () => import("@/views/echarts/gauge/gauge-progress/index.vue"),
            meta: {
              title: "仪表盘进度图"
            }
          },
          {
            path: "gauge-advanced",
            name: "gauge-advanced",
            component: () => import("@/views/echarts/gauge/gauge-advanced/index.vue"),
            meta: {
              title: "仪表盘综合"
            }
          },
          {
            path: "gauge-ring",
            name: "gauge-ring",
            component: () => import("@/views/echarts/gauge/gauge-ring/index.vue"),
            meta: {
              title: "仪表盘圆环（自定义图例）"
            }
          },
          {
            path: "gauge-multi",
            name: "gauge-multi",
            component: () => import("@/views/echarts/gauge/gauge-multi/index.vue"),
            meta: {
              title: "仪表盘多个"
            }
          }
        ]
      },
      {
        path: "tree",
        name: "tree",
        redirect: "/echarts/tree/tree-basic",
        meta: {
          title: "echarts Tree树图"
        },
        children: [
          {
            path: "tree-basic",
            name: "tree-basic",
            component: () => import("@/views/echarts/tree/tree-basic/index.vue"),
            meta: {
              title: "树图"
            }
          },
          {
            path: "tree-radial",
            name: "tree-radial",
            component: () => import("@/views/echarts/tree/tree-radial/index.vue"),
            meta: {
              title: "树图径向"
            }
          }
        ]
      },
      {
        path: "treemap",
        name: "treemap",
        redirect: "/echarts/treemap/treemap-basic",
        meta: {
          title: "echarts Treemap矩形树图"
        },
        children: [
          {
            path: "treemap-basic",
            name: "treemap-basic",
            component: () => import("@/views/echarts/treemap/treemap-basic/index.vue"),
            meta: {
              title: "矩形树图"
            }
          }
        ]
      },
      {
        path: "funnel",
        name: "funnel",
        redirect: "/echarts/funnel/funnel-basic",
        meta: {
          title: "echarts Funnel漏斗图"
        },
        children: [
          {
            path: "funnel-basic",
            name: "funnel-basic",
            component: () => import("@/views/echarts/funnel/funnel-basic/index.vue"),
            meta: {
              title: "漏斗图"
            }
          }
        ]
      },
      {
        path: "graph",
        name: "graph",
        redirect: "/echarts/graph/graph-basic",
        meta: {
          title: "echarts Graph关系图"
        },
        children: [
          {
            path: "graph-basic",
            name: "graph-basic",
            component: () => import("@/views/echarts/graph/graph-basic/index.vue"),
            meta: {
              title: "关系图"
            }
          },
          {
            path: "graph-circular",
            name: "graph-circular",
            component: () => import("@/views/echarts/graph/graph-circular/index.vue"),
            meta: {
              title: "关系图环形"
            }
          },
          {
            path: "graph-flow",
            name: "graph-flow",
            component: () => import("@/views/echarts/graph/graph-flow/index.vue"),
            meta: {
              title: "关系图流程图"
            }
          }
        ]
      },
      {
        path: "map",
        name: "map",
        redirect: "/echarts/map/map-basic",
        meta: {
          title: "echarts Map地图"
        },
        children: [
          {
            path: "map-basic",
            name: "map-basic",
            component: () => import("@/views/echarts/map/map-basic/index.vue"),
            meta: {
              title: "地图"
            }
          },
          {
            path: "map-scatter",
            name: "map-scatter",
            component: () => import("@/views/echarts/map/map-scatter/index.vue"),
            meta: {
              title: "地图散点"
            }
          },
          {
            path: "map-line",
            name: "map-line",
            component: () => import("@/views/echarts/map/map-line/index.vue"),
            meta: {
              title: "地图飞线"
            }
          },
          {
            path: "map-drillDown",
            name: "map-drillDown",
            component: () => import("@/views/echarts/map/map-drillDown/index.vue"),
            meta: {
              title: "地图下钻"
            }
          },
          {
            path: "map-drillDown2",
            name: "map-drillDown2",
            component: () => import("@/views/echarts/map/map-drillDown2/index.vue"),
            meta: {
              title: "地图下钻2"
            }
          },
          {
            path: "map-3d",
            name: "map-3d",
            component: () => import("@/views/echarts/map/map-3d/index.vue"),
            meta: {
              title: "地图3D"
            }
          },
          {
            path: "heatmap",
            name: "heatmap",
            component: () => import("@/views/echarts/map/heatmap/index.vue"),
            meta: {
              title: "地图热力图"
            }
          },
          {
            path: "heatmap-grid",
            name: "heatmap-grid",
            component: () => import("@/views/echarts/map/heatmap-grid/index.vue"),
            meta: {
              title: "热力图自定义"
            }
          },
          {
            path: "heatmap-parking",
            name: "heatmap-parking",
            component: () => import("@/views/echarts/map/heatmap-parking/index.vue"),
            meta: {
              title: "热力图自定义2"
            }
          }
        ]
      },
      {
        path: "custom",
        name: "custom",
        redirect: "/echarts/custom/custom1",
        meta: {
          title: "echarts Custom自定义"
        },
        children: [
          {
            path: "custom1",
            name: "custom1",
            component: () => import("@/views/echarts/custom/custom1/index.vue"),
            meta: {
              title: "自定义1"
            }
          }
        ]
      },
      {
        path: "liquidfill",
        name: "liquidfill",
        redirect: "/echarts/liquidfill/liquidfill-basic",
        meta: {
          title: "echarts Liquidfill水球图"
        },
        children: [
          {
            path: "liquidfill-basic",
            name: "liquidfill-basic",
            component: () => import("@/views/echarts/liquidfill/liquidfill-basic/index.vue"),
            meta: {
              title: "水球图"
            }
          },
          {
            path: "liquidfill-shape",
            name: "liquidfill-shape",
            component: () => import("@/views/echarts/liquidfill/liquidfill-shape/index.vue"),
            meta: {
              title: "水球图自定义形状"
            }
          }
        ]
      },
      {
        path: "wordCloud",
        name: "wordCloud",
        redirect: "/echarts/wordCloud/wordCloud-basic",
        meta: {
          title: "echarts WordCloud词云图"
        },
        children: [
          {
            path: "wordCloud-basic",
            name: "wordCloud-basic",
            component: () => import("@/views/echarts/wordCloud/wordCloud-basic/index.vue"),
            meta: {
              title: "词云图"
            }
          }
        ]
      },
      {
        path: "tools",
        name: "tools",
        redirect: "/echarts/tools/title",
        meta: {
          title: "echarts Tools组件工具"
        },
        children: [
          {
            path: "cartesian2d",
            name: "cartesian2d",
            component: () =>
              import("@/views/echarts/tools/cartesian2d/index.vue"),
            meta: {
              title: "坐标系：直角坐标系"
            }
          },
          {
            path: "coordinate-polar",
            name: "coordinate-polar",
            component: () =>
              import("@/views/echarts/tools/coordinate-polar/index.vue"),
            meta: {
              title: "坐标系：极坐标系"
            }
          },
          {
            path: "coordinate-geo",
            name: "coordinate-geo",
            component: () =>
              import("@/views/echarts/tools/coordinate-geo/index.vue"),
            meta: {
              title: "坐标系：地理坐标系"
            }
          },
          {
            path: "coordinate-calendar",
            name: "coordinate-calendar",
            component: () =>
              import("@/views/echarts/tools/coordinate-calendar/index.vue"),
            meta: {
              title: "坐标系：日历坐标系"
            }
          },

          {
            path: "title",
            name: "title",
            component: () => import("@/views/echarts/tools/title/index.vue"),
            meta: {
              title: "标题：包含主标题和副标题"
            }
          },
          {
            path: "tooltip",
            name: "tooltip",
            component: () => import("@/views/echarts/tools/tooltip/index.vue"),
            meta: {
              title: "提示框"
            }
          },
          {
            path: "toolbox",
            name: "toolbox",
            component: () => import("@/views/echarts/tools/toolbox/index.vue"),
            meta: {
              title: "工具栏：动态类型切换,保存为图片,数据还原等"
            }
          },
          {
            path: "brush",
            name: "brush",
            component: () => import("@/views/echarts/tools/brush/index.vue"),
            meta: {
              title:
                "区域选择：用户可以选择图中一部分数据，从而便于向用户展示被选中数据，或者他们的一些统计计算结果。"
            }
          },
          {
            path: "mark",
            name: "mark",
            component: () => import("@/views/echarts/tools/mark/index.vue"),
            meta: {
              title: "标注：标记点、标记线"
            }
          },
          {
            path: "mark-area",
            name: "mark-area",
            component: () => import("@/views/echarts/tools/mark-area/index.vue"),
            meta: {
              title: "标注：标记区域"
            }
          },
          {
            path: "timeline",
            name: "timeline",
            component: () => import("@/views/echarts/tools/timeline/index.vue"),
            meta: {
              title:
                "时间轴：允许在多个配置选项（options）之间进行切换和播放操作，需要配置baseOption 和 options"
            }
          },
          {
            path: "dataZoom",
            name: "dataZoom",
            component: () => import("@/views/echarts/tools/dataZoom/index.vue"),
            meta: {
              title: "区域缩放：支持鼠标滚轮缩放、框选缩放、触屏缩放"
            }
          },
          {
            path: "singleAxis",
            name: "singleAxis",
            component: () =>
              import("@/views/echarts/tools/singleAxis/index.vue"),
            meta: {
              title: "单轴：适用于只有一维度的数据"
            }
          },
          {
            path: "singleAxis-animation",
            name: "singleAxis-animation",
            component: () =>
              import("@/views/echarts/tools/singleAxis-animation/index.vue"),
            meta: {
              title: "单轴：动画效果"
            }
          },
          {
            path: "visualMap",
            name: "visualMap",
            component: () =>
              import("@/views/echarts/tools/visualMap/index.vue"),
            meta: {
              title: "视觉映射：将数据映射到视觉元素上"
            }
          },
          {
            path: "legend",
            name: "legend",
            component: () => import("@/views/echarts/tools/legend/index.vue"),
            meta: {
              title: "图例"
            }
          },
          {
            path: "legend-basic",
            name: "legend-basic",
            component: () => import("@/views/echarts/tools/legend-basic/index.vue"),
            meta: {
              title: "图例(基础版)"
            }
          },
          {
            path: "legend-icon",
            name: "legend-icon",
            component: () => import("@/views/echarts/tools/legend-icon/index.vue"),
            meta: {
              title: "图例图标"
            }
          },
          {
            path: "symbol",
            name: "symbol",
            component: () => import("@/views/echarts/tools/symbol/index.vue"),
            meta: {
              title: "symbol图形"
            }
          },
          {
            path: "rich",
            name: "rich",
            component: () => import("@/views/echarts/tools/rich/index.vue"),
            meta: {
              title: "富文本"
            }
          },
          {
            path: "dataset",
            name: "dataset",
            component: () => import("@/views/echarts/tools/dataset/index.vue"),
            meta: {
              title: "数据集合（默认按column映射）"
            }
          },
          {
            path: "dataset-row",
            name: "dataset-row",
            component: () => import("@/views/echarts/tools/dataset-row/index.vue"),
            meta: {
              title: "数据集合（按row映射）"
            }
          },
          {
            path: "dataset-encode",
            name: "dataset-encode",
            component: () => import("@/views/echarts/tools/dataset-encode/index.vue"),
            meta: {
              title: "数据集合（数据映射）"
            }
          },
          {
            path: "mediaQuery",
            name: "mediaQuery",
            component: () => import("@/views/echarts/tools/mediaQuery/index.vue"),
            meta: {
              title: "媒体查询（响应式）"
            }
          },
          {
            path: "eventListener",
            name: "eventListener",
            component: () => import("@/views/echarts/tools/eventListener/index.vue"),
            meta: {
              title: "事件处置"
            }
          }
        ]
      }
    ]
  }
];

/** 路由实例 */
export const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory()
      : createWebHistory(),
  routes: constantRoutes.concat(dynamicRoutes)
});
