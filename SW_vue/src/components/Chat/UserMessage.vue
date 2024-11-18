<template>
  <div class="user-message">
    <div class="message-text">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import '@/styles/UserMessage.css'
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>
