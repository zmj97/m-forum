(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{129:function(t,e,a){"use strict";let n;a.r(e);var s={name:"SideBar",props:["hasNewNt"],data(){return{menuActive:"1",username:this.$store.state.Users.currentUser.username,avatar:null,searchStr:"",NOT_WEB:!1}},filters:{firstLetter:t=>t[0]},methods:{logout(){this.$store.dispatch("removeStorage"),this.$Message.success("退出登录成功")},updateMenu(){const t=this.$route.matched[1].path;this.menuActive=-1===t.indexOf("/home/home")?-1===t.indexOf("group")?-1===t.indexOf("new-post")?-1===t.indexOf("wiki")?-1!==t.indexOf("user")||-1!==t.indexOf("edit")||-1!==t.indexOf("notifications")||-1!==t.indexOf("star")?768<=document.body.clientWidth?"6":"0":"-1":"4":"3":"2":"1"},search(){this.$router.push({path:"/home/search",query:{searchStr:this.searchStr}})},getAvatar(){this.getUserData(this.username,t=>{this.avatar=t.avatar})},minimizeWindow(){n.send("min")},maximizeWindow(){n.send("max")},closeWindow(){n.send("close")}},watch:{$route:"updateMenu"},mounted(){this.updateMenu(),this.getAvatar()}},o=(a(96),a(3)),r={name:"HomePage",components:{SideBar:Object(o.a)(s,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("nav",{staticStyle:{"-webkit-app-region":"drag"},attrs:{id:"toolbar"}},[a("Menu",{staticClass:"menu",attrs:{mode:"horizontal","active-name":t.menuActive}},[t.NOT_WEB?a("div",{staticClass:"window-buttons",staticStyle:{"-webkit-app-region":"no-drag"}},[a("Icon",{staticClass:"window-button",staticStyle:{color:"#ed4014"},attrs:{type:"md-power"},on:{click:t.closeWindow}}),t._v(" "),a("Icon",{staticClass:"window-button",staticStyle:{color:"#19be6b"},attrs:{type:"md-browsers"},on:{click:t.maximizeWindow}}),t._v(" "),a("Icon",{staticClass:"window-button",staticStyle:{color:"#ff9900"},attrs:{type:"md-remove"},on:{click:t.minimizeWindow}})],1):t._e(),t._v(" "),a("MenuItem",{staticClass:"user-large",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"6"}},[a("Dropdown",{attrs:{transfer:!0}},[a("router-link",{attrs:{href:"javascript:void(0)",to:"/home/user/"+t.username}},[a("m-avatar",{attrs:{avatar:t.avatar,size:1}}),t._v(" "),t.hasNewNt?a("Badge",{staticStyle:{margin:"5px"},attrs:{dot:""}}):t._e(),t._v("\n          "+t._s(t.username)+"\n          "),a("Icon",{attrs:{type:"ios-arrow-down"}})],1),t._v(" "),a("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[a("router-link",{attrs:{to:"/home/user/"+t.username}},[a("DropdownItem",[t._v("\n              我的信息\n            ")])],1),t._v(" "),a("router-link",{attrs:{to:"/home/star"}},[a("DropdownItem",[t._v("我的收藏")])],1),t._v(" "),a("router-link",{attrs:{to:"/home/notifications"}},[a("DropdownItem",[t._v("\n              消息通知\n              "),t.hasNewNt?a("Badge",{staticStyle:{margin:"5px"},attrs:{dot:""}}):t._e()],1)],1),t._v(" "),a("router-link",{attrs:{to:"/home/edit"}},[a("DropdownItem",[t._v("\n              账号设置\n            ")])],1),t._v(" "),a("router-link",{attrs:{to:"/welcome"},nativeOn:{click:function(e){return t.logout(e)}}},[a("DropdownItem",[t._v("\n              退出登录\n            ")])],1)],1)],1)],1),t._v(" "),a("MenuItem",{staticClass:"user-small",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"0",to:"/home/user/"+t.username}},[a("m-avatar",{attrs:{avatar:t.avatar,size:1}}),t._v(" "),t.hasNewNt?a("Badge",{staticStyle:{position:"fixed",left:"43px",bottom:"40px"},attrs:{dot:""}}):t._e()],1),t._v(" "),a("MenuItem",{staticClass:"menu-item",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"1",to:"/home/home"}},[a("Icon",{attrs:{type:"ios-home"}}),t._v("\n      主页\n    ")],1),t._v(" "),a("MenuItem",{staticClass:"menu-item",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"2",to:"/home/groups"}},[a("Icon",{attrs:{type:"ios-people"}}),t._v("\n      小组\n    ")],1),t._v(" "),a("MenuItem",{staticClass:"menu-item",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"3",to:"/home/new-post"}},[a("Icon",{attrs:{type:"ios-paper"}}),t._v("\n      发帖\n    ")],1),t._v(" "),a("MenuItem",{staticClass:"menu-item",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"4",to:"/home/wiki"}},[a("Icon",{attrs:{type:"ios-book"}}),t._v("\n      Wiki\n    ")],1),t._v(" "),a("MenuItem",{staticClass:"menu-item search-button",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{name:"5",to:"/home/search"}},[a("Icon",{attrs:{type:"ios-search"}}),t._v("\n      搜索\n    ")],1),t._v(" "),a("Input",{staticClass:"search-bar",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{suffix:"ios-search",placeholder:"搜索"},on:{"on-enter":function(){return t.search()}},model:{value:t.searchStr,callback:function(e){t.searchStr=e},expression:"searchStr"}})],1)],1)},[],!1,null,"0065ae2a",null).exports},data:()=>({hasNewNt:!1}),methods:{},mounted(){this.$http.post("/user/find/newNt",{username:this.getCurrentUser().username}).then(t=>{"error"!==t.data&&(this.hasNewNt=t.data.newApplyNt||t.data.newResultNt||t.data.newReplyNt)})}},i=(a(98),Object(o.a)(r,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"layout"}},[a("side-bar",{attrs:{id:"nav",hasNewNt:t.hasNewNt}}),t._v(" "),a("router-view",{attrs:{id:"panel"},on:{newNtChange:function(e){t.hasNewNt=e}}})],1)},[],!1,null,"3e0d52ec",null));e.default=i.exports},78:function(t,e,a){var n=a(97);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(8).default)("d2cbef26",n,!0,{})},79:function(t,e,a){var n=a(99);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(8).default)("3d93d87d",n,!0,{})},96:function(t,e,a){"use strict";var n=a(78);a.n(n).a},97:function(t,e,a){(t.exports=a(7)(!1)).push([t.i,".search-button[data-v-0065ae2a],.user-small[data-v-0065ae2a]{display:none}.user-large[data-v-0065ae2a]{display:inline-block}.window-buttons[data-v-0065ae2a]{float:right;width:30px;line-height:1.5}.window-buttons .window-button[data-v-0065ae2a]{cursor:pointer;transition:opacity .2s,text-shadow .2s}.window-buttons .window-button[data-v-0065ae2a]:hover{opacity:.8;text-shadow:0 0 1px gray}.letter-avatar[data-v-0065ae2a]{margin-right:5px;background-color:#fde3cf;font-size:16px;color:#f56a00}.search-bar[data-v-0065ae2a]{margin-left:1rem;width:calc(100vw - 550px - 5rem);max-width:500px}@media screen and (max-width:768px){.search-bar[data-v-0065ae2a],.window-buttons[data-v-0065ae2a]{display:none}.menu-item[data-v-0065ae2a]{width:calc((100vw - 65px) / 5)}.search-button[data-v-0065ae2a]{display:inline-block}.user-large[data-v-0065ae2a]{display:none}.user-small[data-v-0065ae2a]{display:inline-block}.menu[data-v-0065ae2a]{overflow:hidden;width:100vw}}",""])},98:function(t,e,a){"use strict";var n=a(79);a.n(n).a},99:function(t,e,a){(t.exports=a(7)(!1)).push([t.i,"#layout[data-v-3e0d52ec],#nav[data-v-3e0d52ec],#panel[data-v-3e0d52ec],#putup-menu[data-v-3e0d52ec]{margin:0;padding:0}#layout[data-v-3e0d52ec]{overflow:hidden}#nav[data-v-3e0d52ec]{display:block;position:relative;margin-bottom:5px;box-shadow:0 0 10px #000;z-index:auto}#panel[data-v-3e0d52ec]{position:relative;height:calc(100vh - 70px);overflow:auto}",""])}}]);