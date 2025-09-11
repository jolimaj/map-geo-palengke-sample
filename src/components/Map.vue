<template>
  <div class="map-container">
    <div id="map" class="map"></div>

    <!-- Overlay popup -->
    <div
      v-if="selectedStall"
      class="stall-popup"
      :style="{ top: popupPosition.y + 'px', left: popupPosition.x + 'px' }"
    >
      <h3>Stall Information</h3>
      <p v-for="(value, key) in selectedStall" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-search";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet.locatecontrol";

export default {
  name: "SariayaMap",
  props: {
    stallsData: { type: Object, required: true },
    scopeData: { type: Object, default: null },
    center: { type: Array, default: () => [13.965601, 121.527501] },
    zoom: { type: Number, default: 20 }
  },
  emits: ["stall-click"],
  setup(props, { emit }) {
    const selectedStall = ref(null);
    const popupPosition = ref({ x: 0, y: 0 });
    let map;

    const initMap = () => {
      map = L.map("map").setView(props.center, props.zoom);

      // Base layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Optional scope data
      if (props.scopeData) {
        L.geoJSON(props.scopeData).addTo(map);
      }

      L.geoJSON(props.stallsData, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
          const propsData = feature.properties;
          if (!propsData) return;

          layer.on("click", (e) => {
            // Update overlay content
            selectedStall.value = propsData;

            // Calculate popup position
            const point = map.latLngToContainerPoint(e.latlng);
            popupPosition.value = { x: point.x + 10, y: point.y - 10 };

            // Emit event
            emit("stall-click", propsData);
          });
        }
      }).addTo(map);
    };

    onMounted(initMap);

    return { selectedStall, popupPosition };
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 600px;
}

.map {
  width: 100%;
  height: 100%;
}

.stall-popup {
  position: absolute;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  pointer-events: none; /* allows map dragging */
  max-width: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.stall-popup h3 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.stall-popup p {
  margin: 0;
}
</style>
