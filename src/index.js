// src/index.js
import Map from './components/Map.vue';

export { Map };

// Optional default export for Vue plugin usage
export default {
  install(app) {
    app.component('VueMap', Map);
  }
};
