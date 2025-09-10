<script setup>
import SariayaMap from "./SariayaMap.vue";
import stalls from "../assets/data/stalls.json";
import volante1 from "../assets/data/volante1.js";

// Callback function when a stall is clicked
function onStallClick(data) {
  console.log("Stall clicked:", data);
}
</script>

<template>
  <SariayaMap
    :stalls-data="stalls"
    :scope-data="volante1"
    :center="[13.965601, 121.527501]"
    :zoom="20"
    @stall-click="onStallClick"
  />
</template>
