<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>Sprint Planner 1.0</h2>
      </div>

      <v-spacer></v-spacer>

      <!-- <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>-->
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <!-- <HelloWorld /> -->
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default Vue.extend({
  name: "App",

  components: {
    HelloWorld
  },

  data: () => ({
    //
  })
});
</script>
