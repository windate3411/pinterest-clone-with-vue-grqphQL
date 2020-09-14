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

    <!-- message section -->
    <div class="message-container mt-5">
      <!-- message textarea -->
      <v-row v-if="currentUser">
        <v-col xs="12">
          <v-form>
            <v-row>
              <v-col xs="12">
                <v-text-field
                  clearable
                  append-outer-icon="mdi-send"
                  prepend-icon="mdi-email"
                  label="Add your thought to this Post"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>

      <!-- display post messages  -->
      <v-row>
        <v-col xs="12">
          <v-list subheader two-line>
            <v-subheader inset>Messages ({{getPost.messages.length}})</v-subheader>
            <template v-for="message in getPost.messages">
              <v-divider :key="message.id"></v-divider>
              <v-list-item avatar inset :key="message.title">
                <v-list-item-avatar>
                  <v-img :src="message.messageUser.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{message.messageBody}}</v-list-item-title>
                  <v-list-item-subtitle>{{message.messageUser.username}}</v-list-item-subtitle>
                  <span class="grey--text text--lighten-1 hidden-xs-only">{{message.messageDate}}</span>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon color="grey">mdi-chat-processing-outline</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
      </v-row>
    </div>
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