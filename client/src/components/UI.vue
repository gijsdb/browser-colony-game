<template>
    <div class="fixed h-screen ">
        <button
            @click="handleTest"
            class="absolute bottom-0 border-2 w-12 h-12"
        >Test</button>
    </div>
</template>

<script setup>
const handleTest = () => {
    console.log('beep')
}
</script>