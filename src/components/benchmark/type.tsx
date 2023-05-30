export interface each_json {
  hash_code: number;
  engine: string;
  version: string;
  remark: string;
  index_type: string;
  dataset: string;
  dataset_group: string;
  dataset_tag: string;
  time_stamp: number;
  cost: number;
  monthly_cost: number;
  index_create_parameter: object;
  index_search_params: object;
  search_parallel: number;
  search_top: number;
  upload_parallel: number;
  upload_batch_size: number;
  mean_precisions: number;
  rps: number;
  p95_time: number;
  mean_time: number;
  total_upload: number;
};

export const form_data_default = {
  datasets_selected: "🚀",
  datasets_candidates: ["🏀"],
  dataset_tag_candidates: ["🌲", "🏜️"],
  dataset_tag_selected: ["🏜️", "🪐"],
  indicator_selected: "rps",
  parallel_selected: ["1", "2", "4", "8"],
  parallel_candidates: ["1", "2", "4", "8"],
  topk: "10",
  topk_candidates: ["10", "100"]
};

export const cascade_results_default = {
  "gist_960": {
    "no-filter": {
      "valid_parallel": ["1", "2", "4", "8"],
      "valid_top": ["10"]
    }
  } 
}

// TODO 初始化主题通用配置
export const plotly_dark_theme = {
  paper_bgcolor: "#303030", // 背景灰
  plot_bgcolor: "#3b3b3b", // 子图内容区颜色
  font_color: "#ffff",  // 字体颜色
  gridcolor: "#989898", // gridcolor 需要应用在所有的坐标轴上
};
export const plotly_white_theme = {
  paper_bgcolor: "#fbfbfc", // 背景白
  plot_bgcolor: "#fbfbfc", // 子图内容区颜色
  font_color: "#000000", // 字体颜色
  gridcolor: "#e2e2e2", // gridcolor 需要应用在所有的坐标轴上
};