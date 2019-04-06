(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{124:function(e,t,a){"use strict";a.r(t);var r={name:"LoginPanel",data:()=>({formData:{username:"",password:""},rule:{username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{type:"string",min:6,message:"密码不少与6位",trigger:"blur"}]}}),methods:{handleSubmit(e){this.$refs[e].validate(e=>{e?this.$http.post("/user/find/login",this.formData).then(e=>{"object"==typeof e.data?(this.$Message.success("登陆成功!"),this.$store.dispatch("setStorage",{username:this.formData.username}),this.$store.dispatch("setUser",{data:e.data}),this.$router.push("/home")):!1===e.data?this.$Message.error("用户名或密码错误!"):this.$Message.error("数据库连接失败!")}).catch(e=>{this.$Message.error("网络连接失败!"),console.error(e)}):this.$Message.error("请检查输入!")})}}},s=a(3),o={name:"SignupPanel",data(){return{formData:{username:"",email:"",password:"",pwdRepeat:""},rule:{username:[{required:!0,message:"请输入用户名",trigger:"blur"}],email:[{required:!0,message:"请输入邮箱",trigger:"blur"},{type:"string",pattern:/^[[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,message:"请输入正确的邮箱",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{type:"string",min:6,message:"密码不少于6位",trigger:"blur"}],pwdRepeat:[{required:!1,validator:(e,t,a)=>{t===this.formData.password?a():a(new Error("重复密码与密码不同"))},trigger:"blur"}]}}},methods:{handleSubmit(e){this.$refs[e].validate(e=>{if(e){var t={username:this.formData.username,email:this.formData.email,password:this.formData.password,avatar:null,gender:null,telephone:null,groups:[],stars:[],drafts:[],applyNotifications:[],resultNotifications:[],replyNotifications:[],newApplyNt:!1,newResultNt:!1,newReplyNt:!1};this.$http.post("/user/create/signup",t).then(e=>{"success"===e.data?(this.$Message.success("注册成功!"),this.$Message.success("登陆成功!"),this.$store.dispatch("setStorage",{email:this.formData.email}),this.$store.dispatch("setUser",{data:t}),this.$router.push("/home")):"repeat"===e.data?this.$Message.error("用户名或邮箱重复!"):this.$Message.error("数据库连接失败!")}).catch(e=>{this.$Message.error("网络连接失败!"),console.log(e)})}else this.$Message.error("请检查输入!")})}}},n={name:"WelcomePage",components:{LoginPanel:Object(s.a)(r,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Form",{ref:"formData",attrs:{model:e.formData,rules:e.rule}},[a("FormItem",{attrs:{prop:"username"}},[a("Input",{attrs:{type:"text",placeholder:"用户名"},on:{"on-enter":function(){return e.handleSubmit("formData")}},model:{value:e.formData.username,callback:function(t){e.$set(e.formData,"username",t)},expression:"formData.username"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-person-outline"},slot:"prepend"})],1)],1),e._v(" "),a("FormItem",{attrs:{prop:"password"}},[a("Input",{attrs:{type:"password",placeholder:"密码"},on:{"on-enter":function(){return e.handleSubmit("formData")}},model:{value:e.formData.password,callback:function(t){e.$set(e.formData,"password",t)},expression:"formData.password"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-lock-outline"},slot:"prepend"})],1)],1),e._v(" "),a("FormItem",[a("Button",{attrs:{type:"primary"},on:{click:function(){return e.handleSubmit("formData")}}},[e._v("登录")])],1)],1)},[],!1,null,"4846f8b9",null).exports,SignupPanel:Object(s.a)(o,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Form",{ref:"formData",attrs:{model:e.formData,rules:e.rule}},[a("FormItem",{attrs:{prop:"username"}},[a("Input",{attrs:{type:"text",placeholder:"用户名"},model:{value:e.formData.username,callback:function(t){e.$set(e.formData,"username",t)},expression:"formData.username"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-person-outline"},slot:"prepend"})],1)],1),e._v(" "),a("FormItem",{attrs:{prop:"email"}},[a("Input",{attrs:{type:"email",placeholder:"邮箱"},model:{value:e.formData.email,callback:function(t){e.$set(e.formData,"email",t)},expression:"formData.email"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-mail-outline"},slot:"prepend"})],1)],1),e._v(" "),a("FormItem",{attrs:{prop:"password"}},[a("Input",{attrs:{type:"password",placeholder:"密码"},model:{value:e.formData.password,callback:function(t){e.$set(e.formData,"password",t)},expression:"formData.password"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-lock-outline"},slot:"prepend"})],1)],1),e._v(" "),a("FormItem",{attrs:{prop:"pwdRepeat"}},[a("Input",{attrs:{type:"password",placeholder:"重复密码"},model:{value:e.formData.pwdRepeat,callback:function(t){e.$set(e.formData,"pwdRepeat",t)},expression:"formData.pwdRepeat"}},[a("Icon",{attrs:{slot:"prepend",type:"ios-lock-outline"},slot:"prepend"})],1)],1),e._v(" "),a("FormItem",[a("Button",{attrs:{type:"primary"},on:{click:function(){return e.handleSubmit("formData")}}},[e._v("注册")])],1)],1)},[],!1,null,"1d6c7fcf",null).exports},data:()=>({login:!0}),methods:{highlightLogin(){this.login=!0},highlightSignup(){this.login=!1}}},i=(a(90),Object(s.a)(n,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container",staticStyle:{"-webkit-app-region":"drag"}},[a("Tabs",{staticClass:"center",staticStyle:{"-webkit-app-region":"no-drag"}},[a("TabPane",{staticStyle:{"-webkit-app-region":"no-drag"},attrs:{label:"登录"}},[a("login-panel")],1),e._v(" "),a("TabPane",{staticStyle:{"-webkit-app-region":"no-drag"},attrs:{label:"注册"}},[a("signup-panel")],1)],1)],1)},[],!1,null,"ebaea710",null));t.default=i.exports},73:function(e,t,a){var r=a(91);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,a(7).default)("57d5afa6",r,!0,{})},90:function(e,t,a){"use strict";var r=a(73);a.n(r).a},91:function(e,t,a){(e.exports=a(6)(!1)).push([e.i,".container[data-v-ebaea710]{height:100vh}.center[data-v-ebaea710]{position:absolute;width:300px;top:50%;left:50%;transform:translate(-50%,-50%)}",""])}}]);