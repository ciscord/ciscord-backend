```
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        channelsInfo {
          id
          channel {
            id
            name
            url
          }
          lastUpdateAt
        }
      }
    }
  }

  ```

  ```
  mutation sendMessage(
    $body: String!
    $channelUrl: String!
    $attachments: [String!]
    $urlList: [String!]
    $mentions: [String!]
    $communityUrl: String!
  ) {
    sendMessage(
      body: $body
      channelUrl: $channelUrl
      attachments: $attachments
      urlList: $urlList
      mentions: $mentions
      communityUrl: $communityUrl
    ) {
      id
      body
      createdAt
      author {
        id
        username
      }
      attachments {
        id
        filename
      }
    }
  }
  ```

  ```
  {
    {
      "body": "test",
      "channelUrl": "general/general",
      "urlList": null,
      "mentions": [],
      "communityUrl": "general"
    }
  }
```

