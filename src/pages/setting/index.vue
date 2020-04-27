<template>
  <div class="container">
    <WXAuthorize @clickAuthorize="handleClick"/>
  </div>
</template>

<script>
import WXAuthorize from '@/components/wx-authorize'
import { mapGetters, mapState, mapMutations } from 'vuex'
import { UPDATE_USER_INFO } from '@/store/mutation-types'

export default {
  components: { WXAuthorize },
  created () {
    console.log('Setting: user profile', this.user)
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      user: state => state.setting.userInfo
    }),
    ...mapGetters('setting', {
      userInfo: 'userInfo',
    })
  },
  methods: {
    ...mapMutations([
      `setting/UPDATE_USER_INFO`
    ]),
    handleClick ({ user }) {
      console.log('GOT USER FROM AUTHORIZE', user)
      this[`setting/UPDATE_USER_INFO`](user)
      console.log(this.user)
    }
  }
}
</script>

<style scoped>
.message {
  color: red;
  padding: 10px;
  text-align: center;
}
</style>