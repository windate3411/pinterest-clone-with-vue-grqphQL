<template>
  <v-speed-dial
    v-model="fab"
    :bottom="true"
    :right="true"
    direction="top"
    :transition="transition"
    fixed
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="primary" dark fab>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-container class="info-wrapper">
          <div class="text-center">
            <h2 class="info-title">
              Things You Might Be Interested In
            </h2>
          </div>
          <v-row>
            <v-col cols="12">
              <h2 class="info-title">
                About this project <v-icon color="white">mdi-chat</v-icon>
              </h2>
              <p class="info-paragraph">
                Vinterest is basically a pinterest inspired clone which mainly
                built with
                vue.js,vuetify,mongodb,,graphql,vue-apollo,json-web-token and
                firebase storage.You can find out more detail
                <a
                  href="https://github.com/windate3411/pinterest-clone-with-vue-grqphQL"
                  target="_blank"
                  >here</a
                >.
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h2 class="info-title">
                About the author <v-icon>mdi-person</v-icon>
              </h2>
              <p class="info-paragraph">
                Entry Level Front-End Web Developer with extreme passion about
                making new applications/features from scratch. Enjoy learning
                new stuff and helping others acquire new skills. Having great
                communication skills working with people from different fields.
                Looking for a Front-End/Full-stack developer position to sharpen
                the skills I acquired.Aiming to be a full-stack developer in the
                future. If you're interested, you can check out more about me
                through the following links.
              </p>
              <div class="contact-links d-flex mt-3">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      href="http://eruditeness.news.blog"
                      class="mr-4"
                      target="_blank"
                      v-bind="attrs"
                      v-on="on"
                      ><v-icon>mdi-wordpress</v-icon></a
                    >
                  </template>
                  <span>Technical Blog</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      href="https://github.com/windate3411"
                      class="mr-4"
                      target="_blank"
                      v-bind="attrs"
                      v-on="on"
                      ><v-icon>mdi-github</v-icon></a
                    >
                  </template>
                  <span>Github page</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      href="https://www.cakeresume.com/s03411"
                      class="mr-4"
                      target="_blank"
                      v-bind="attrs"
                      v-on="on"
                      ><v-icon>mdi-file-account</v-icon></a
                    >
                  </template>
                  <span>My resume</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      href="https://lighthouse.alphacamp.co/users/1808/ta_profile"
                      class="mr-4"
                      target="_blank"
                      v-bind="attrs"
                      v-on="on"
                      ><v-icon>mdi-teach</v-icon></a
                    >
                  </template>
                  <span>Teaching profile</span>
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn fab dark small color="green" to="/post/add" v-if="currentUser">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn fab dark small color="red" @click.stop="handleDialog">
      <v-icon dense size="20">mdi-help</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      fab: false,
      dialog: false,
      transition: 'slide-y-reverse-transition',
    }
  },
  methods: {
    handleDialog() {
      this.dialog = true
    },
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
}
</script>

<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css2?family=Peddana&family=Sansita+Swashed:wght@300;600&display=swap')

p
  margin-bottom 0

a
  text-decoration none


.info-title
  font-family 'Sansita Swashed', cursive
  letter-spacing 1px

.info-paragraph
  font-family 'Peddana', serif
  font-size 20px
  margin-top 5px
</style>
