<template>
    <div>
        <div class="absolute bottom-2 right-2">
            <div class="text-light-gray text-gray-400">
                <p>{{ `x: ${tileInfo.tileX} y: ${tileInfo.tileY} type: ${tileInfo.type} layer: ${tileInfo.layer}` }}</p>
            </div>
        </div>
        <div class="absolute bottom-2 left-2 text-light-gray text-gray-400 flex gap-x-2 ">
            <button
                @click="handleClick"
                class="border-2 border-gray-400 bg-[#181818] h-12 p-2"
            >Architect</button>
            <button
                @click="handleClick"
                class="
                border-2
                border-gray-400
                bg-[#181818]
                h-12
                p-2"
            >Orders</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { eventBus } from '@/eventBus';

let tileInfo = ref({
    tileX: '',
    tileY: '',
    type: '',
    layer: ''
})

const handleClick = () => {
    eventBus.value.emit('button-click', { message: 'Button clicked in Vue!' });
};

eventBus.value.on('hover-info', (data) => {
    tileInfo.value = data
});
</script>
