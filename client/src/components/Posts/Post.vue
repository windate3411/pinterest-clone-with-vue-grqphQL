<template>
  <v-container v-if="getPost" class="mt-3">
    <v-row>
      <v-col xs="12">
        <v-card>
          <!-- card title -->
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn v-if="currentUser" large text>
              <v-icon large color="red">mdi-heart</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} Likes</h3>
            <v-spacer></v-spacer>
            <v-icon large color="info" @click="goToPrevPage">mdi-arrow-left</v-icon>
          </v-card-title>

          <!-- img tooltip -->
          <v-tooltip bottom>
            <span>Click to enlarge the image</span>
            <template v-slot:activator="{ on, attrs }">
              <v-img
                :src="getPost.imgUrl"
                v-bind="attrs"
                v-on="on"
                height="50vh"
                @click="toggleImgaeDialog"
              ></v-img>
            </template>
          </v-tooltip>

          <!-- img dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imgUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <!-- card content -->
          <v-card-text>
            <span v-for="(category,index) in getPost.categories" :key="index">
              <v-chip class="mr-3 text--white" color="accent">{{category}}</v-chip>
            </span>
            <h3 class="mt-2">{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { GET_POST } from "../../queries";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Post",
  props: ["post_id"],
  data() {
    return {
      dialog: false,
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          post_id: this.post_id,
        };
      },
    },
  },
  methods: {
    goToPrevPage() {
      this.$router.go(-1);
    },
    toggleImgaeDialog() {
      if (window.innerWidth > 500) this.dialog = !this.dialog;
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
};
</script>