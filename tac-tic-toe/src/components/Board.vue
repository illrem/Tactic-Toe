<template>
  <div class="game">
    <div
      v-for="bigIndex in 9"
      :key="bigIndex"
      :id="'square_' + (bigIndex - 1)"
      class="square"
      :class="{ occupied: !allowed[bigIndex - 1], canMove: allowed[bigIndex - 1] && canMove }"
    >
      <div class="miniBoard">
        <div
          v-for="index in 9"
          :key="index"
          :id="'square_' + (index - 1)"
          class="miniSquare"
          :class="{
            occupied: occupied[bigIndex - 1][index - 1],
            lastMove: lastMove[bigIndex - 1][index - 1],
            impossible: impossible[bigIndex - 1][index - 1]
          }"
          @click="$emit('move', bigIndex - 1, index - 1)"
        >{{ board[bigIndex - 1][index - 1] }}</div>
      </div>
      <div class="bigBoard squareOverlay">{{ board[9][bigIndex - 1] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoardGrid',
  emits: ['move'],
  props: {
    board: { type: Array, required: true },
    occupied: { type: Array, required: true },
    impossible: { type: Array, required: true },
    lastMove: { type: Array, required: true },
    allowed: { type: Array, required: true },
    canMove: { type: Boolean, default: true }
  }
}
</script>
