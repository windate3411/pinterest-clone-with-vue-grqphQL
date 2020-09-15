import { gql } from 'apollo-boost'

// post queries
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      description
      imgUrl
    }
  }
`
export const GET_POST = gql`
  query($post_id: ID!) {
    getPost(post_id: $post_id) {
      _id
      title
      description
      imgUrl
      likes
      categories
      createdDate
      messages {
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMorePosts
      posts {
        _id
        title
        description
        imgUrl
        categories
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`

// post mutations

export const ADD_POST = gql`
  mutation(
    $title: String!
    $description: String!
    $imgUrl: String!
    $categories: [String]!
    $creatorId: ID!
  ) {
    addPost(
      title: $title
      description: $description
      imgUrl: $imgUrl
      categories: $categories
      creatorId: $creatorId
    ) {
      title
      description
      imgUrl
      categories
      createdDate
      likes
    }
  }
`
export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $user_id: ID!, $post_id: ID!) {
    addPostMessage(
      messageBody: $messageBody
      user_id: $user_id
      post_id: $post_id
    ) {
      _id
      messageBody
      messageDate
      messageUser {
        _id
        username
        avatar
      }
    }
  }
`

export const LIKE_POST = gql`
  mutation($post_id: ID!, $username: String!) {
    likePost(post_id: $post_id, username: $username) {
      likes
      favorites {
        _id
        title
        imgUrl
      }
    }
  }
`

export const UNLIKE_POST = gql`
  mutation($post_id: ID!, $username: String!) {
    unLikePost(post_id: $post_id, username: $username) {
      likes
      favorites {
        _id
        title
        imgUrl
      }
    }
  }
`

// user queries

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites {
        _id
        title
        imgUrl
      }
    }
  }
`

// user mutations

export const USER_SIGNIN = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`

export const USER_SIGNUP = gql`
  mutation($username: String!, $password: String!, $email: String!) {
    signupUser(username: $username, password: $password, email: $email) {
      token
    }
  }
`
