<template>
  <v-container v-if="getPost" class="mt-3">
    <v-card class="mt-5 rounded-xl">
      <v-row>
        <v-col xs="6" md="6" offset="xs-3">
          <!-- img tooltip -->
          <v-tooltip bottom>
            <span>Click to enlarge the image</span>
            <template v-slot:activator="{ on, attrs }">
              <v-img
                :src="getPost.imgUrl"
                v-bind="attrs"
                v-on="on"
                height="100%"
                @click="toggleImgaeDialog"
                class="rounded-xl mx-3"
              ></v-img>
            </template>
          </v-tooltip>

          <!-- img dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imgUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col xs="6" md="6" offset="xs-3">
          <v-row
            justify="space-between"
            class="px-5 operator-wrapper text-center"
          >
            <div class="operators">
              <v-icon @click="downloadImage">mdi-download</v-icon>
              <v-icon class="ml-2">mdi-share</v-icon>
            </div>
            <v-icon
              :color="checkIfLikedPost(post_id) ? 'red' : 'grey'"
              v-if="currentUser"
              @click="handleLikeToggle"
              >mdi-heart</v-icon
            >
          </v-row>
          <div class="flex-container">
            <h1 class="text-center">{{ getPost.title }}</h1>
            <p>{{ getPost.description }}</p>
            <h2 class="comments-section-title">
              <span>{{ getPost.messages.length }} </span>Comments
            </h2>
            <!-- display post messages  -->
            <div
              class="message-wrapper"
              v-for="message in getPost.messages"
              :key="message.id"
            >
              <div class="message-user-image">
                <v-avatar size="36">
                  <v-img :src="message.messageUser.avatar"></v-img>
                </v-avatar>
              </div>
              <div class="message-content-box">
                <div class="message-info">
                  <h2 class="message-user-name">
                    {{ message.messageUser.username }}
                  </h2>
                  <p class="message-time">
                    {{ getTimeFromNow(message.messageDate) }}
                  </p>
                </div>
                <div class="message-content">
                  <span>
                    {{ message.messageBody }}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="message-input-wrapper d-flex align-center mt-2"
              v-if="currentUser"
            >
              <v-form
                @submit.prevent="handleAddPosrMessage"
                ref="form"
                lazy-validation
                v-model="isFormValidated"
              >
                <v-text-field
                  clearable
                  :append-outer-icon="messageBody && 'mdi-send'"
                  label="Leave a comment..."
                  @click:append-outer="handleAddPosrMessage"
                  v-model="messageBody"
                  :rules="addPostMessageRules"
                  maxlength="60"
                  counter
                  rounded
                  height="48"
                  outlined
                  prepend-icon="mdi-message-outline"
                  full-width
                ></v-text-field>
              </v-form>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST,
} from '../../queries'
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default {
  name: 'Post',
  props: ['post_id'],
  data() {
    return {
      dialog: false,
      messageBody: '',
      hasLiked: false,
      isFormValidated: true,
      addPostMessageRules: [
        (value) =>
          value.length < 60 || 'Message must be less than 60 characters',
      ],
      timetest: dayjs(1600144720741).fromNow(),
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          post_id: this.post_id,
        }
      },
    },
  },
  methods: {
    goToPrevPage() {
      this.$router.go(-1)
    },
    async downloadImage(){
      try {
        const response = await this.axios({
          url: this.getPost.imgUrl,
          method: 'GET',
          responseType:'blob'
        })
        const fileUrl = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileUrl
        fileLink.setAttribute('download','image.jpg')
        document.body.appendChild(fileLink)
        fileLink.click()
      } catch (error) {
        console.log(error)
      }
    },
    toggleImgaeDialog() {
      if (window.innerWidth > 500) this.dialog = !this.dialog
    },
    checkIfOwnMessage(message) {
      if (!this.currentUser) return
      return message.messageUser._id === this.currentUser._id
    },
    checkIfLikedPost(post_id) {
      if (
        this.userFavorites &&
        this.userFavorites.some((post) => post._id === post_id)
      ) {
        return (this.hasLiked = true)
      }
      return (this.hasLiked = false)
    },
    handleLikeToggle() {
      return this.hasLiked ? this.handleUnLikePost() : this.handleLikePost()
    },
    handleLikePost() {
      const { post_id, messageBody, currentUser } = this
      const variables = {
        post_id,
        username: currentUser.username,
      }
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: {
                post_id: this.post_id,
              },
            })
            data.getPost.likes += 1
            cache.writeQuery({
              query: GET_POST,
              variables: {
                post_id: this.post_id,
              },
              data,
            })
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...currentUser,
            favorites: data.likePost.favorites,
          }
          this.$store.commit('SET_CURRENT_USER', updatedUser)
        })
        .catch((err) => console.log(err))
    },
    handleUnLikePost() {
      const { post_id, messageBody, currentUser } = this
      const variables = {
        post_id,
        username: currentUser.username,
      }
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          update: (cache, { data: { unLikePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: {
                post_id: this.post_id,
              },
            })
            data.getPost.likes -= 1
            cache.writeQuery({
              query: GET_POST,
              variables: {
                post_id: this.post_id,
              },
              data,
            })
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...currentUser,
            favorites: data.unLikePost.favorites,
          }
          this.$store.commit('SET_CURRENT_USER', updatedUser)
        })
        .catch((err) => console.log(err))
    },
    handleAddPosrMessage() {
      if (!this.$refs.form.validate()) return
      const { post_id, messageBody, currentUser } = this
      const variables = {
        post_id,
        messageBody,
        user_id: currentUser._id,
      }
      this.$apollo
        .mutate({
          mutation: ADD_POST_MESSAGE,
          variables,
          update: (cache, { data: { addPostMessage } }) => {
            // read the query we want to update
            const data = cache.readQuery({
              query: GET_POST,
              variables: {
                post_id,
              },
            })

            // add the new message to the existing array
            data.getPost.messages.unshift(addPostMessage)
            cache.writeQuery({
              query: GET_POST,
              variables: {
                post_id,
              },
              data,
            })
          },
        })
        .then(({ data }) => {
          console.log(data.addPostMessage)
          this.$refs.form.reset()
        })
        .then((err) => {
          console.log(err)
        })
    },
    getTimeFromNow(value) {
      return dayjs(Number(value)).fromNow()
    },
  },
  computed: {
    ...mapGetters(['currentUser', 'userFavorites']),
  },
  filters: {
    timeFormat: function(value) {
      return 'Danny Wang'
    },
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
}
</script>

<style lang="stylus" scoped>

.operator-wrapper
  width 80%
  margin 0 auto

::v-deep .v-text-field
  width 350px
  border-radius: 16px;

.flex-container
  display flex
  flex-direction column
  align-items center
  padding 15px 10px

.comments-section-title
  font-size 16px
  color #111111
  border-bottom 3px solid #222
  width 92px
  margin-bottom 5px
  font-weight 700

.message-input-wrapper
  display flex
  align-items center
  margin 5px 0
  width 350px

.message-wrapper
  display flex
  align-items center
  margin 5px 0

  .message-user-image
    margin-right 15px
    font-size 14px
    color #111111

  .message-content-box
    border 2px solid #ddd
    border-radius 16px
    background-color #fff
    padding 12px
    width 300px
    min-height 60px

  .message-info
    display flex
    justify-content space-between
    width 100%
    font-size 14px
    height 18px

    .message-user-name
      font-size 14px

    .message-time
      font-size 14px
      color #767676

  .message-content
    span
      font-size 12px
      color #111111
</style>
