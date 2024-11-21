<template>
  <div class="prompt-container">
    <div class="input-wrapper">
      <textarea
        id="input-box"
        class="input-box"
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @keydown.enter.prevent="handleKeydown"
        cols="50"
      ></textarea>
      <v-icon
        id="search-btn"
        icon="mdi-arrow-up-bold-circle"
        color="brown-darken-1"
        size="x-large"
        @click="handleClick"
      ></v-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '메시지를 입력해주세요.'
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'click', 'keyup', 'submit'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
    handleClick() {
      if (this.modelValue.trim()) {
        this.$emit('submit', this.modelValue)
      }
    },
    handleKeydown(event) {
      if (!event.shiftKey) {
        if (this.modelValue.trim()) {
          this.$emit('submit', this.modelValue)
        }
      }
    }
  }
}
</script>

<style scoped>
.prompt-container {
  width: 100%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.input-wrapper {
  position: relative;
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-box {
  border: 2px #cfcfcf solid;
  border-radius: 15px;
  padding: 0.75rem 3rem 0.75rem 1rem;
  width: 100%;
  height: 70%;
  resize: none;
}

#search-btn {
  position: absolute;
  bottom: 24px;
  right: 10px;
  transform: translateY(-50%);
  z-index: 2;
  cursor: pointer;
}
</style>
