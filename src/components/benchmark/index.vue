<script lang="ts" setup>
import { Ref, nextTick, onMounted, reactive, ref, watch } from "vue";
import {
  each_json,
  form_data_default,
  cascade_results_default,
  plotly_dark_theme,
  plotly_white_theme,
} from "./type";
import { refreshScatterChart } from "./plotlyChartsHook";
import { ElMessage } from "element-plus";
import { useDark } from "@vueuse/core";
import axios from "axios";
import Plotly from "plotly.js-dist";
// import KProgress from "k-progress-v3/dist/k-progress.umd.js";
const current_dark = useDark();
const benchmark_data_path = `${import.meta.env.BASE_URL}benchmark.json`;
defineOptions({
  name: "BenchmarkPage",
});

watch(
  () => current_dark.value,
  (newVal) => {
    var currentLayout = plotlyLineChart.value.layout;
    // 获取所有包含 "axis" 的键
    let axisKeys = Object.keys(currentLayout).filter((key) =>
      key.includes("axis")
    );
    if (newVal) {
      currentLayout.paper_bgcolor = plotly_dark_theme.paper_bgcolor;
      currentLayout.plot_bgcolor = plotly_dark_theme.plot_bgcolor;
      currentLayout.font.color = plotly_dark_theme.font_color;
      // 遍历这些键，更新它们的值
      for (let key of axisKeys) {
        currentLayout[key] = {
          ...currentLayout[key], // 保留原有的属性
          gridcolor: plotly_dark_theme.gridcolor, // 更新 gridcolor 属性
        };
      }
    } else {
      currentLayout.paper_bgcolor = plotly_white_theme.paper_bgcolor;
      currentLayout.plot_bgcolor = plotly_white_theme.plot_bgcolor;
      currentLayout.font.color = plotly_white_theme.font_color;
      // 遍历这些键，更新它们的值
      for (let key of axisKeys) {
        currentLayout[key] = {
          ...currentLayout[key], // 保留原有的属性
          gridcolor: plotly_white_theme.gridcolor, // 更新 gridcolor 属性
        };
      }
    }
    Plotly.react(
      plotlyLineChart.value,
      plotlyLineChart.value.data,
      currentLayout
    );
    Plotly.react(
      plotlyScatterChart.value,
      plotlyScatterChart.value.data,
      currentLayout
    );
    console.log(currentLayout); // 输出图表的当前布局
  }
);
// 合并两个数组
function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((value) => array2.includes(value));
}
// 定义通用数据对象
const raw_data: Ref<each_json[]> = ref([]);
const formRef = ref();
const form_data = reactive(form_data_default);
const cascade_results: Ref<any> = ref(cascade_results_default);
const plotlyLineChart = ref();
const plotlyScatterChart = ref();
const clicked_total_upload = ref(false);
let pre_selected_topk: string = "🚀";
let pre_selected_parallel: string[] = [];
const isLoading: Ref<boolean> = ref(true);

/** 更新 datasets_group */
watch(
  () => form_data.datasets_selected,
  (newVal) => {
    console.log("dataset updated", newVal);
    // 更新 datasets_tag
    form_data.dataset_tag_candidates = Object.keys(
      cascade_results.value[newVal as string]
    );
    form_data.dataset_tag_selected = form_data.dataset_tag_candidates;
    // 根据选中的 dataset tag 更新选中的 parallel candidates / selected
    const validParallelSet = new Set<string>();
    const validTopkSet = new Set<string>();

    const dataset_group_object = cascade_results.value[newVal as string];
    if (dataset_group_object) {
      for (const dataset_tag in dataset_group_object) {
        const valid_parallel = dataset_group_object[dataset_tag].valid_parallel;
        const valid_topk = dataset_group_object[dataset_tag].valid_topk;
        valid_parallel.forEach((value: string) => validParallelSet.add(value));
        valid_topk.forEach((value: string) => validTopkSet.add(value));
      }
    }
    form_data.parallel_candidates = Array.from(validParallelSet);
    form_data.parallel_selected = Array.from(validParallelSet);
    // 更新 topk
    form_data.topk_candidates = Array.from(validTopkSet);
    if (!form_data.topk_candidates.includes(form_data.topk)) {
      form_data.topk = form_data.topk_candidates[0];
    }
  }
);

/** 更新 dataset-tag */
watch(
  () => form_data.dataset_tag_selected,
  (newVal, oldVal) => {
    if (newVal.length === 0 && oldVal.length != 0) {
      ElMessage({
        message: "👽 dataset-tag can't be empty.",
        type: "warning",
      });
      form_data.dataset_tag_selected = oldVal;
      return;
    }
    console.log("datasets tag updated", newVal);
    // 根据选中的 dataset tag 更新选中的 parallel candidates / selected
    const validParallelSet = new Set<string>();
    const validTopkSet = new Set<string>();
    const dataset_group_object =
      cascade_results.value[form_data.datasets_selected];
    if (dataset_group_object) {
      for (const dataset_tag in dataset_group_object) {
        if (newVal.includes(dataset_tag)) {
          const valid_parallel =
            dataset_group_object[dataset_tag].valid_parallel;
          const valid_topk = dataset_group_object[dataset_tag].valid_topk;
          valid_parallel.forEach((value: string) =>
            validParallelSet.add(value)
          );
          valid_topk.forEach((value: string) => validTopkSet.add(value));
        }
      }
    }
    form_data.parallel_candidates = Array.from(validParallelSet);
    form_data.parallel_selected = intersection(
      form_data.parallel_candidates,
      form_data.parallel_selected
    );
    // 更新 topk
    form_data.topk_candidates = Array.from(validTopkSet);
    if (!form_data.topk_candidates.includes(form_data.topk)) {
      form_data.topk = form_data.topk_candidates[0];
    }
  }
);

/** 过滤 benchmark data */
watch(
  () => [
    form_data.datasets_selected,
    form_data.dataset_tag_selected,
    form_data.parallel_selected,
    form_data.indicator_selected,
    form_data.topk,
    form_data.indicator_selected,
  ],
  (newVal, oldVal) => {
    if (form_data.dataset_tag_selected.length === 0) {
      return;
    }
    if (newVal[2].length === 0) {
      ElMessage({
        message: "👽 search-parallel can't be empty.",
        type: "warning",
      });
      form_data.parallel_selected = oldVal[2] as string[];
      return;
    }
    /** 对 total_upload 单独进行处理 */
    if (
      form_data.indicator_selected === "total_upload" &&
      oldVal[3] != newVal[3]
    ) {
      clicked_total_upload.value = true;
      pre_selected_topk = form_data.topk;
      pre_selected_parallel = form_data.parallel_selected;
      // form_data.topk = form_data.topk_candidates[0];
      form_data.parallel_selected = [form_data.parallel_candidates[0]];
      console.log("you clicked_total_upload", clicked_total_upload);
      // return;
    }
    if (oldVal[3] === "total_upload" && newVal[3] != "total_upload") {
      clicked_total_upload.value = false;
      form_data.topk = pre_selected_topk;
      form_data.parallel_selected = pre_selected_parallel;
      console.log("you cancel clicked_total_upload", clicked_total_upload);
    }
    /** 过滤 benchmark data */
    let filtered_data = raw_data.value.filter(
      (item) =>
        item.dataset_group === form_data.datasets_selected &&
        form_data.dataset_tag_selected.includes(item.dataset_tag) &&
        form_data.topk === item.search_top.toString() &&
        form_data.parallel_selected.includes(item.search_parallel.toString())
    );
    // console.log(
    //   "form_data.indicator_selected is",
    //   form_data.indicator_selected
    // );
    /** 重新生成图表 */
    refreshScatterChart(
      filtered_data,
      plotlyLineChart.value,
      plotlyScatterChart.value,
      form_data.indicator_selected as keyof each_json
    );
  }
);

/** 初始化级联关系 */
function initCascade(raw_data: each_json[]) {
  const results: any = {};

  raw_data.forEach((eachJson) => {
    const { dataset_group, dataset_tag, search_parallel, search_top } =
      eachJson;
    // 如果 results 对象中没有这个 dataset_group 属性，那么就创建一个新的对象
    if (!results[dataset_group]) {
      results[dataset_group] = {};
    }
    // 如果 dataset_group_object 对象中没有这个 dataset_tag 属性，那么就创建一个新的对象，包含 valid_parallel 和 valid_topk 属性
    if (!results[dataset_group][dataset_tag]) {
      results[dataset_group][dataset_tag] = {
        valid_parallel: new Set(),
        valid_topk: new Set(),
      };
    }
    // 将 search_parallel 添加到 valid_parallel 集合中
    results[dataset_group][dataset_tag].valid_parallel.add(search_parallel);
    // 将 search_top 添加到 valid_topk 集合中
    results[dataset_group][dataset_tag].valid_topk.add(search_top);
  });

  // 将集合转换为数组
  for (const dataset_group in results) {
    for (const dataset_tag in results[dataset_group]) {
      results[dataset_group][dataset_tag].valid_parallel = Array.from(
        results[dataset_group][dataset_tag].valid_parallel
      )
        .sort((a, b) => <number>a - <number>b)
        .map(String);
      results[dataset_group][dataset_tag].valid_topk = Array.from(
        results[dataset_group][dataset_tag].valid_topk
      )
        .sort((a, b) => <number>a - <number>b)
        .map(String);
    }
  }

  return results;
}

onMounted(async () => {
  isLoading.value = true;

  // 等待页面渲染完成, 进行预处理
  nextTick(async () => {
    setTimeout(async () => {
      try {
        const response = await axios.get(benchmark_data_path);
        raw_data.value = response.data;
        isLoading.value = false;
        cascade_results.value = initCascade(raw_data.value);
        form_data.datasets_selected = "";
        if (Object.keys(cascade_results.value).includes("laion-768-5m-ip")) {
          form_data.datasets_selected = "laion-768-5m-ip";
        } else {
          form_data.datasets_selected = Object.keys(cascade_results.value)[0];
        }
        form_data.datasets_candidates = Object.keys(cascade_results.value);
        console.log("loading benchmark json finished");
      } catch (error) {
        console.error(error);
      }
    }, 500);
  });
});
</script>

<template>
  <div class="benchmark-container">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form_data"
      class="bg-bg_color w-[99/100] pt-4 mb-5 mt-5"
    >
      <!-- Indicator 性能指标 -->
      <el-row class="max-w-full">
        <el-col :span="7">
          <div class="grid-content ep-bg-purple">
            <div class="grid-content ep-bg-purple">
              <el-form-item label="Datasets" class="font-bold">
                <el-select v-model="form_data.datasets_selected">
                  <el-option
                    v-for="(tag, index) in form_data.datasets_candidates"
                    :key="index"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ep-bg-purple">
            <el-form-item label="Dataset Tag" class="font-bold">
              <el-select v-model="form_data.dataset_tag_selected" multiple>
                <el-option
                  v-for="(tag, index) in form_data.dataset_tag_candidates"
                  :key="index"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content ep-bg-purple">
            <div class="grid-content ep-bg-purple-light">
              <el-form-item label="Plot Values" class="font-bold">
                <el-radio-group v-model="form_data.indicator_selected">
                  <el-radio label="rps" class="!w-[100px]">Throughput</el-radio>

                  <el-radio label="mean_time" class="!w-[100px]"
                    >Mean Latency</el-radio
                  >
                  <el-radio label="p95_time" class="!w-[100px]"
                    >P95 Latency</el-radio
                  >
                  <el-radio label="total_upload" class="!w-[150px]">
                    Upload and Build Time
                  </el-radio>
                  <el-radio label="cost" class="!w-[200px]"
                    >Monthly Cost Per 100 QPS</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- parallel / topk / dataset-tag / blur-search -->
      <el-row class="max-w-2xl">
        <el-col :span="16">
          <div class="grid-content ep-bg-purple">
            <el-form-item label="Search Threads" class="font-bold">
              <el-checkbox-group v-model="form_data.parallel_selected">
                <el-checkbox
                  label="1"
                  class="!w-[15px]"
                  :disabled="
                    !form_data.parallel_candidates.includes('1') ||
                    clicked_total_upload
                  "
                />
                <el-checkbox
                  label="2"
                  class="!w-[15px]"
                  :disabled="
                    !form_data.parallel_candidates.includes('2') ||
                    clicked_total_upload
                  "
                />
                <el-checkbox
                  label="4"
                  class="!w-[15px]"
                  :disabled="
                    !form_data.parallel_candidates.includes('4') ||
                    clicked_total_upload
                  "
                />
                <el-checkbox
                  label="8"
                  class="!w-[15px]"
                  :disabled="
                    !form_data.parallel_candidates.includes('8') ||
                    clicked_total_upload
                  "
                />
                <el-checkbox
                  label="16"
                  class="!w-[15px]"
                  :disabled="
                    !form_data.parallel_candidates.includes('16') ||
                    clicked_total_upload
                  "
                />
                <el-checkbox
                  label="32"
                  class="!w-[15px]"
                  :disabled="
                    !form_data.parallel_candidates.includes('32') ||
                    clicked_total_upload
                  "
                />
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content ep-bg-purple">
            <el-form-item label="TopK" class="font-bold">
              <el-radio-group v-model="form_data.topk">
                <el-radio
                  label="10"
                  class="!w-[25px]"
                  :disabled="
                    !form_data.topk_candidates.includes('10') ||
                    clicked_total_upload
                  "
                  >10</el-radio
                >
                <el-radio
                  label="100"
                  class="!w-[25px]"
                  :disabled="
                    !form_data.topk_candidates.includes('100') ||
                    clicked_total_upload
                  "
                  >100</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>

        <!-- </div> -->
      </el-row>
    </el-form>
    <el-card class="results-card" shadow="hover">
      <div class="results-chart">
        <div v-if="isLoading" class="loader-inner ball-clip-rotate">
          <div></div>
        </div>
        <div ref="plotlyLineChart" />
        <div ref="plotlyScatterChart" />
        <a :href="benchmark_data_path" download="benchmark.json">⏬ raw data</a>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.ep-select__tags .ep-tag {
  margin: 2px 0px 2px 0;
}

.ep-form--inline .ep-form-item {
  display: flex;
}

.benchmark-container {
  // height: calc(100vh);
}
.results-card {
  border: none;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
}
.ep-card__body {
  padding: 10px;
}
.results-chart {
  width: 100%;
}
@import "loaders.css/loaders.min.css";
.ball-clip-rotate > div {
  border-color: rgb(222, 155, 239);
}

.js-plotly-plot .plotly .main-svg {
  border-radius: 10px;
}
.main-svg {
  // background-color: bisque;
}
.ep-select {
  min-width: 230px;
}
</style>
