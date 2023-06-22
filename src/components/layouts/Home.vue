<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
defineOptions({
  name: "HomePage",
});

const markdownText = ref("");
const options = reactive({
  omitExtraWLInCodeBlocks: false,
  noHeaderId: false,
  prefixHeaderId: false,
  rawPrefixHeaderId: false,
  ghCompatibleHeaderId: false,
  rawHeaderId: false,
  headerLevelStart: false,
  parseImgDimensions: false,
  simplifiedAutoLink: false,
  excludeTrailingPunctuationFromURLs: false,
  literalMidWordUnderscores: false,
  literalMidWordAsterisks: false,
  strikethrough: false,
  tables: true,
  tablesHeaderId: false,
  ghCodeBlocks: true,
  tasklists: true,
  smoothLivePreview: false,
  smartIndentationFix: false,
  disableForced4SpacesIndentedSublists: false,
  simpleLineBreaks: false,
  requireSpaceBeforeHeadingText: false,
  ghMentions: false,
  ghMentionsLink: "https://github.com/{u}",
  encodeEmails: true,
  openLinksInNewWindow: false,
  backslashEscapesHTMLTags: false,
  emoji: true,
  underline: false,
  ellipsis: true,
  completeHTMLDocument: false,
  metadata: false,
  splitAdjacentBlockquotes: false,
});
onMounted(async () => {
  console.log("in on mounted");
  try {
    // 加载 readme 文本
    const response = await axios.get(`${import.meta.env.BASE_URL}home.md`);
    markdownText.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="home-container">
    <VueShowdown
      :class="{ 'markdown-body-light': !isDark, 'markdown-body-dark': isDark }"
      class="markdown-body"
      :markdown="markdownText"
      :options="options"
      flavor="github"
    />
  </div>
</template>

<style lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.markdown-body-light,
.markdown-body-dark {
  max-width: 800px;
  text-align: left;
  border-radius: 15px;
  padding: 20px;
}
@import "~/styles/markdown/github-markdown-dark.css";
@import "~/styles/markdown/github-markdown-light.css";
</style>
