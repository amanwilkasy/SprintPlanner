<template>
  <v-container>
    <v-simple-table>
      <template v-slot:default>
        <h2 class="text-center">Schedual</h2>
        <table dark>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" v-for="(day, index) in workDays" :key="index">{{day}}</th>
            </tr>
            <tr>
              <th scope="col">Name</th>
              <th scope="col" v-for="(day, index) in workDaysString" :key="index">{{day}}</th>
            </tr>
          </thead>
          <tbody v-for="(assignment, index) in assignments" :key="index">
            <tr>
              <th scope="row">{{assignment.name}}</th>
              <td v-for="(task, index2) in assignment.tasks" :key="index2">
                <v-btn small :color="getLegend(task.module)" type="button">{{task.taskId}}</v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </v-simple-table>

    <br />
    <v-btn
      onclick="this.href='data:text/html;charset=UTF-8,'+encodeURIComponent(document.documentElement.outerHTML)"
      href="#"
      download="schedual.html"
      large
    >Download Schedual</v-btn>
    <br />

    <v-simple-table>
      <template v-slot:default>
        <h2 class="text-center">Legend</h2>
        <br />
        <table dark>
          <thead>
            <tr>
              <th scope="col" v-for="(mod, index) in modules" :key="index">
                <v-btn large :color="getLegend(mod)" type="button">{{mod}}</v-btn>
              </th>
            </tr>
          </thead>
        </table>
      </template>
    </v-simple-table>
  </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import {
  Assignment,
  Task,
  Module,
  ModuleUtil,
  DateFunctions,
  Schedual
} from "@/models/models";

export default Vue.extend({
  name: "About",

  data: () => ({
    workDays: [],

    workDaysString: [],

    modules: [],

    assignments: []
  }),
  methods: {
    getLegend(module: Module) {
      return ModuleUtil.getLegend(module);
    }
  },
  created() {
    const schedual = localStorage.getItem("schedual");
    if (schedual != null) {
      this.workDays = JSON.parse(schedual).workDays;
      this.workDaysString = JSON.parse(schedual).workDaysString;
      this.modules = JSON.parse(schedual).modules;
      this.assignments = JSON.parse(schedual).testAssignment;
    }
  }
});
</script>



