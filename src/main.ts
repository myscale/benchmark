import { createApp } from "vue";
import router from "./router/router";
import App from "./App.vue";
import { VueShowdownPlugin } from 'vue-showdown';
// import VueMarkdownEditor from '@kangc/v-md-editor';
// import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

// import Prism from 'prismjs';
// VueMarkdownEditor.use(vuepressTheme, {
//   Prism,
// });
// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";

import "uno.css";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";

const app = createApp(App);
app.use(VueShowdownPlugin, {
  // set default flavor of showdown
  // flavor: 'allOn',
  // // set default options of showdown (will override the flavor options)
  // options: {
  //   emoji: false,
  //   tables: true,
  //   tablesHeaderId: false,
  //   ghCodeBlocks: true,
  //   tasklists: true,
  // },
}).use(router).mount('#app');
// app.use(ElementPlus);
// app.mount("#app");
