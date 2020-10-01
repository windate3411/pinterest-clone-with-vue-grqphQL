const axios = require('axios')

module.exports = {
  async downloadImage(imgUrl) {
    try {
      const response = await axios({
        url: imgUrl,
        method: 'GET',
        responseType: 'blob',
      })
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]))
      const fileLink = document.createElement('a')
      fileLink.href = fileUrl
      fileLink.setAttribute('download', 'image.jpg')
      document.body.appendChild(fileLink)
      fileLink.click()
    } catch (error) {
      console.log(error)
    }
  },
}
