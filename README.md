# m-forum

> 学术讨论论坛
>
> 帖子有三类：公共帖子、小组内可见的帖子、部分人可见的帖子

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).



## 路由

### 前端路由

- / => /home
- /welcome(登录注册页)
- /home
  - '' => home
  - home(主页)
  - group/:group(小组页面)
  - groups(显示加入小组与所有小组)
  - new-post(发帖页面)
  - user/:name(用户界面)
  - profile-edit(用户信息编辑界面)
  - post(单独的帖子页面)
  - wiki(wiki页面)

### 后端路由

- statics
- user
  - create
  - update
  - find
    - login
  - delete
- group
  - create
  - update
  - find
  - delete
- post
  - normal
    - create
    - update
    - find
    - delete
  - private
    - create
    - update
    - find
    - delete
  - group
    - create
    - update
    - find
    - delete
- wiki(?)



## 数据库(forum)

- `db` : forum
- `collections` :  user、group、post、postPrivate、wiki



### users

存储所有用户，对于每一个用户，都有以下属性：

- username
- email
- password
- avatar(default: null)
- gender(default: null)
- telephone(default: null)
- groups(name)(default: [])
- stars(id, 收藏的帖子)(default: [])
- drafts(草稿)(default: [])
  - title
  - abstract
  - tags(name)
  - time
  - content
  - group(name)
  - users(username)



### groups

存储所有小组，对于每一个小组，都有以下属性：

- name
- leader(username)
- intro
- users(username)



### posts

存储所有公共帖子，对于每一个帖子，都有以下属性：

- username
- title
- abstract
- group(默认为undefined，设定后为只限此小组成员可见的帖子)
- tags(name)
- time
- content
- replys (存储这个帖子所有回复)
  - username
  - time
  - content



### postsPrivate(限制部分人可看的帖子)

- username(发帖人)
- users(username，可以看到这个帖子的人，包括发帖人)
- title
- abstract
- tags(name)
- time
- content
- replys (存储这个帖子所有回复)
  - username
  - time
  - content



### wikis

?



## 静态资源

/public



## 测试

测试用账号密码：

123	123@qq.com		111111

111	111@qq.com		111111

222	222@qq.com		222222