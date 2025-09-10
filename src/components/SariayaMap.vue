<template>
  <div class="map-container">
    <div id="map" class="map"></div>

    <!-- Stall info displayed outside the map -->
    <div v-if="selectedStall" class="stall-info">
      <h3>Stall Information</h3>
      <p v-for="(value, key) in selectedStall" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </p>
      <img v-if="selectedStall.Image" :src="selectedStall.Image" alt="Stall" class="stall-img" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet plugins
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-search";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet.locatecontrol";
import "leaflet.browser.print/dist/leaflet.browser.print.min.js";

export default {
  name: "SariayaMap",
  props: {
    stallsData: {
      type: Object,
      required: true
    },
    scopeData: {
      type: Object,
      required: false,
      default: null
    },
    center: {
      type: Array,
      default: () => [13.965601, 121.527501]
    },
    zoom: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
    const coordinate = ref({ lat: "--", lng: "--" });
    const selectedStall = ref(null);
    let map;

    const initMap = () => {
      map = L.map("map").setView(props.center, props.zoom);

      // Base layers
      const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      const googleSat = L.tileLayer("https://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });

      // Controls
    //   L.control.scale().addTo(map);
    //   L.control.browserPrint().addTo(map);
    //   L.Control.geocoder().addTo(map);

      // Track mouse coordinates
      map.on("mousemove", (e) => {
        coordinate.value.lat = e.latlng.lat.toFixed(6);
        coordinate.value.lng = e.latlng.lng.toFixed(6);
      });

      // Locate control outline
      if (props.scopeData) {
        const scopeLayer = L.geoJSON(props.scopeData, {
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              let popupContent = "";
              for (let key in feature.properties) {
                popupContent += `<b>${key}:</b> ${feature.properties[key]}<br>`;
              }
              layer.bindPopup(popupContent || "No data available");
            }
          }
        }).addTo(map);

        // Add search bound to ScopeData
        new L.Control.Search({
          layer: scopeLayer,
          propertyName: "StallNumber",
          marker: false,
          moveToLocation: (latlng, title, map) => {
            map.setView(latlng, 21);
          }
        }).addTo(map);
      }

      // list
      L.geoJSON(props.stallsData, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
          const propsData = feature.properties;
          if (!propsData) return;

          // Update info panel when clicked
          layer.on("click", () => {
            selectedStall.value = propsData;
          });
        }
      }).addTo(map);
    };

    onMounted(() => {
      initMap();
    });

    return { coordinate, selectedStall };
  }
};
</script>

<style scoped>
.map-container {
  display: flex;
  gap: 20px;
}

.map {
  flex: 2;
  height: 600px;
}

.stall-info {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
  font-size: 14px;
}

.stall-info h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.stall-img {
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
