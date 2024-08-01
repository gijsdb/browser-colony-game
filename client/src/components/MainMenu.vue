<template>
    <div class="w-screen h-screen bg-black text-white flex items-center justify-center">
        <div class="flex flex-col gap-y-8">
            <h1 class="text-3xl">Main menu</h1>
            <button @click="$emit('start-game')">New game</button>
        </div>
    </div>
</template>
