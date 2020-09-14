import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#c8232c',
        secondary: '#80CBC4',
        accent: '#Ef5350',
        error: '#D50000',
        info: '#2979FF',
        success: '#1B5E20',
        warning: '#FFC107',
      },
    },
  },
})
