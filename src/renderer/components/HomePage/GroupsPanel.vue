<template>
  <div>
    <Tabs :animated="true" type="card" v-model="tabName">
      <TabPane label="已加入" name="已加入" id="joined">
        <Col :xs="12" :sm="6" :md="4" :lg="3" v-for="item in joined">
          <router-link :to="'/home/group/' + item.name">
            <Card class="group">
              <p slot="title">{{ item.name }}</p>
              <p>{{ item.leader }}</p>
              <p>{{ item.intro }}</p>
            </Card>
          </router-link>
        </Col>
      </TabPane>
      <TabPane label="全部">
        <Col :xs="12" :sm="6" :md="4" :lg="3" v-for="item in groups">
          <router-link :to="'/home/group/' + item.name">
            <Card class="group">
              <p slot="title">{{ item.name }}</p>
              <p>{{ item.leader }}</p>
              <p>{{ item.intro }}</p>
            </Card>
          </router-link>
        </Col>
      </TabPane>
      <TabPane label="创建小组">
        <Form ref="formData" :model="formData" :rules="rule" style="width: 500px; margin: 0 auto">
          <FormItem prop="name">
            <Input type="text" v-model="formData.name" placeholder="小组名称">
                <Icon type="md-people" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="intro">
            <Input type="text" v-model="formData.intro" placeholder="小组简介">
              <Icon type="md-book" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="createGroup">创建</Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {

  name: 'GroupsPanel',

  data () {
    return {
      tabName: '已加入',
      // 已加入小组
      joined: [],
      // 所有小组
      groups: [],

      formData: {
        name: '',
        avatar: null,
        leader: '',
        intro: '',
        users: [],
        joinPubic: false
      },
      rule: {
        name: [
          {
            required: true,
            message: '请输入小组名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    createGroup () {
      this.formData.leader = this.getCurrentUser().username
      this.formData['users'][0] = this.getCurrentUser().username
      this.$http.post('/group/create', this.formData)
        .then((res) => {
          if (res.data === 'success') {
            this.$Message.success('创建成功!')
            // 更新数据
            this.updateData()
            // 标签页切换为已加入小组
            this.tabName = '已加入'
          } else if (res.data === 'repeat') {
            this.$Message.error('小组名称重复!')
          } else {
            this.$Message.error('数据库连接失败!')
          }
        })
        .catch((err) => {
          this.$Message.error('网络连接失败!')
          console.error(err)
        })
    },

    updateData () {
      // 获取已加入小组
      this.getUserData(this.getCurrentUser().username, data => {
        if (data.groups.length === 0) {
          this.$Notice.open({
            title: '您还未加入小组！'
          })
        } else {
          // 获取小组数据
          this.getGroupData(data.groups, data => {
            this.joined = data
          })
        }
      })

      // 获取所有小组
      this.$http.get('/group/find')
        .then((res) => {
          if (res.data === false) {
            this.$Notice.open({
              title: '还没有小组，快来创建第一个小组把！'
            })
          } else {
            this.groups = res.data
          }
        })
        .catch((err) => {
          this.$Message.error('网络连接失败!')
          console.error(err)
        })
    }
  },

  mounted () {
    this.updateData()
  }
}
</script>

<style lang="css" scoped>
.group {
  margin: 1rem;
}
</style>