<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// export default {
//   created() {
//     setInterval(() => {
//       this.checkVersion();
//     }, 60000);
//   },
//   methods: {
//     checkVersion() {
//       this.$axios
//         .get(`${process.env.VUE_APP_BASEURL}/fpm/assets/version.json`, {
//           headers: { "Cache-Control": "no-cache" }
//         }) // 反正就是要请求到json文件的内容, 并且禁止缓存
//         .then(res => {
//           const version = res.data.version;
//           const clientVersion = sessionStorage.getItem("_version_");

//           console.log("最新版本>>", version);
//           console.log("当前版本>>", clientVersion);

//           // 和最新版本不同，刷新页面
//           if (version !== clientVersion) {
//             sessionStorage.setItem("_version_", version);
//             window.location.reload();
//           }
//         });
//     }
//   }
// };
</script>

<style lang="scss">
@import url("./assets/fonts/iconfont.css");

#app {
  height: 100%;
}
</style>
