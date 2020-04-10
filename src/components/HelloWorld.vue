<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-date-picker v-model="datesPicked" class="mt-4" full-width range></v-date-picker>
      </v-col>
      <v-col cols="12" md="6">
        <v-row justify="center">
          <v-col cols="12">
            <v-textarea filled name="input-7-1" label="Add csv devs/testers" v-model="employees"></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-textarea filled name="input-7-1" label="Add csv issues" v-model="issues"></v-textarea>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-card flat class="py-12">
      <v-card-text>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <h2 class="text-center">Add Assignment</h2>
          </v-col>
          <v-combobox required v-model="model.name" :items="employeesCsv" label="User" chips></v-combobox>
          <v-combobox required v-model="model.taskId" :items="issuesCsv" label="Issue" chips></v-combobox>
          <v-combobox required v-model="model.startDay" :items="workDays" label="Start Date" chips></v-combobox>
          <v-combobox v-model="model.endDay" :items="workDays" label="End Date" chips></v-combobox>
          <v-combobox required v-model="model.module" :items="modules" label="Module" chips></v-combobox>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="addAssignment()" :disabled="isComplete" large>Add Assignment</v-btn>
        <v-btn @click="clearModel()" large>Clear Choices</v-btn>
        <v-btn @click="clearTable()" large>Clear Table</v-btn>
        <!-- :disabled="!isComplete"  -->
      </v-card-actions>
    </v-card>

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
              <td v-for="(task, index2) in assignment.schedualMap.values()" :key="index2">
                <v-btn small :color="getLegend(task.module)" type="button">{{task.taskId}}</v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </v-simple-table>
    <br />
    <v-btn @click="generateSchedual()" large>Generate Schedual</v-btn>

    <br />
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
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import router from "../router";
import {
  Assignment,
  Task,
  Module,
  ModuleUtil,
  DateFunctions,
  Schedual,
  TestAssignment,
  AssignmentPersist
} from "@/models/models";

@Component
export default class HelloWorld extends Vue {
  private datesPicked: string[] = [];

  private employees: string = "";

  private issues: string = "";

  private modules = ModuleUtil.getModuleValues();

  private model = {
    name: "",
    taskId: "",
    module: "",
    startDay: "",
    endDay: ""
  };

  private assignments: Array<Assignment> = [];

  addAssignment() {
    let model = this.model;

    let newTask = new Task(
      model.taskId,
      ModuleUtil.valueOf(model.module),
      model.startDay,
      model.endDay
    );
    let newAssignment = new Assignment(model.name, [newTask]);
    let exists = this.assignments.find(assignment => {
      return newAssignment.name === assignment.name ? true : false;
    });
    if (exists) {
      this.assignments = this.assignments.map(currentAssignment => {
        if (currentAssignment.name === newAssignment.name) {
          currentAssignment.addTask(newTask);
        }
        return currentAssignment;
      });
    } else {
      this.workDays.forEach(date => {
        newAssignment.schedualMap.set(
          date,
          new Task(
            Module.Support.toString(),
            Module.Support,
            this.datesPicked[0],
            this.datesPicked[1]
          )
        );
      });
      newAssignment.syncSchedualAndTasks();
      this.assignments.push(newAssignment);
    }
  }

  get workDaysString(): Array<string> {
    var weekdaysString: Array<string> = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ];
    var result: Array<string> = [];
    if (this.workDays) {
      let count = 0;
      for (let i = 0; i < this.workDays.length; i++) {
        if (count === weekdaysString.length) {
          count = 0;
        }
        result.push(weekdaysString[count]);
        count++;
      }
    }
    return result;
  }
  get workDays(): Array<string> {
    let workDays = new Array<string>();
    if (this.datesPicked.length > 1) {
      workDays = DateFunctions.getWeekdays(
        this.datesPicked[0],
        this.datesPicked[1]
      );
    }
    return workDays;
  }

  clearTable(): void {
    this.assignments = [];
    this.datesPicked = [];
  }

  clearModel(): void {
    this.model = {
      name: "",
      taskId: "",
      module: "",
      startDay: "",
      endDay: ""
    };
  }

  getLegend(module: Module) {
    return ModuleUtil.getLegend(module);
  }

  splitAndUnshift(csv: string, ...others: any) {
    var values = csv.split(",").sort();
    for (let val of others) {
      values.push(val);
    }
    return values;
  }

  get employeesCsv(): Array<string> {
    return this.splitAndUnshift(this.employees, "None");
  }
  get issuesCsv(): Array<string> {
    return this.splitAndUnshift(this.issues, "Vacation", "Support", "None");
  }

  get isComplete(): boolean {
    let name = this.model.name;
    let taskId = this.model.taskId;
    let moduleX = this.model.module;
    let startDay = this.model.startDay;
    let endDay = this.model.endDay;
    if (name && taskId && moduleX && startDay && endDay) {
      return false;
    }
    return true;
  }

  generateSchedual() {
    let testAssignments = new Array<TestAssignment>();
    this.assignments.forEach(assignment => {
      let taskArray = new Array<Task>();
      assignment.schedualMap.forEach(task => {
        taskArray.push(task);
      });
      testAssignments.push(new TestAssignment(assignment.name, taskArray));
    });
    let schedual = new Schedual(
      this.workDays,
      this.workDaysString,
      this.modules,
      testAssignments
    );
    localStorage.setItem("schedual", JSON.stringify(schedual));
    router.push("about");
  }

  @Watch("assignments")
  assignmentsChanged() {
    let assignmentPersist = new Array<AssignmentPersist>();
    this.assignments.forEach(assignment => {
      assignmentPersist.push(
        new AssignmentPersist(
          assignment.name,
          JSON.stringify(Array.from(assignment.schedualMap)),
          assignment.tasks
        )
      );
    });
    localStorage.setItem(
      "assignmentPersist",
      JSON.stringify(assignmentPersist)
    );
  }

  @Watch("datesPicked")
  datesPickedChanged() {
    localStorage.setItem("datesPicked", JSON.stringify(this.datesPicked));
  }

  @Watch("employees")
  employeesChanged() {
    localStorage.setItem("employees", JSON.stringify(this.employees));
  }

  @Watch("issues")
  issuesChanged() {
    localStorage.setItem("issues", JSON.stringify(this.issues));
  }

  created() {
    const datesPicked = localStorage.getItem("datesPicked");
    const workDaysString = localStorage.getItem("workDaysString");
    const employees = localStorage.getItem("employees");
    const issues = localStorage.getItem("issues");
    const assignmentPersist = localStorage.getItem("assignmentPersist");
    if (datesPicked != null) {
      this.datesPicked = JSON.parse(datesPicked);
    }
    if (employees != null) {
      this.employees = JSON.parse(employees);
    }
    if (issues != null) {
      this.issues = JSON.parse(issues);
    }
    if (assignmentPersist != null) {
      this.assignments = JSON.parse(assignmentPersist).map(
        (assignment: AssignmentPersist) => {
          let newAssignment = new Assignment(assignment.name, []);
          newAssignment.schedualMap = new Map(
            JSON.parse(assignment.schedualMapString)
          );
          newAssignment.syncSchedualAndTasks();
          return newAssignment;
        }
      );
    }
  }
}
</script>

// // 1. Explicitly declare the type
// var arr: Criminal[] = [];

// // 2. Via type assertion
// var arr = <Criminal[]>[];
// var arr = [] as Criminal[];

// // 3. Using the Array constructor
// var arr = new Array<Criminal>();