import { createI18n } from "vue-i18n";

import zhCN from "./lang/zh-CN";
import enUS from "./lang/en-US";

export const i18n = createI18n({
  legacy: false, // 是否使用旧版语法 this.$t()
  locale: "zh-CN", // 默认语言
  fallbackLocale: "en-US", // 回退语言
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export default i18n;
