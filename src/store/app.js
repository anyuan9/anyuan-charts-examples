/** 设备类型 */
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  // 设备类型
  const device = ref("Desktop"); // 设备类型,默认为桌面端,Mobile为移动端,Desktop为桌面端
  // 切换设备类型
  const toggleDevice = (value) => {
    device.value = value;
  };

  return { device, toggleDevice };
});
