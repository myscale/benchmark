import { nextTick, onMounted, reactive, ref, watch, Ref } from "vue";
import Plotly from "plotly.js-dist";
import { each_json, plotly_dark_theme, plotly_white_theme } from "./type";
import { useDark } from "@vueuse/core";
// 自定义 plotly 颜色条
const plotly_color = ['#ffbb78', '#6b6ecf', '#bcbd22', '#17becf', '#c7c7c7', '#ff7f0e', '#9c9ede', '#7f7f7f', '#dbdb8d', '#9edae5', '#c49c94', '#e377c2', '#5254a3', '#393b79', '#d62728', '#aec7e8', '#f7b6d2', '#98df8a', '#ff9896', '#1f77b4', '#637939', '#9467bd', '#2ca02c', '#8c564b', '#c5b0d5'];
const current_dark = useDark();

// 自定义 hover 模版
const hovertemplate = ` value: %{y}<br>
mean_precisions: %{x}<br>
engine: %{customdata[0]}<br>
version: %{customdata[1]}<br>
remark: %{customdata[2]}<br>
dataset: %{customdata[3]}<br>
dataset_tag: %{customdata[4]}<br>
benchmark_run_at: %{customdata[5]}<br>
monthly_cost: %{customdata[6]}<br>
index_type: %{customdata[7]}<br>
index_create_parameter: %{customdata[8]}<br>
index_search_params: %{customdata[9]}<br>
<extra></extra>`;

// groupBy 分组函数
function groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K): Record<K, T[]> {
  return list.reduce((result, item) => {
    const key = getKey(item);
    const record = result as Record<K, T[]>;
    if (!record[key]) {
      record[key] = [];
    }
    record[key].push(item);
    return record;
  }, {} as Record<K, T[]>);
}

// 过滤 each json 数据点
// type FilterRule = 'ge' | 'le' | 'l';
function filterDataPoints(eachPoints: each_json[], pointProperty: keyof each_json): each_json[] {

  let outputArray = eachPoints.filter((value, index, self) => {
  // 从当前元素的下一个元素开始搜索
    let nextIndex = -1;
    if (pointProperty === 'rps' ) {
      nextIndex = self.findIndex((v, i) => i > index && v[pointProperty] > value[pointProperty]);
    } else if (pointProperty === 'mean_time' || pointProperty === 'p95_time' || pointProperty === 'cost') {
      nextIndex = self.findIndex((v, i) => i > index && v[pointProperty] < value[pointProperty]);
    } else if (pointProperty === 'total_upload') {
      nextIndex = self.findIndex((v, i) => i > index && v[pointProperty] <= value[pointProperty]);
    }
    
    // 如果找到了更大的元素，则删除当前元素（即不包含在结果数组中）
    // 如果没有找到更大的元素，则保留当前元素（即包含在结果数组中）
    return nextIndex === -1;
  });

  return outputArray;
}


function getLastItems(obj: { [key: string]: each_json[] }): each_json[] {
  const result: each_json[] = [];
  
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (Array.isArray(value) && value.length > 0) {
      result.push(value[value.length-1]);
    }
  });
  
  return result;
}
// function refreshPlotlyChart()

export function refreshScatterChart(filtered_data: each_json[], plotlyLineChart: any, plotlyScatterChart: any, indicator: keyof each_json) {
  console.log("filtered_data is", filtered_data);
  // 每个 traces 子元素 trace 对应一条曲线
  const traces_line = [];
  const traces_scatter = [];
  // 将原始数据按照 hash_code 进行分组
  const groups = groupBy(filtered_data, item => item.hash_code);
  let group_index = 0;
  let color_index = 0;
  // 记录处理数据过程中出现的所有的 parallel search
  let generated_xaxis_list: any[] = [];
  for (const group in groups) {
    // 需要对每组 group 继续按照 search parallel 分组
    const sub_groups_by_parallel = groupBy(groups[group], item => item.search_parallel);
    generated_xaxis_list = Array.from(new Set(generated_xaxis_list.concat(Object.keys(sub_groups_by_parallel))));
    // TODO 过滤不符合条件的 parallel
    let is_first: boolean = true;
    for (const sub_group_parallel in sub_groups_by_parallel) {
      // 对于 total_upload 需要进行额外的过滤
      let each_data_line = [];
      let each_data_scatter = [];
      if (indicator === 'total_upload') {
        const sub_sub_groups_by_index_create = groupBy(sub_groups_by_parallel[sub_group_parallel], item => JSON.stringify(item.index_create_parameter));
        each_data_line = getLastItems(sub_sub_groups_by_index_create);
        each_data_scatter = getLastItems(sub_sub_groups_by_index_create);
        console.log("total upload each_data is ", each_data_line);
      } else {
        each_data_line = filterDataPoints(sub_groups_by_parallel[sub_group_parallel], indicator);
        each_data_scatter = sub_groups_by_parallel[sub_group_parallel];
      }
      console.log("parallel: ", sub_group_parallel, " each_data: ", each_data_line);
      // const itemKey = `${each_data_line[0].engine}-${each_data_line[0].index_type}-${each_data_line[0].hash_code.toString().slice(-5)}`
      const itemKey = `${each_data_line[0].engine}-${each_data_line[0].index_type}${each_data_line[0].dataset_tag==='no-filter'?'':'-'+each_data_line[0].dataset_tag}`;
      const custome_line_data = each_data_line.map(d => [d.engine, d.version, d.remark, d.dataset, d.dataset_tag, new Date(d.time_stamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), d.monthly_cost, d.index_type, JSON.stringify(d.index_create_parameter), JSON.stringify(d.index_search_params)]);
      const custome_scatter_data = each_data_scatter.map(d => [d.engine, d.version, d.remark, d.dataset, d.dataset_tag, new Date(d.time_stamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), d.monthly_cost, d.index_type, JSON.stringify(d.index_create_parameter), JSON.stringify(d.index_search_params)]);
      const trace_line = {
        x: each_data_line.map(d => d.mean_precisions),
        y: each_data_line.map(d => d[indicator]),
        xaxis: 'x' + sub_group_parallel,
        yaxis: 'y',
        mode: 'lines+markers',
        type: 'scatter',
        name: itemKey,
        legendgroup: itemKey,
        showlegend: is_first,
        line: {
          color: plotly_color[color_index]
        },
        customdata: custome_line_data,
        hovertemplate: hovertemplate,
        marker: { size: 8 },
      };
      const trace_scatter = {
        x: each_data_scatter.map(d => d.mean_precisions),
        y: each_data_scatter.map(d => d[indicator]),
        xaxis: 'x' + sub_group_parallel,
        yaxis: 'y',
        mode: 'markers',
        type: 'scatter',
        name: itemKey,
        legendgroup: itemKey,
        showlegend: is_first,
        line: {
          color: plotly_color[color_index]
        },
        customdata: custome_scatter_data,
        hovertemplate: hovertemplate,
        marker: { size: 8 },
      };
      // console.log("line", trace_line.customdata);
      // console.log("scatter", trace_scatter.customdata);
      traces_line.push(trace_line);
      traces_line.sort((a, b) => a.legendgroup.localeCompare(b.legendgroup));
      traces_scatter.push(trace_scatter);
      traces_scatter.sort((a, b) => a.legendgroup.localeCompare(b.legendgroup));

      is_first = false;
    }
    // 更新完 group index 和 color index
    group_index += 1;
    color_index = group_index % plotly_color.length;
  }
  // 声明图表 layout 样式
  let layout = {
    paper_bgcolor: current_dark.value ? plotly_dark_theme.paper_bgcolor : plotly_white_theme.paper_bgcolor,
    plot_bgcolor: current_dark.value ? plotly_dark_theme.plot_bgcolor : plotly_white_theme.plot_bgcolor,
    font: {
      color: current_dark.value ? plotly_dark_theme.font_color : plotly_white_theme.font_color
    },
    yaxis: {
      autorange: true,
      gridcolor: current_dark.value ? plotly_dark_theme.gridcolor : plotly_white_theme.gridcolor,
      rangemode: 'tozero',  // 使 y 轴起始位置为 0，终点位置自适应
      title: indicator==='rps' ? 'Throughput (QPS)': (indicator === 'cost' ? 'Monthly Cost ($) Per 100 QPS' : 'Time (s)'), // y 轴的单位是米
      showline: true,
    },
  };
  // 处理生成 xaxis layout
  generated_xaxis_list.sort((a, b) => a - b);
  let layout_xaxis: { [key: string]: any } = {};
  let dynamic_annotations: any[] = [];
  // blank 是两个子图之间的留白比例
  let blank: number = 0.02;
  let gap: number = (1 - (generated_xaxis_list.length - 1) * blank) / generated_xaxis_list.length;
  // 动态计算子图之间的间距和宽度
  for (let i = 0; i < generated_xaxis_list.length; i++) {
    const key = `xaxis${generated_xaxis_list[i]}`
    if (i != generated_xaxis_list.length - 1) {
      layout_xaxis[key] = { domain: [(gap + blank) * i, (gap + blank) * i + gap], title: "mean_precision", gridcolor: current_dark.value ? plotly_dark_theme.gridcolor : plotly_white_theme.gridcolor};
    } else {
      layout_xaxis[key] = { domain: [(gap + blank) * i, 1], title: "mean_precision", gridcolor: current_dark.value ? plotly_dark_theme.gridcolor : plotly_white_theme.gridcolor };
    }
    dynamic_annotations.push({
      xref: 'paper',
      yref: 'paper',
      x: (gap + blank) * i + gap/2,
      y: 1.05,
      xanchor: 'center',
      yanchor: 'bottom',
      text: 'Search Threads: '+generated_xaxis_list[i],
      showarrow: false,
      font: {
        size: 12
      }
    });
  }
  // 整合最终的 layout
  layout = { ...layout, ...layout_xaxis, ...{ annotations:dynamic_annotations} };
  console.log("layout:", layout);
  console.log('generated_xaxis_list', generated_xaxis_list);
  Plotly.newPlot(plotlyLineChart, traces_line, layout);
  Plotly.newPlot(plotlyScatterChart, traces_scatter, layout);
}


