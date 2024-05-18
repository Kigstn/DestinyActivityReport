<script setup lang="ts">
import {watch} from "vue";
import {useWindowScroll} from "@vueuse/core";
const {x, y} = useWindowScroll()


</script>

<template>
      {{y}}

<div class="h-screen bg-black flex flex-col">

      <!-- COLUMN ONE -->
      <div class="flex flex-col h-full">

          <div class="h-full grow-0 overflow-y-auto">
            <div class="flex flex-col">
              <div class="h-48 bg-black"></div>
              <div class="h-48 bg-red-700"></div>
              <div class="h-48 bg-black"></div>
              <div class="h-48 bg-red-700"></div>
              <div class="h-48 bg-black"></div>
              <div class="h-48 bg-red-700"></div>
              <div class="h-48 bg-black"></div>
              <div class="h-48 bg-red-700"></div>
            </div>
          </div>

          <div class="bg-red-200 h-32">
            This will always be fixed height
          </div>

          <div class="bg-red-300 h-20">
            This will always be fixed height
          </div>


      </div>
{{y}}
</div>
</template>
