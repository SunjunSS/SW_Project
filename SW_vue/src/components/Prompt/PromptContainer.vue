<template>
  <div class="prompt-container">
    <textarea
      id="input-box"
      class="input-box"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @keyup="$emit('keyup', $event)"
      cols="50"
    ></textarea>
    <v-icon
      id="search-btn"
      icon="mdi-arrow-up-bold-circle"
      color="brown-darken-1"
      size="x-large"
      @click="$emit('click')"
    ></v-icon>
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
  emits: ['update:modelValue', 'click', 'keyup'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
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
  padding-top: 20px;
  padding-bottom: 20px;
}
.input-box {
  border: 2px #cfcfcf solid;
  border-radius: 15px;
  padding: 0.75rem 1rem;
  width: 70%;
  height: 70%;
  resize: none;
  z-index: 1;
}
#search-btn {
  position: absolute;
  bottom: 75.9%;
  right: 15.3%;
  z-index: 2;
}
</style>
