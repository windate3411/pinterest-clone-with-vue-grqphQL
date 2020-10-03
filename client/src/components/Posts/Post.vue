<template>
  <div class="wrapper d-flex justify-center">
    <v-container v-if="!getPost">
      <Spinner />
    </v-container>
    <div
      v-else
      :style="{
        width: cardWidth,
      }"
      v-resize="onResize"
    >
      <v-container class="mt-5">
        <!-- copy to clipboard snackbar -->
        <v-snackbar
          v-model="clipboardMessageShown"
          top
          transition="fab-transition"
          timeout="2000"
          color="#5cb85c"
        >
          <h3 class="text-center">Copy to Clipboard!</h3>
        </v-snackbar>
        <SocialSharing
          v-if="sharingModal"
          :post="getPost"
          :sharingModal="sharingModal"
          @handleCopy="copyToClipBoard"
        />
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
              <v-dialog v-model="imageDialog">
                <v-card tile>
                  <img :src="getPost.imgUrl" />
                </v-card>
              </v-dialog>
            </v-col>
            <v-col xs="6" md="6" offset="xs-3">
              <v-row
                justify="space-between"
                class="px-5 operator-wrapper text-center"
              >
                <div class="operators">
                  <v-icon @click="hanldeImageDownload">mdi-download</v-icon>
                  <v-icon class="ml-2" @click.stop="toggleSharingDialog"
                    >mdi-share</v-icon
                  >
                </div>
                <v-icon
                  :color="checkIfLikedPost(post_id) ? 'red' : 'grey'"
                  v-if="currentUser"
                  class="animate__animated animate__heartBeat animate__repeat-3"
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
    </div>
  </div>
</template>

<script>
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST,
} from '../../queries'
import { mapGetters, mapActions } from 'vuex'
import Spinner from '../Shared/Spinner'
import SocialSharing from '../Shared/SocialSharing'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { downloadImage } from '@/utils'

dayjs.extend(relativeTime)

export default {
  name: 'Post',
  props: ['post_id'],
  components: {
    Spinner,
    SocialSharing
  },
  data() {
    return {
      clipboardMessageShown: false,
      imageDialog: false,
      socialSharingDialog: false,
      messageBody: '',
      hasLiked: false,
      isFormValidated: true,
      screenWidth: '',
      addPostMessageRules: [
        (value) =>
          value.length < 60 || 'Message must be less than 60 characters',
      ],
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
    ...mapActions(['likePost','unLikePost', 'toggleSharingModal']),
    goToPrevPage() {
      this.$router.go(-1)
    },
    test() {
      console.log('ehee')
    },
    async copyToClipBoard() {
      await navigator.clipboard.writeText(this.getPost.imgUrl)
      this.clipboardMessageShown = true
    },
    hanldeImageDownload() {
      downloadImage(this.getPost.imgUrl)
    },
    toggleImgaeDialog() {
      if (window.innerWidth > 500) this.imageDialog = !this.imageDialog
    },
    toggleSharingDialog() {
      this.toggleSharingModal()
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
      this.likePost({
        post_id: this.post_id,
        username: this.currentUser.username
      })
    },
    handleUnLikePost() {
      this.unLikePost({
        post_id: this.post_id,
        username: this.currentUser.username
      })
    },
    handleAddPosrMessage() {
      if (this.$refs.form.validate()) {
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
            this.$refs.form.reset()
          })
          .then((err) => {
            console.log(err)
          })
      }
    },
    getTimeFromNow(value) {
      return dayjs(Number(value)).fromNow()
    },
    onResize() {
      this.screenWidth = window.innerWidth
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'userFavorites', 'sharingModal']),
    cardWidth() {
      if (this.screenWidth < 960) return '450px'
      return  '100%'
    }
  },
}
</script>

<style lang="stylus" scoped>

img
  object-fit scale-down
  height 80vh
  width 100%
  overflow hidden

.sharing-dialog-wrapper
  .social-icon-wrapper
    display flex
    flex-direction column
    align-items center
    width 72px

    span
      font-size 12px
      color #111111
      cursor pointer
      transform translateX(-12%)
      font-weight 700
  i
    font-size 48px
    border-radius 50%
    margin-right 8px
    cursor pointer

  .fa-line
    color #00B900

  .fa-twitter
    color #00ACEE

  .fa-facebook
    color #3B5998

  .fa-envelope
    color #767676

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
