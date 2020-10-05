<template>
  <v-container class="mt-5 text-center">
    <v-row>
      <v-col xs="6" offset="1">
        <v-card width="880px" hover class="rounded-lg">
          <v-row>
            <v-col cols="6" align-self="center">
              <transition name="fade">
                <vue-dropzone
                  ref="imgDropZone"
                  id="customdropzone"
                  :options="dropzoneOptions"
                  @vdropzone-removedFile="vremoved"
                  @vdropzone-complete="afterComplete"
                  @vdropzone-file-added="generatePreviewImg"
                  :include-styling="false"
                  :useCustomSlot="true"
                  v-if="!previewImg"
                >
                  <div class="dropzone-custom-content border">
                    <div class="d-flex">
                      <v-icon class="mr-1">mdi-upload</v-icon>
                      <h3 class="dropzone-custom-title">
                        Drag and drop to upload content!
                      </h3>
                    </div>
                  </div>
                </vue-dropzone>
                <div class="previewImg-wrapper" v-else>
                  <div class="previewImg-icon-wrapper" @click.stop="removeImg">
                    <v-icon class="trash-icon">mdi-delete</v-icon>
                  </div>
                  <img class="rounded-lg ml-2 d-block" :src="previewImg" />
                </div>
              </transition>
            </v-col>
            <v-col cols="6">
              <div class="form-wrapper">
                <v-form v-model="isFormValid" lazy-validation ref="form">
                  <!-- title input -->
                  <v-row>
                    <v-col xs="12">
                      <v-text-field
                        label="Add your title"
                        name="title"
                        :rules="titleRules"
                        prepend-icon="mdi-post"
                        type="text"
                        v-model="title"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <!-- categories input -->
                  <v-row>
                    <v-col xs="12">
                      <v-select
                        v-model="categories"
                        multiple
                        label="Categories"
                        chips
                        clearable
                        deletable-chips
                        :rules="categoriesRules"
                        prepend-icon="mdi-form-select"
                        :items="[
                          'Art',
                          'Education',
                          'Travel',
                          'Photography',
                          'Technology',
                        ]"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col xs="12" class="d-flex align-center">
                      <v-avatar class="mr-1" size="32">
                        <v-img :src="currentUser.avatar"></v-img>
                      </v-avatar>
                      <h4>{{ currentUser.username }}</h4>
                    </v-col>
                  </v-row>

                  <!-- description input -->
                  <v-row>
                    <v-col xs="12">
                      <v-textarea
                        label="Tell us what your post is about"
                        name="description"
                        :rules="descriptionRules"
                        prepend-icon="mdi-pencil"
                        type="text"
                        v-model="description"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-row>
              <v-col xs="12">
                <v-btn
                  color="accent"
                  @click="handleAddPostSubmit"
                  :loading="loading"
                  :disabled="loading || !isFormValid || !imgUrl"
                >
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase'
import vue2Dropzone from 'vue2-dropzone'
import axios from 'axios'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
const uuid = require('uuid')

export default {
  name: 'AddPost',
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      isFormValid: true,
      categories: [],
      imgUrl: '',
      title: '',
      description: '',
      titleRules: [(value) => !!value || 'Post title is required'],
      descriptionRules: [(value) => !!value || 'Post description is required'],
      categoriesRules: [
        (value) =>
          value.length >= 1 || 'You need to select at least one category',
      ],
      previewImg: '',
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 500,
        maxFilesize: 0.5,
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: '.jpg, .jepg, .png',
      },
    }
  },
  methods: {
    handleAddPostSubmit() {
      if (this.$refs.form.validate() && this.imgUrl) {
        this.$store.dispatch('addPost', {
          title: this.title,
          description: this.description,
          imgUrl: this.imgUrl,
          categories: this.categories,
          creatorId: this.currentUser._id,
        })
        this.$router.go(0)
      }
    },
    async afterComplete(file) {
      try {
        const imageName = uuid.v1()
        this.uuid = imageName
        const metaData = {
          contentType: 'image/png',
        }
        const storageRef = firebase.storage().ref()
        const imageRef = storageRef.child(`images/${imageName}.png`)

        await imageRef.put(file, metaData)
        const downloadUrl = await imageRef.getDownloadURL()
        this.imgUrl = downloadUrl
      } catch (error) {
        console.log(error)
      }
    },
    vremoved() {
      this.removedFile = true
    },
    generatePreviewImg(file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        this.previewImg = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImg() {
      this.previewImg = ''
      this.imgUrl = ''
    },
  },
  computed: {
    ...mapGetters(['currentUser', 'loading']),
  },
}
</script>

<style lang="stylus" scoped>

.fade-enter-active, .fade-leave-active
  transition all 0.25s


.fade-enter-active
  transition-delay 0.25s


.fade-enter, .fade-leave-active
  opacity 0


.previewImg-wrapper
  position relative

  img
    display block
    height 100%
    width 100%

  .previewImg-icon-wrapper
    position absolute
    left 10px
    top 50%
    height 50px
    width 50px
    border-radius 50%
    display flex
    justify-content center
    align-items center
    background-color #fff
    transform translateY(-50%)

    .trash-icon
      font-size 32px
      font-weight bold


#customdropzone
  background-color #efefef
  height 500px
  position relative
  cursor grab
  display flex
  justify-content center
  align-items center


.dropzone-custom-content
  display flex
  justify-content center
  align-items center
  height 100%

.border
  border 3px dashed #767676
  height 90%
  width 90%
  position absolute
  left 50%
  top 50%
  transform translate(-50%, -50%)
</style>
