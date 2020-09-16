## Vinterest

## Table of Contents

- [About the Project](#about-the-project)
- [Project Preview](#project-preview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Instructions](#instructions)
- [Author](#author)

## About the Project

Vinterest is basically a pinterest inspired dumb-down clone which mainly built with

- [vue.js](https://vuejs.org/)
- [vuetify](https://vuetifyjs.com/en/)
- [mongodb](https://www.mongodb.com/)
- [mongodb atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_apac_taiwan_search_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=6498554090&gclid=CjwKCAjwzIH7BRAbEiwAoDxxTvvPx8cLRWirp8tJAHTp8G_pNEnTBN0tFxHhCfuhvQ6DjKPuNNDpRBoCoX4QAvD_BwE)
- [graphql](https://graphql.org/)
- [vue-apollo](https://apollo.vuejs.org/)
- [json-web-token](https://www.npmjs.com/package/jsonwebtoken)

In this application
**As a vititor you can**

---

- sign in as a registered user
- sign up as a new user
- browse most recently uploaded posts(the top 5)
- browse all posts on the platform
- check out specific post detail
- search for specific post(works for tag, title and description)

**As a signin user you can**

- logout
- like post
- leave comments on certain post
- view your own profile, which includes the posts you liked (**yet to be finished**)

## Project Preview

To be finished

## Getting Started

If you wanna try out the application , you can either [visit the site](https://vinterest-danny.vercel.app/) or user the following
instructions to run on your local machine.

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
