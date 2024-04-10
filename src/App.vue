<style scoped>
section{
    --time-size: 50px;
    --row-size: 30px;
}

.schedule {
    display: grid;
    grid-template-columns: var(--time-size) auto;
    grid-template-rows: 50px;
    grid-auto-rows: var(--row-size);
    text-align: center;
}

.schedule > div:not(.event):not(:nth-child(6n + 1)):not(:nth-child(6n + 2)){
    display: none;
}

@media (min-width: 768px){
.schedule > div:not(.event):nth-child(6n + 3),
.schedule > div:not(.event):nth-child(6n + 4) {
    display: block !important;
}
}

@media (min-width: 1200px){
    .schedule > div{
        display: block !important;
    }
}

.schedule>div:not(.event) {
    border: solid 1px #000;
    border-top: none;
    border-left: none;
    position: relative;
}

.schedule > div:not(.event):nth-child(12n+7),
.schedule > div:not(.event):nth-child(12n+8),
.schedule > div:not(.event):nth-child(12n+9),
.schedule > div:not(.event):nth-child(12n+10),
.schedule > div:not(.event):nth-child(12n+11),
.schedule > div:not(.event):nth-child(12n+12) {
    border-bottom: dashed 1px #222;
}

.event {
    grid-column: 2;
    grid-row: 4;
    border: solid 1px #f00;
    background-color: rgba(255, 0, 0, 0.6);
    min-height: var(--row-size);
}

.event.clash{
    width: 50%;
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
</style>

<template>
    <RouterView></RouterView>

    <section>
        <div class="schedule">
            <div></div>
            <div class="time">
                Monday
            </div>
            <div class="time">
                Tuesday
            </div>
            <div class="time">
                Wednesday
            </div>
            <div class="time">
                Thursday
            </div>
            <div class="time">
                Friday
            </div>

            <template v-for="(time, i) in data">
                <div class="time" :style="'grid-area: ' + (i + 2) + '/ 1;'" v-html="i % 2 == 0 ? time : ''"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 2;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 3;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 4;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 5;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 6;'"></div>
            </template>

            <div class="event">Hello I am event</div>
        </div>
        <div id="now"></div>

    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const data = ref<string[]>([]);

for (let i = 0; i < 24; i++) {
    data.value.push(i.toString().padStart(2, "0") + ":00");
    data.value.push(i.toString().padStart(2, "0") + ":30");
}

const date = new Date();
const now = ref("0px");

const timeout = (delayMs: number) => new Promise((res, _rej) => setTimeout(res, delayMs));

(async () => {
    while(true) {
        now.value = 50 + (date.getHours() * 60) + date.getMinutes() + "px";
        await timeout(60000);
    }
})();

onMounted(() => {
    const ticker = document.getElementById("now");
    ticker?.scrollIntoView({
        block: "center",
        behavior: "smooth"
    });
});
</script>