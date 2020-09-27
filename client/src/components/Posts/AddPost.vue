<template>
  <v-container class="mt-5 text-center">
    <v-row>
      <v-col xs="6" offset="1">
        <v-card width="880px" hover class="rounded-lg">
          <v-row>
            <v-col cols="6" align-self="center">
              <transition name="fade">
                <div class="image-preview ml-2" v-if="!imgUrl">
                  <div class="border"></div>
                </div>
                <v-img
                  :src="imgUrl"
                  contain
                  class="rounded-lg ml-2"
                  v-else
                ></v-img>
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

                  <!-- imgUrl input -->
                  <v-row>
                    <v-col xs="12">
                      <v-text-field
                        label="Image Url"
                        name="imgUrl"
                        :rules="imgUrlRules"
                        prepend-icon="mdi-image"
                        type="text"
                        v-model="imgUrl"
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
                  :disabled="loading || !isFormValid"
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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      categories: [],
      imgUrl: "",
      title: "",
      description: "",
      titleRules: [(value) => !!value || "Post title is required"],
      descriptionRules: [(value) => !!value || "Post description is required"],
      imgUrlRules: [(value) => !!value || "Image url is required"],
      categoriesRules: [
        (value) =>
          value.length >= 1 || "You need to select at least one category",
      ],
    };
  },
  methods: {
    handleAddPostSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          description: this.description,
          imgUrl: this.imgUrl,
          categories: this.categories,
          creatorId: this.currentUser._id,
        });
      }
      this.$router.push("/");
    },
  },
  computed: {
    ...mapGetters(["currentUser", "loading"]),
  },
};
</script>


<style lang="stylus" scoped>

.image-preview
  background-color #efefef
  height 500px
  position relative

  .border
    border 3px dashed #767676
    height 90%
    width 90%
    position absolute
    left 50%
    top 50%
    transform translate(-50%,-50%)

.fade-enter-active, .fade-leave-active
  transition all 0.25s


.fade-enter-active 
  transition-delay 0.25s


.fade-enter, .fade-leave-active 
  opacity 0

</style>