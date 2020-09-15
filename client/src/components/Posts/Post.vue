<template>
  <v-container v-if="getPost" class="mt-3">
    <v-row>
      <v-col xs="12">
        <v-card>
          <!-- card title -->
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn v-if="currentUser" @click="handleLikeToggle" large text>
              <v-icon large :color="checkIfLikedPost(post_id)?'red':'grey'">mdi-heart</v-icon>
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
          <v-form
            @submit.prevent="handleAddPosrMessage"
            ref="form"
            lazy-validation
            v-model="isFormValidated"
          >
            <v-row>
              <v-col xs="12">
                <v-text-field
                  clearable
                  :append-outer-icon="messageBody && 'mdi-send'"
                  prepend-icon="mdi-email"
                  label="Add your thought to this Post"
                  @click:append-outer="handleAddPosrMessage"
                  v-model="messageBody"
                  :rules="addPostMessageRules"
                  maxlength="60"
                  counter
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
              <v-list-item inset :key="message.title">
                <v-list-item-avatar>
                  <v-img :src="message.messageUser.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{message.messageBody}}</v-list-item-title>
                  <v-list-item-subtitle>{{message.messageUser.username}}</v-list-item-subtitle>
                  <span class="grey--text text--lighten-1 hidden-xs-only">{{message.messageDate}}</span>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon
                    :color="checkIfOwnMessage(message) ? 'accent': 'grey'"
                  >mdi-chat-processing-outline</v-icon>
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
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST,
} from "../../queries";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Post",
  props: ["post_id"],
  data() {
    return {
      dialog: false,
      messageBody: "",
      hasLiked: false,
      isFormValidated: true,
      addPostMessageRules: [
        (value) =>
          value.length < 60 || "Message must be less than 60 characters",
      ],
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
    checkIfOwnMessage(message) {
      return message.messageUser._id === this.currentUser._id;
    },
    checkIfLikedPost(post_id) {
      if (
        this.userFavorites &&
        this.userFavorites.some((post) => post._id === post_id)
      ) {
        return (this.hasLiked = true);
      }
      return (this.hasLiked = false);
    },
    handleLikeToggle() {
      return this.hasLiked ? this.handleUnLikePost() : this.handleLikePost();
    },
    handleLikePost() {
      const { post_id, messageBody, currentUser } = this;
      const variables = {
        post_id,
        username: currentUser.username,
      };
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
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: {
                post_id: this.post_id,
              },
              data,
            });
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...currentUser,
            favorites: data.likePost.favorites,
          };
          this.$store.commit("SET_CURRENT_USER", updatedUser);
        })
        .catch((err) => console.log(err));
    },
    handleUnLikePost() {
      const { post_id, messageBody, currentUser } = this;
      const variables = {
        post_id,
        username: currentUser.username,
      };
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
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: {
                post_id: this.post_id,
              },
              data,
            });
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...currentUser,
            favorites: data.unLikePost.favorites,
          };
          this.$store.commit("SET_CURRENT_USER", updatedUser);
        })
        .catch((err) => console.log(err));
    },
    handleAddPosrMessage() {
      if (!this.$refs.form.validate()) return;
      const { post_id, messageBody, currentUser } = this;
      const variables = {
        post_id,
        messageBody,
        user_id: currentUser._id,
      };
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
            });

            // add the new message to the existing array
            data.getPost.messages.unshift(addPostMessage);
            cache.writeQuery({
              query: GET_POST,
              variables: {
                post_id,
              },
              data,
            });
          },
        })
        .then(({ data }) => {
          console.log(data.addPostMessage);
          this.$refs.form.reset();
        })
        .then((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    ...mapGetters(["currentUser", "userFavorites"]),
  },
};
</script>