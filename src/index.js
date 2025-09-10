import SariayaMap from "./components/SariayaMap.vue";

export { SariayaMap }; // named export

// optional: install function for Vue.use()
export default {
  install(app) {
    app.component("SariayaMap", SariayaMap);
  }
};
