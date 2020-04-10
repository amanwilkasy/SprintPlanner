let moment = require('moment');
moment.suppressDeprecationWarnings = true;

export class Task {
    taskId: string;
    module: Module;
    startDay: string;
    endDay: string;
    workDays: string[] = new Array();

    constructor(taskId: string, module: Module, startDay: string, endDay: string) {
        this.taskId = taskId;
        this.module = module;
        this.startDay = startDay;
        this.endDay = endDay;
        this.workDays = DateFunctions.getWeekdays(startDay, endDay);
    }

}

export class Schedual {
    workDays: Array<string> = [];
    workDaysString: Array<string> = [];
    modules: Array<string> = [];
    testAssignment: Array<TestAssignment> = [];
    constructor(workDays: string[], workDaysString: string[], modules: string[], testAssignment: TestAssignment[]) {
        this.workDays = workDays;
        this.workDaysString = workDaysString;
        this.modules = modules;
        this.testAssignment = testAssignment;
    }
}

export class Assignment {
    name: string;
    schedualMap = new Map<string, Task>();
    tasks: Array<Task> = [];
    constructor(name: string, tasks: Task[]) {
        this.name = name;
        this.tasks = tasks;
    }

    syncSchedualAndTasks() {
        this.tasks.forEach(task => {
            task.workDays.forEach(workDay => {
                if (this.schedualMap.has(workDay)) {
                    this.schedualMap.set(workDay, task);
                }
            })
        })
    }

    addTask(task: Task) {
        this.tasks.push(task);
        this.syncSchedualAndTasks();
        this.tasks = [];
    }
    addTasks(tasksArray: Task[]) {
        tasksArray.forEach(task => {
            this.tasks.push(task);
        })
        this.syncSchedualAndTasks();
        this.tasks = [];
    }
}

export class TestAssignment {
    name: string;
    tasks: Array<Task> = [];
    constructor(name: string, tasks: Task[]) {
        this.name = name;
        this.tasks = tasks;
    }
}

export class AssignmentPersist {
    name: string;
    schedualMapString: string;;
    tasks: Array<Task> = [];
    constructor(name: string, schedualMapString: string, tasks: Task[]) {
        this.name = name;
        this.schedualMapString = schedualMapString;
        this.tasks = tasks;
    }
}

export class DateFunctions {

    public static getDateRange(startDay: string, endDay: string): Set<string> {
        let dates: Array<string> = [];
        //to avoid modifying the original date
        const theDate = new Date(startDay);
        while (theDate < new Date(endDay)) {
            dates = [...dates,
            moment.utc(new Date(theDate)).format("YYYY-MM-DD")];
            theDate.setDate(theDate.getDate() + 1);


        }
        dates = [...dates, moment.utc(new Date(endDay), 'YYYY-MM-DD')];
        return new Set(dates);
    }

    public static getWeekdays(startDay: string, endDay: string) {
        var weekdays: Array<string> = [];
        var dates = DateFunctions.getDateRange(startDay, endDay);
        dates.forEach(date => {
            if (!DateFunctions.isWeekend(date)) {
                weekdays.push(moment.utc(date).format("YYYY-MM-DD"));

            }
        });
        return weekdays;
    }

    public static isWeekend(date: string) {
        return new Date(date).getUTCDay() === 0 || new Date(date).getUTCDay() === 6 ? 1 : 0;
    }

}

export enum Module {
    Interfaces = "Interfaces",
    IO = "IO",
    BEC = "BEC",
    Issuance = "Issuance",
    DA = "DA",
    Vacation = "Vacation",
    Support = "Support",
    None = "None"
}

export namespace ModuleUtil {
    export function getModuleValues() {
        // return Object.keys(Module).filter(k => typeof Module[k as any] === "number"); // ["A", "B"]
        return Object.keys(Module).sort();
    }
    export function valueOf(module: string) {
        return (<any>Module)[module]

    }

    export function getLegend(module: Module) {
        let color;
        switch (module) {
            case "Interfaces":
                color = "red";
                break;
            case "IO":
                color = "blue";
                break;
            case "BEC":
                color = "cyan";
                break;
            case "Issuance":
                color = "teal";
                break;
            case "DA":
                color = "green";
                break;
            case "Support":
                color = "orange";
                break;
            case "Vacation":
                color = "yellow";
                break;
            case "None":
                color = "white";
                break;
            default:
                color = "grey";
        }
        return color;
    }

}


