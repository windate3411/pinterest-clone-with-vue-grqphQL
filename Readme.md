# Readme.md

## ![logo](https://i.imgur.com/kdISdip.png)


## Table of Contents

- [About the Project](#about-the-project)
- [Project Preview](#project-preview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Instructions](#instructions)
- [Author](#author)

## About the Project

### Vinterest is basically a pinterest inspired  clone which mainly built with

- [vue.js](https://vuejs.org/)
- [vuetify](https://vuetifyjs.com/en/)
- [mongodb](https://www.mongodb.com/)
- [mongodb atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_apac_taiwan_search_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=6498554090&gclid=CjwKCAjwzIH7BRAbEiwAoDxxTvvPx8cLRWirp8tJAHTp8G_pNEnTBN0tFxHhCfuhvQ6DjKPuNNDpRBoCoX4QAvD_BwE)
- [mongoose](https://mongoosejs.com/)
- [graphql](https://graphql.org/)
- [vue-apollo](https://apollo.vuejs.org/)
- [json-web-token](https://www.npmjs.com/package/jsonwebtoken)
- [firebase storage](https://firebase.google.com/?gclid=CjwKCAjwn9v7BRBqEiwAbq1Ey6VpK-qluGc_mVGww9YlenOn1hb3WFKlj2KHhsvi0witmqmOhwe3HxoCNu8QAvD_BwE)

### And using the following package for further modification
- [uuid](https://www.npmjs.com/package/uuid)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [dayjs](https://day.js.org/)
- [vue-social-sharing](https://www.npmjs.com/package/vue-social-sharing)
- [vue-dropzone](https://rowanwins.github.io/vue-dropzone/docs/dist/#/installation)

## Basic Functionaities

*As a vititor you can*

- sign in as a registered user
- sign up as a new user
- browse all posts on the platform
- check out specific post detail
- search for specific post(works for tag, title and description and user comments)
- download post image
- share this post through social media(Line, Twitter, Facebook & Email)

*As a signin user you can*

- logout
- like post
- leave comments on certain post
- view your own profile, which includes the posts you liked
- add new post

## Project Preview(Desktop)

*Main page*
![mainPage](https://i.imgur.com/PNyoL55.jpg)

*Main page resizing(recalculate waterwall cols when resizing)*

![resize](https://i.imgur.com/x2rVCt6.gif)


*Single Post*

![singlePost visitor](https://i.imgur.com/5a6xLZu.png)

*Download and share*

![Download and share](https://i.imgur.com/fUCsEHC.gif)


*Login/Sign Up Modal*

![login](https://i.imgur.com/99rvENz.jpg)

*Add Post Modal*

![add Post](https://i.imgur.com/IaR011Z.gif)

*Profile Page*

![Profile](https://i.imgur.com/znrtPlV.png)


## Getting Started

If you wanna try out the application , you can either [visit the site](https://vinterest-danny.vercel.app/) using this account

```
username: DannyWang
password: 12345678
```

or use the following instructions to run on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [nodemon](https://www.npmjs.com/package/nodemon)

### Instructions

input the following command on your terminal

```
git clone https://github.com/windate3411/pinterest-clone-with-vue-grqphQL.git
```

enter the project folder

```
cd pinterest-clone-with-vue-grqphQL
```

create variables.env file which contains the following info under project root

```
// variables.env
MONGO_URI=XXXXXXXXXXXXXXXXX
SECRET=XXXXXXXXXX
```

install packages

```
npm install or npm i
```

finally enter the following command and visit your localhost on port 8080!

```
npm run dev
```

## Author

Danny Wang
