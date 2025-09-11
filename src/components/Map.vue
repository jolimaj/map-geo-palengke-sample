<template>
  <div class="map-container" :style="{ height }">
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
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-search";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet.locatecontrol";

// ✅ Fix: Ensure marker icons resolve correctly after npm publish
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  name: "SariayaMap",
  props: {
    stallsData: { type: Object, required: true },
    scopeData: { type: Object, default: null },
    center: { type: Array, default: () => [13.965601, 121.527501] },
    zoom: { type: Number, default: 20 },
    height: { type: String, default: "600px" } // ✅ Users can set map height
  },
  emits: ["stall-click"],
  setup(props, { emit }) {
    const selectedStall = ref(null);
    const popupPosition = ref({ x: 0, y: 0 });
    let map;
    let resizeObserver;

    const initMap = () => {
      if (map) {
        map.remove(); // ✅ Prevent "already initialized"
      }

      map = L.map("map").setView(props.center, props.zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      if (props.scopeData) {
        L.geoJSON(props.scopeData).addTo(map);
      }

      L.geoJSON(props.stallsData, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
          const propsData = feature.properties;
          if (!propsData) return;

          layer.on("click", (e) => {
            selectedStall.value = propsData;
            const point = map.latLngToContainerPoint(e.latlng);
            popupPosition.value = { x: point.x + 10, y: point.y - 10 };
            emit("stall-click", propsData);
          });
        }
      }).addTo(map);

      // ✅ Initial size fix
      setTimeout(() => map.invalidateSize(), 300);

      // ✅ Auto-resize with ResizeObserver
      const container = document.querySelector(".map-container");
      if (container) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(container);
      }
    };

    onMounted(() => {
      nextTick(initMap);
    });

    onBeforeUnmount(() => {
      if (map) map.remove();
      if (resizeObserver) resizeObserver.disconnect();
    });

    return { selectedStall, popupPosition, height: props.height };
  }
};
</script>

<style>
/* ⚠️ Do NOT use scoped, Leaflet CSS must stay global */
.map-container {
  position: relative;
  width: 100%;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.stall-popup {
  position: absolute;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  pointer-events: none;
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
