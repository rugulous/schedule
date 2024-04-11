<style scoped>
section {
    --time-size: 50px;
    --row-size: 60px;
    overflow: hidden;
    max-height: 100dvh;
}

.schedule {
    --num-cols: 1;
    --scrollbar-width: 0px;
    --column-size: calc((100% - var(--time-size) - var(--scrollbar-width)) / var(--num-cols));
    display: grid;
    grid-template-columns: var(--time-size) repeat(5, var(--column-size));
    grid-auto-rows: var(--row-size);
    text-align: center;
    scrollbar-gutter: stable;
}

header.schedule {
    --scrollbar-width: 0px;
    grid-template-rows: 50px;
    border-bottom: solid 1px #000;
}

main {
    height: calc(100dvh - 50px);
    overflow-y: scroll;
    position: relative;
}

@media (min-width: 768px) {
    .schedule {
        --num-cols: 3;
    }
}

@media (min-width: 1200px) {
    .schedule {
        --num-cols: 5;
    }

    header.schedule {
        --scrollbar-width: v-bind(scrollbar);
    }
}

.schedule>div:not(.event):not(.time) {
    border: solid 1px #000;
    border-top: none;
    border-right: none;
    position: relative;
}

.event {
    flex-direction: column;
    min-height: var(--row-size);
    position: relative;
}

.title {
    font-size: 1.5rem;
}

#now {
    z-index: 1;
    border-top: solid 2px #F00;
    position: absolute;
    left: var(--time-size);
    right: 0;
    top: v-bind(now);
}

#now::before {
    content: "";
    background: #F00;
    position: absolute;
    border-radius: 50%;
    height: 12px;
    width: 12px;
    margin-top: -6.5px;
    left: -7px;
}

.time, .event {
    display: flex;
    align-items: center;
    justify-content: center;
}

.time {
    font-weight: bold;
}
</style>

<template>
    <section>
        <header class="schedule">
            <div class="time"></div>
            <div v-for="index in numCols" :style="`grid-column: ${index + 1}`">
                <p class="m0"><strong>{{ dates[index - 1].toLocaleDateString() }}</strong></p>
                <i>{{ weekdays[dates[index - 1].getDay()] }}</i>
            </div>
        </header>
        <main>
            <div class="schedule">
                <template v-for="(time, i) in data" v-if="dates.length > 0">
                    <div class="time" :style="'grid-area: ' + (i + 1) + '/ 1;'">{{ time }}</div>

                    <div v-for="index in numCols" :style="`grid-area: ${i + 1} / ${index + 1};`">
                    </div>
                </template>

                <template v-for="(day, dayIndex) in events">
                    <div class="event" :class="`event-${event.type}`" v-for="event in day" :style="`height: ${event.duration}px; grid-area: ${1 + Math.floor(event.start)} / ${dayIndex + 2}`">
                        <p class="title m0">{{ event.title }}</p>
                        <p class="m0" v-if="event.duration >= 30">{{ event.location }}</p>
                    </div>
                </template>
            </div>
            <div id="now"></div>
        </main>

    </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

const data = ref<string[]>([]);
const now = ref("0px");
const dates = ref<Date[]>([]);
const scrollbar = ref(getScrollBarWidth());
const numCols = ref(1);

const rawEvents = reactive([[{
    title: "Work",
    location: "Circle Leasing",
    type: "d19d7643-40d4-4219-89a2-0a3a28cb6023",
    start: 9,
    duration: 480
}], [{
    title: "Work",
    location: "Circle Leasing",
    type: "d19d7643-40d4-4219-89a2-0a3a28cb6023",
    start: 9,
    duration: 480
}, {
    title: "Travel to Bradford",
    location: "Bradford",
    type: "d5686f00-5711-472a-9dc8-5e9d46597696",
    start: 17,
    duration: 90
}], [{
    title: "Work",
    location: "Circle Leasing",
    type: "d19d7643-40d4-4219-89a2-0a3a28cb6023",
    start: 9,
    duration: 480
}, {
    title: "Revolution",
    type: "f3d817bf-7dac-4981-b5c2-19c6fc334263",
    location: "HQ",
    start: 19.5,
    duration: 120
}, {
    title: "Travel to Home",
    location: "Home",
    type: "d5686f00-5711-472a-9dc8-5e9d46597696",
    start: 22,
    duration: 60
}], [{
    title: "Birthday Meal",
    type: "e2459424-91d5-47cb-875a-d3e33c096ab5",
    location: "Fazenda",
    start: 17,
    duration: 105
}], []]);

const events = computed(() => rawEvents.slice(0, numCols.value));

const eventTypes = {
    "f3d817bf-7dac-4981-b5c2-19c6fc334263": {
        background: "rgba(131, 158, 0, 0.8)",
        colour: "#FFF"
    },
    "d19d7643-40d4-4219-89a2-0a3a28cb6023": {
        background: "rgba(0, 0, 0, 0.8)",
        colour: "#FFF"
    },
    "e2459424-91d5-47cb-875a-d3e33c096ab5": {
        background: "rgba(142, 246, 228, 0.8)",
        colour: "#000"
    },
    "d5686f00-5711-472a-9dc8-5e9d46597696": {
        background: "repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px);",
        colour: "#FFF"
    },
    "e77e1c5f-4a72-483a-922f-1d40fe819ea1": {
        background: "rgba(102, 102, 102, 0.8)",
        colour: "#FFF"
    }
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let ticker: HTMLElement | null = null;
let date = new Date();
const activeHours = [{ //Sunday
    startTime: 10,
    endTime: 22
}, { //Monday
    startTime: 8,
    endTime: 22
}, { //Tuesday
    startTime: 8,
    endTime: 22
}, { //Wednesday
    startTime: 8,
    endTime: 22
}, { //Thursday
    startTime: 8,
    endTime: 22
}, { //Friday
    startTime: 8,
    endTime: 22
}, { //Saturday
    startTime: 9.5,
    endTime: 22
},]

for (let i = 0; i < 24; i++) {
    data.value.push(i.toString().padStart(2, "0") + ":00");
}

async function updateTicker() {
    const newDate = new Date();
    now.value = ((newDate.getHours() * 60) + newDate.getMinutes()) + "px";

    if (newDate.toLocaleDateString().split("T")[0] != date.toLocaleDateString().split("T")[0]) {
        setDates();
    }
}

function getScrollBarWidth() {
    let el = document.createElement("div");
    el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
    document.body.appendChild(el);
    let width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width + "px";
}

function setDates() {
    date = new Date();
    const _dates = [date];

    for (let i = 1; i < 5; i++) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + i);
        _dates.push(nextDate)
    }

    dates.value = _dates;

    dates.value.forEach((day, index) => {
        const hours = activeHours[day.getDay()];
        rawEvents[index].unshift({
            title: "Inactive Hours",
            location: "",
            type: "e77e1c5f-4a72-483a-922f-1d40fe819ea1",
            start: 0,
            duration: hours.startTime * 60
        });

        rawEvents[index].unshift({
            title: "Inactive Hours",
            location: "",
            type: "e77e1c5f-4a72-483a-922f-1d40fe819ea1",
            start: hours.endTime,
            duration: (24 - hours.endTime) * 60
        });
    });
}

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets = [sheet];

function setDynamicStyles() {
    sheet.replaceSync("");
    Object.keys(eventTypes).forEach(id => {
        const type = eventTypes[id as keyof typeof eventTypes];
        sheet.insertRule(`.event-${id} { color: ${type.colour}; background: ${type.background} }`);
    })
}

function getCols() {
    const schedule = document.querySelector(".schedule");
    if (!schedule) {
        return 1;
    }

    return parseInt(getComputedStyle(schedule).getPropertyValue("--num-cols"));
}

setDynamicStyles();
setDates();
updateTicker();

onMounted(() => {
    numCols.value = getCols();
    ticker = document.getElementById("now");

    ticker?.scrollIntoView({
        block: "center",
        behavior: "smooth"
    });

    setInterval(updateTicker, 60000);
});

window.addEventListener("resize", () => numCols.value = getCols());
</script>