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
        @keydown="handleKeydown"
        cols="50"
        rows="1"
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
  emits: ['update:modelValue', 'click', 'keyup'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)

      const textarea = event.target
      const baseHeight = 50 // 기본 높이 (1줄)

      // 임시로 높이를 auto로 설정하여 실제 내용 높이 계산
      textarea.style.height = 'auto'

      // 줄 수 계산 (개행 문자 + 내용 길이에 따른 자동 줄바꿈)
      const newLines = (textarea.value.match(/\n/g)?.length || 0) + 1
      const contentLines = Math.ceil(textarea.scrollHeight / baseHeight)
      const lines = Math.min(Math.max(newLines, contentLines), 3)

      // 높이를 줄 수에 맞게 설정
      textarea.style.height = `${baseHeight * lines}px`
    },
    handleClick() {
      this.$emit('click')
    },
    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        if (this.modelValue.trim()) {
          this.$emit('click')
        }
      }
    }
  }
}
</script>

<style scoped>
.prompt-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  height: auto;
}

.input-wrapper {
  position: relative;
  width: 70%;
  min-height: 50px;
}

.input-box {
  position: absolute;
  bottom: 0;
  border: 2px #cfcfcf solid;
  border-radius: 25px;
  padding: 0.75rem 3rem 0.75rem 1rem;
  width: 100%;
  height: 50px;
  min-height: 50px;
  max-height: 150px;
  resize: none;
  overflow-y: auto;
  box-sizing: border-box;
  line-height: 1.3;
  transition: height 0.1s ease-in-out; /* 부드러운 높이 변화 애니메이션 */
  word-wrap: break-word; /* 긴 단어 자동 줄바꿈 */
  white-space: pre-wrap; /* 공백과 줄바꿈 유지 */
}

.input-box::-webkit-scrollbar {
  display: none;
}

#search-btn {
  position: absolute;
  bottom: 9px;
  right: 12px;
  z-index: 1;
}
</style>
