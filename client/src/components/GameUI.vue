<template>
    <div class="fixed h-screen flex items-end">
        <div class=" text-light-gray text-gray-400 flex gap-x-1">
            <button
                @click="handleClick"
                class="border-2 border-gray-400 bg-[#181818] h-12 p-2"
            >Architect</button>
            <button class="
                border-2
                border-gray-400
                bg-[#181818]
                h-12
                p-2">Main menu</button>
        </div>
    </div>
</template>

<script setup>
import { eventBus } from '@/eventBus';


const handleClick = () => {
    eventBus.value.emit('button-click', { message: 'Button clicked in Vue!' });
};

eventBus.value.on('update-ui', (data) => {
    console.log('Update UI event received:', data);
});
</script>
