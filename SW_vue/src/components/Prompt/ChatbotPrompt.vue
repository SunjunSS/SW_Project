<template>
  <div class="prompt-container" ref="container">
    <div class="input-wrapper" ref="inputWrapper">
      <textarea
        ref="textarea"
        class="input-box"
        :placeholder="placeholder"
        v-model="inputValue"
        @input="adjustHeight"
        @keydown.enter.prevent="handleEnter"
        @compositionstart="isComposing = true"
        @compositionend="handleCompositionEnd"
        rows="1"
      ></textarea>
      <v-icon
        id="send-btn"
        icon="mdi-arrow-up-bold-circle"
        color="brown-darken-1"
        size="x-large"
        @click="sendInput"
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
  emits: ['update:modelValue', 'send-message'],
  data() {
    return {
      inputValue: this.modelValue,
      isComposing: false // IME 입력 상태 여부
    }
  },
  watch: {
    modelValue(newValue) {
      this.inputValue = newValue
    }
  },
  methods: {
    adjustHeight() {
      const textarea = this.$refs.textarea
      textarea.style.height = 'auto'
      const maxHeight = 150
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    },
    handleEnter(event) {
      if (this.isComposing) {
        // IME 입력 중이면 Enter를 무시
        return
      }
      if (!event.shiftKey) {
        this.sendInput()
      } else {
        this.inputValue += '\n'
        this.adjustHeight()
      }
    },
    handleCompositionEnd() {
      this.isComposing = false // IME 입력 종료
    },
    sendInput() {
      if (this.isComposing) {
        // IME 입력 중이면 API 요청 방지
        return
      }
      if (this.inputValue.trim()) {
        this.$emit('send-message', this.inputValue.trim())
        this.inputValue = ''
        this.adjustHeight()
      }
    }
  }
}
</script>

<style scoped>
.prompt-container {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  padding: 20px 0;
}

.input-wrapper {
  position: relative;
  width: 70%;
  transition: height 0.1s ease-in-out;
}

.input-box {
  border: 2px solid #cfcfcf;
  border-radius: 25px;
  padding: 0.75rem 3rem 0.75rem 1rem;
  width: 100%;
  min-height: 50px;
  max-height: 150px;
  resize: none;
  overflow-y: hidden;
  box-sizing: border-box;
  line-height: 1.3;
  white-space: pre-wrap;
}

.input-box::-webkit-scrollbar {
  display: none;
}

#send-btn {
  position: absolute;
  bottom: 9px;
  right: 12px;
}
</style>
