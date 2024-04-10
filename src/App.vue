<style scoped>
.schedule {
    display: grid;
    grid-template-columns: 50px auto;
    grid-auto-rows: 2rem;
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
    grid-row: 4 / span 2;
    border: solid 1px #f00;
    background-color: rgba(255, 0, 0, 0.6);
}

.event.clash{
    width: 50%;
}
</style>

<template>
    <RouterView></RouterView>

    <section>
        <div class="schedule">
            <div></div>
            <div>
                Monday
            </div>
            <div>
                Tuesday
            </div>
            <div>
                Wednesday
            </div>
            <div>
                Thursday
            </div>
            <div>
                Friday
            </div>

            <template v-for="(time, i) in data">
                <div class="time" :style="'grid-area: ' + (i + 2) + '/ 1;'">{{ time }}</div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 2;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 3;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 4;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 5;'"></div>
                <div class="rowspace" :style="'grid-area: ' + (i + 2) + '/ 6;'"></div>
            </template>

            <div class="event">Hello I am event</div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const data = ref<string[]>([]);

for (let i = 0; i < 24; i++) {
    data.value.push(i.toString().padStart(2, "0") + ":00");
    data.value.push(i.toString().padStart(2, "0") + ":30");
}
</script>