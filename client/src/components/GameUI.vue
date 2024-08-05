<template>
  <div>
    <div class="absolute bottom-2 right-2">
      <div class="text-light-gray text-gray-400">
        <p>
          {{
            `x: ${tileInfo.tileX} y: ${tileInfo.tileY} type: ${tileInfo.type} layer: ${tileInfo.layer}`
          }}
        </p>
      </div>
    </div>

    <div class="absolute bottom-2 left-2 text-light-gray text-gray-400 flex gap-x-2 items-end">
      <div>
        <button @click="handleClick" class="border-2 border-gray-400 bg-[#181818] h-12 p-2">
          Build
        </button>
      </div>
      <div class="flex flex-col">
        <div class="bg-[#181818] text-center" v-if="showOrdersMenu">
          <ul>
            <li>
              <button @click="handleWoodcutClick" class="border-2 p-2">Woodcut</button>
            </li>
          </ul>
        </div>
        <button
          @click="handleShowOrdersMenu"
          class="border-2 border-gray-400 bg-[#181818] h-12 px-4"
        >
          Orders
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { eventBus } from '@/eventBus'

let tileInfo = ref({
  tileX: '',
  tileY: '',
  type: '',
  layer: ''
})

let showOrdersMenu = ref(false)

const handleShowOrdersMenu = () => {
  showOrdersMenu.value = !showOrdersMenu.value
}

const handleClick = () => {
  eventBus.value.emit('button-click', { message: 'Button clicked in Vue!' })
}

const handleWoodcutClick = () => {
  eventBus.value.emit('button-order-woodcut', null)
  showOrdersMenu.value = false
}

eventBus.value.on('hover-info', (data) => {
  tileInfo.value = data
})
</script>
