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
