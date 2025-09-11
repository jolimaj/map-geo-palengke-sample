<script setup>
import Map from "./Map.vue";
import stalls from "../assets/data/stalls.json";
import scopeData from "../assets/data/scopeData.json";

// Callback function when a stall is clicked
function onStallClick(data) {
  console.log("Stall clicked:", data);
}
</script>

<template>
  <Map
    :stalls-data="stalls"
    :scope-data="scopeData"
    :center="[13.965601, 121.527501]"
    :zoom="20"
    @stall-click="onStallClick"
  />
</template>
