<script setup>
import SariayaMap from "@/components/SariayaMap.vue";

import stalls from "@/assets/data/stalls.json";
import volante1 from "@/assets/data/volante1.js";
</script>

<template>
  <SariayaMap
    :stalls-data="stalls"
    :scope-data="volante1"
    :center="[13.965601, 121.527501]"
    :zoom="20"
  />
</template>
