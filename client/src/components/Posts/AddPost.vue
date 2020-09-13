<template>
  <v-container class="mt-5 text-center">
    <v-row>
      <v-col xs="12" sm="6" offset="sm-3">
        <h1 class="primary--text">Add Post</h1>
      </v-col>
    </v-row>

    <!-- add Post form -->
    <v-row>
      <v-col xs="12" sm="6" offset="sm-3">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-center">It's time to post something!</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="isFormValid" lazy-validation ref="form">
              <!-- title input -->
              <v-row>
                <v-col xs="12">
                  <v-text-field
                    label="Post title"
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

              <!-- Image preview -->
              <v-row v-if="imgUrl">
                <v-col xs="12">
                  <img :src="imgUrl" height="300px" />
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
                    :items="['Art','Education','Travel','Photography','Technology']"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- description input -->
              <v-row>
                <v-col xs="12">
                  <v-textarea
                    label="Description"
                    name="description"
                    :rules="descriptionRules"
                    prepend-icon="mdi-pencil"
                    type="text"
                    v-model="description"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
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
