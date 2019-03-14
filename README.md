# m-forum

> 学术讨论论坛
>
> 帖子有三类：公共帖子、小组内可见的帖子、部分人可见的帖子

[预览demo](http://120.79.144.82/#/home/home)

web: `/dist/web/`

server：`/new-server/`

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
# build web pages for production
npm run build:web
# build windows 32bit application for production
npm run win32
# build mac application for production(build only in mac)
npm run mac
# build linux application for production
npm run linux

# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).


[webhook push event](https://developer.github.com/v3/activity/events/types/#webhook-event-name-34)



## 目录结构

### components

```
.
├── Common
│   ├── commons.js
│   └── MAvatar.vue	===> 头像
├── HomePage
│   ├── EditPanel.vue	===> 用户信息编辑页面
│   ├── GroupPanel.vue	===> 小组信息页面
│   ├── GroupsPanel.vue	===> 已加入、所有小组页面
│   ├── HomePanel
│   │   ├── ListItem.vue	===> 帖子列表item
│   │   ├── PostPart
│   │   │   ├── NewReply.vue	===> 新回复
│   │   │   └── ReplyItem.vue	===> 回复列表item
│   │   └── PostPart.vue	===> 帖子页面
│   ├── HomePanel.vue	===> 主页
│   ├── NewPostPanel.vue	===> 发帖
│   ├── NotificationsPanel.vue	===> 消息页面
│   ├── PostModal.vue	===> 帖子弹窗
│   ├── SearchPanel.vue	===> 搜索页
│   ├── SideBar.vue	===> 菜单栏
│   ├── StarPanel.vue	===> 收藏页
│   ├── UserPanel.vue	===> 用户信息页
│   ├── WikiPanel
│   │   └── NewPage.vue	===> wiki新建页
│   └── WikiPanel.vue	===> wiki页
├── HomePage.vue	===> 主页container
├── WelcomePage
│   ├── LoginPanel.vue	===> 登录
│   └── SignupPanel.vue	===> 注册
└── WelcomePage.vue	===> 登录注册页
```

### server

```
app/
├── controllers
│   ├── group.js
│   ├── post.js
│   ├── user.js
│   └── wiki.js
├── models
│   ├── group.js
│   ├── mime.js
│   ├── mime.json
│   ├── post.js
│   ├── user.js
│   └── wiki.js
└── routes
    ├── group.js
    ├── index.js
    ├── post.js
    ├── static.js
    ├── user.js
    └── wiki.js
config/
└── index.js
public/
package.json
server.js
```



## 路由

### 前端路由

- / => /home
- /welcome(登录注册页)
- /home
  - '' => home
  - home(主页)
  - groups(显示加入小组与所有小组)
  - group/:group(小组页面)
  - new-post(发帖页面)
  - user/:name(用户界面)
  - edit(用户信息编辑界面)
  - wiki(wiki页面)
  - new-wiki(创建wiki)
  - notifications(消息页面)
  - post(单独的帖子页面)
  - search(搜索结果页面)
  - star(收藏页面)

### 后端路由

- /user
  - /create
    - /signup
    - /star
  - /find
    - /login
    - /data
    - /groups-names
    - /notifications
    - /newNt
    - /stars
  - /update
    - /info
    - /newNt
  - /delete
    - /Nt
    - /star
- /post
  - /create
    - /new
    - /reply
    - /reply-to-reply
  - /find
    - /all
    - /limit
    - /byId
    - /search
  - /delete
    - /reply
    - /reply-to-reply
    - *
- /group
  - /create
    - /member
    - /join
    - *
  - /find
    - `get` /names
    - `get` *
    - /byName
    - /search
  - /update
    - /join-public
    - /accept
    - /refuse
    - /avatar
  - /delete
    - /member
    - *
- /wiki
  - /create
    - /new
  - /find
    - /page
    - /titles
    - /search
  - /update
    - /edit
    - /groups
    - /hooks
  - /delete
    - *
- /statics
  - `get` *
  - /upload
  - /upload-avatar
- *
  - 返回`web/`内对应文件
  - 没有返回404



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
  - id
  - title
  - abstract(帖子的abstract，没有则为帖子内容的前100个字符+'...')
- applyNotifications(别人申请此人管理的小组的申请)
  - username
  - groupName
- resultNotifications(申请小组的结果)
  - groupName
  - result(true or false)
- replyNotifications(回复通知)
  - username
  - title
  - postId(由于帖子名称可重复， 因此额外存储帖子id)
  - replyIndex(0, 1, ...., 用于跳转)
- newApplyNt(true or false)
- newResultNt(true or false)
- newReplyNt(true or false)
  


### groups

存储所有小组，对于每一个小组，都有以下属性：

- name
- avatar(null)
- leader(username)
- intro
- users(username)
- joinPubic(开放加入, true or false)


### posts

存储所有帖子，对于每一个帖子，都有以下属性：

- username
- title
- abstract
- group(默认为undefined，设定后为只限此小组成员可见的帖子)
- tags(name)
- time
- content
- lastModifyTime(创建后为发表时间，每次有新评论时，更新为新评论)
- replys (存储这个帖子所有回复)
  - username
  - time
  - content
  - replys
    - username
    - time
    - content

### wikis

- title
- lastestVersion
  - username
  - time
  - content
  - editMessage
- allVersions([])
  - username
  - time
  - content
  - editMessage
- groups(默认为[]，设定后为只限这些小组的成员可见与编辑的wiki)



## 静态资源

/public


## 测试

测试用账号密码：

zmj 111111
zm 111111