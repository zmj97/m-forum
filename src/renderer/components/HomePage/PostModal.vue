<template>
  <!-- 帖子弹窗 -->
  <div class="opacityBackground">
    <post-part class="post" v-if="posts[posCurrent]" :postData="posts[posCurrent]"></post-part>

    <Icon class="button close" type="md-close-circle" @click="closeModal" />

    <Icon v-show="posCurrent!==0" @click="posCurrent--" class="button left" type="md-arrow-dropleft-circle" />

    <Icon v-show="posCurrent!==posts.length-1" @click="posCurrent++" class="button right" type="md-arrow-dropright-circle" />
  </div>
</template>

<script>
import PostPart from './HomePanel/PostPart'

export default {

  name: 'PostModal',

  components: {
    PostPart
  },

  props: ['posts', 'pos'],

  data () {
    return {
      posCurrent: this.pos
    }
  },

  watch: {
    pos () {
      this.posCurrent = this.pos
    }
  },

  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="css" scoped>
.opacityBackground {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.post {
  position: relative;
  top: 2%;
  left: 10%;
  width: 80%;
  min-width: 500px;
  height: 95%;
  border-radius: 6px;
  box-shadow: 0 0 1px white;
  background-color: white;
  overflow: auto;
}

.button {
  font-size: 3rem;
  color: #17233d;
  opacity: 0.2;
  transition: opacity 0.1s linear;
  cursor: pointer;
}
.button:hover {
  opacity: 0.7;
}

.close {
  position: fixed;
  top: 2%;
  right: 3%;
}

.left {
  position: fixed;
  top: 50%;
  margin-top: -1.5rem;
  left: 3%;
}

.right {
  position: fixed;
  top: 50%;
  margin-top: -1.5rem;
  right: 3%;
}
</style>