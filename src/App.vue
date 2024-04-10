<style scoped>
.schedule {
    display: grid;
    flex-direction: column;
    height: 100vh;
    grid-template-columns: 100px auto;
}

.schedule>div:not(.event) {
    min-height: max-content;
    border: solid 1px #000;
    border-top: none;
    border-left: none;
    position: relative;
}

.event {
    grid-column: 2;
    grid-row: 4 / span 2;
    border: solid 1px #f00;
    width: 50%;
    background-color: rgba(255, 0, 0, 0.6);
}

/* .schedule:nth-of-type(1) {
    border-top: solid 1px #000;
} */
</style>

<template>
    <RouterView></RouterView>

    <section>
        <div class="schedule">
            <div>

            </div>
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

const data = ref<number[]>([]);

for (let i = 0; i < 10; i++) {
    data.value.push(i);
}
</script>