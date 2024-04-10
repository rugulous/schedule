<style scoped>
section{
    --time-size: 50px;
    --row-size: 30px;
    overflow: hidden;
    max-height: 100vh;
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

header.schedule{
    --scrollbar-width: v-bind(scrollbar);
    grid-template-rows: 50px;
}

main{
    height: calc(100vh - 50px);
    overflow-y: scroll;
    position: relative;
}

.schedule > div:not(.event):not(:nth-child(6n + 1)):not(:nth-child(6n + 2)){
    display: none;
}

@media (min-width: 768px){
.schedule{
    --num-cols: 3;
}

.schedule > div:not(.event):nth-child(6n + 3),
.schedule > div:not(.event):nth-child(6n + 4) {
    display: block !important;
}
}

@media (min-width: 1200px){
    .schedule{
        --num-cols: 5;
    }

    .schedule > div:not(.event){
        display: block !important;
    }
}

.schedule>div:not(.event) {
    border: solid 1px #000;
    border-bottom: none;
    border-left: none;
    position: relative;
}

.schedule > div:not(.event):nth-child(12n+7),
.schedule > div:not(.event):nth-child(12n+8),
.schedule > div:not(.event):nth-child(12n+9),
.schedule > div:not(.event):nth-child(12n+10),
.schedule > div:not(.event):nth-child(12n+11),
.schedule > div:not(.event):nth-child(12n+12) {
    border-top: dashed 1px #CCC;
}

.schedule > div:not(.event):nth-child(12n+13),
.schedule > div:not(.event):nth-child(12n+14),
.schedule > div:not(.event):nth-child(12n+15),
.schedule > div:not(.event):nth-child(12n+16),
.schedule > div:not(.event):nth-child(12n+17),
.schedule > div:not(.event):nth-child(12n+18) {
    border-top: solid 1px #CCC;
}

.schedule > div:not(.event):nth-child(24n + 1),
.schedule > div:not(.event):nth-child(24n + 2),
.schedule > div:not(.event):nth-child(24n + 3),
.schedule > div:not(.event):nth-child(24n + 4),
.schedule > div:not(.event):nth-child(24n + 5),
.schedule > div:not(.event):nth-child(24n + 6) {
    border-top: solid 1px #000;
}

.event {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 2;
    grid-row: 4;
    border: solid 2px #000;
    background-color: rgba(255, 0, 0, 0.8);
    color: #FFF;
    min-height: var(--row-size);
    position: relative;
}

#now{
    z-index: 1;
    border-top: solid 2px #F00;
    position: absolute;
    left: var(--time-size);
    right: 0;
    top: v-bind(now);
}

#now::before{
    content: "";
    background: #F00;
    position: absolute;
    border-radius: 50%;
    height: 12px;
    width: 12px;
    margin-top: -6.5px;
    left: -7px;
}

.time {
    font-weight: bold;
}

.d-block{
    display: block;
}

.disabled{
    background-color: #666;
    border-top: none !important;
}
</style>

<template>
    <RouterView></RouterView>

    <section>
        <header class="schedule">
            <div></div>
            <div v-for="(date, index) in dates" :style="`grid-column: ${index + 2}`">
              <strong class="d-block">{{ date.toLocaleDateString() }}</strong>
              <i>{{ weekdays[date.getDay()] }}</i>
            </div>
        </header>
        <main>
        <div class="schedule">
            <template v-for="(time, i) in data" v-if="dates.length > 0">
                <div class="time" :style="'grid-area: ' + (i + 1) + '/ 1;'" v-html="i % 4 == 0 ? time : ''"></div>

                <div v-for="(_, index) in dates" :class="{disabled: inActiveHours(index, i)}" :style="`grid-area: ${i + 1} / ${index + 2};`">
                </div>
            </template>

            <div class="event" style="top: 15px">Hello I am event</div>
        </div>
        <div id="now"></div>
        </main>

    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const data = ref<string[]>([]);
const now = ref("0px");
const dates = ref<Date[]>([]);
const scrollbar = ref(getScrollBarWidth());

const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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
    startTime: 10,
    endTime: 22
},]

for (let i = 0; i < 24; i++) {
    data.value.push(i.toString().padStart(2, "0") + ":00");
    data.value.push(i.toString().padStart(2, "0") + ":15");
    data.value.push(i.toString().padStart(2, "0") + ":30");
    data.value.push(i.toString().padStart(2, "0") + ":45");
}

async function updateTicker(){
    const newDate = new Date();
    now.value = 50 + (((newDate.getHours() * 60) + newDate.getMinutes()) * 2) + "px";

    if(newDate.toLocaleDateString().split("T")[0] != date.toLocaleDateString().split("T")[0]){
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

function setDates(){
    date = new Date();
    const _dates = [date];

    for(let i = 1; i < 5; i++){
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + i);
        _dates.push(nextDate)
    }

    dates.value = _dates;
}

function inActiveHours(column: number, i: number){
    const d = dates.value[column].getDay();
    const hours = activeHours[d];

    return hours.startTime > i / 4 || hours.endTime <= i / 4
}

setDates();
updateTicker();

onMounted(() => {
    ticker = document.getElementById("now");

    ticker?.scrollIntoView({
        block: "center",
        behavior: "smooth"
    });

    setInterval(updateTicker, 60000);
});
</script>