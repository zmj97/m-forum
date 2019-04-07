(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{106:function(t,e,s){"use strict";s.r(e);var a={name:"SearchPanel",components:{PostModal:s(42).a},data:()=>({searchStr:"",tabValue:"posts",posts:[],postsData:[],highlightLeftTagStr:'<span style="font-weight: bold; color: red;">',showPost:!1,postPos:0,groups:[],wikis:[],joinedGroups:[]}),watch:{$route(){this.searchStr=this.$route.query.searchStr,this.getData()}},methods:{inGroup(t){return!t||this.joinedGroups.some(function(e){return t===e})},getData(){this.getPosts(),this.getGroups(),this.getWikis()},getPosts(){this.$http.post("/post/find/search",{searchStr:this.searchStr}).then(t=>{if("error"===t.data)this.$Message.error("数据库连接错误！");else{for(let e=0;e<t.data.length;e++)this.inGroup(t.data[e].group)&&this.postsData.push(t.data[e]);this.posts=[],this.postsData.forEach(t=>{this.posts.push({title:t.title,highlight:this.highlightSearchStr(t)})})}}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},getGroups(){this.$http.post("/group/find/search",{searchStr:this.searchStr}).then(t=>{"error"===t.data?this.$Message.error("数据库连接错误！"):this.groups=t.data}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},getWikis(){this.$http.post("/wiki/find/search",{searchStr:this.searchStr}).then(t=>{"error"===t.data?this.$Message.error("数据库连接错误！"):this.wikis=t.data}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},toWikiPanel(t){this.$router.push({path:"/home/wiki",query:{title:t}})},showPostModal(t){this.postPos=t,this.showPost=!0},miniString(t,e){let s=t.indexOf(e);return t=20<t.length-s-e.length?t.slice(0,s+e.length)+"</span>"+t.slice(s+e.length,s+e.length+20)+"...":t.slice(0,s+e.length)+"</span> "+t.slice(s+e.length),t=10<s?"..."+t.slice(s-10,s)+this.highlightLeftTagStr+t.slice(s):t.slice(0,s)+this.highlightLeftTagStr+t.slice(s)},highlightTitle(t){let e=this.$route.query.searchStr,s=t.indexOf(e);return-1===s?t:t.slice(0,s)+this.highlightLeftTagStr+t.slice(s,s+e.length)+"</span>"+t.slice(s+e.length)},highlightSearchStr(t){let e,s=this.$route.query.searchStr;if(-1!==t.title.indexOf(s))return t.abstract?t.abstract:50<t.content.length?t.content.slice(0,50)+"...":t.content;if(-1!==t.abstract.indexOf(s)){let e=t.abstract.indexOf(s);return t.abstract.slice(0,e)+this.highlightLeftTagStr+t.abstract.slice(e,e+s.length)+"</span>"+t.abstract.slice(e+s.length)}return-1===t.content.indexOf(s)?t.replys.some(t=>-1===t.content.indexOf(s)?t.replys.some(t=>-1!==t.content.indexOf(s)&&(e=t.content,!0)):(e=t.content,!0))?this.miniString(e,s):void 0:this.miniString(t.content,s)}},mounted(){this.getJoinedGroupsNames(this.getCurrentUser().username,this.joinedGroups),this.$route.query.searchStr&&(this.searchStr=this.$route.query.searchStr,this.getData())}},r=(s(91),s(1)),o=Object(r.a)(a,function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticStyle:{overflow:"auto","background-color":"#eee"}},[s("Input",{staticClass:"search-bar",attrs:{clearable:"",suffix:"ios-search",placeholder:"搜索帖子、小组和Wiki..."},on:{"on-enter":t.getData},model:{value:t.searchStr,callback:function(e){t.searchStr=e},expression:"searchStr"}}),t._v(" "),s("Tabs",{staticStyle:{"overflow-y":"auto"},model:{value:t.tabValue,callback:function(e){t.tabValue=e},expression:"tabValue"}},[s("TabPane",{attrs:{label:"帖子",name:"posts"}},[0<t.posts.length?s("div",t._l(t.posts,function(e,a){return s("Card",{key:a,staticClass:"card-panel",attrs:{bordered:!1}},[s("p",{attrs:{slot:"title"},domProps:{innerHTML:t._s(t.highlightTitle(e.title))},slot:"title"}),t._v(" "),s("a",{staticStyle:{float:"right"},attrs:{slot:"extra"},on:{click:function(){return t.showPostModal(a)}},slot:"extra"},[t._v("点击查看")]),t._v(" "),s("p",{domProps:{innerHTML:t._s(e.highlight)}})])}),1):s("p",{staticStyle:{"text-align":"center"}},[t._v("无帖子搜索结果。")])]),t._v(" "),s("TabPane",{attrs:{label:"小组",name:"groups"}},[0<t.groups.length?s("div",t._l(t.groups,function(e){return s("Col",{key:e.name,attrs:{xs:12,sm:6,md:4,lg:3}},[s("router-link",{attrs:{to:"/home/group/"+e.name}},[s("Card",{staticStyle:{margin:"1rem"}},[s("p",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.name))]),t._v(" "),s("p",[s("router-link",{attrs:{to:"/home/user/"+e.leader}},[t._v("\n                  "+t._s(e.leader)+"\n                ")])],1),t._v(" "),s("p",[t._v(t._s(e.intro))])])],1)],1)}),1):s("p",{staticStyle:{"text-align":"center"}},[t._v("无小组搜索结果。")])]),t._v(" "),s("TabPane",{attrs:{label:"Wiki",name:"wikis"}},[0<t.wikis.length?s("CellGroup",{staticClass:"card-panel cell-panel"},t._l(t.wikis,function(e){return s("Cell",{key:e,staticClass:"cell",attrs:{title:e},nativeOn:{click:function(){return t.toWikiPanel(e)}}})}),1):s("p",{staticStyle:{"text-align":"center"}},[t._v("无Wiki搜索结果。")])],1)],1),t._v(" "),s("transition",{attrs:{name:"fade"}},[s("post-modal",{directives:[{name:"show",rawName:"v-show",value:t.showPost,expression:"showPost"}],attrs:{posts:t.postsData,pos:t.postPos},on:{close:function(){t.showPost=!1}}})],1)],1)},[],!1,null,"0e071e42",null);e.default=o.exports},36:function(t,e,s){var a=s(40);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,s(5).default)("408e0e7a",a,!0,{})},39:function(t,e,s){"use strict";var a=s(36);s.n(a).a},40:function(t,e,s){(t.exports=s(4)(!1)).push([t.i,".opacityBackground[data-v-0353f834]{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.5);z-index:1000}.post[data-v-0353f834]{position:absolute;top:5px;right:5px;bottom:5px;left:5px;border-radius:6px;box-shadow:0 0 1px #fff;background-color:#fff;overflow:auto}.button[data-v-0353f834]{position:relative;font-size:3rem;color:#17233d;opacity:.2;transition:opacity .1s linear;cursor:pointer;z-index:3000}.button[data-v-0353f834]:hover{opacity:.7}.close[data-v-0353f834]{position:fixed;top:2%;right:2%}.left[data-v-0353f834]{left:2%}.left[data-v-0353f834],.right[data-v-0353f834]{display:none;position:fixed;top:50%;margin-top:-1.5rem}.right[data-v-0353f834]{right:2%}@media screen and (min-width:768px){.post[data-v-0353f834]{top:2%;right:8%;bottom:2%;left:8%}}@media screen and (min-width:1200px){.left[data-v-0353f834]{left:4%}.close[data-v-0353f834],.right[data-v-0353f834]{right:4%}}",""])},42:function(t,e,s){"use strict";var a={name:"PostModal",components:{PostPart:s(43).default},props:["posts","pos"],data(){return{posCurrent:this.pos}},watch:{pos(){this.posCurrent=this.pos}},methods:{closeModal(){this.$emit("close")}}},r=(s(39),s(1)),o=Object(r.a)(a,function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"opacityBackground"},[t.posts[t.posCurrent]?s("post-part",{staticClass:"post",attrs:{postData:t.posts[t.posCurrent]}}):t._e(),t._v(" "),s("Icon",{staticClass:"button close",staticStyle:{"-webkit-app-region":"no-drag"},attrs:{type:"md-close-circle"},on:{click:t.closeModal}}),t._v(" "),s("Icon",{directives:[{name:"show",rawName:"v-show",value:0!==t.posCurrent,expression:"posCurrent!==0"}],staticClass:"button left",attrs:{type:"md-arrow-dropleft-circle"},on:{click:function(){t.posCurrent--}}}),t._v(" "),s("Icon",{directives:[{name:"show",rawName:"v-show",value:t.posCurrent!==t.posts.length-1,expression:"posCurrent!==posts.length-1"}],staticClass:"button right",attrs:{type:"md-arrow-dropright-circle"},on:{click:function(){t.posCurrent++}}})],1)},[],!1,null,"0353f834",null);e.a=o.exports},59:function(t,e,s){var a=s(92);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,s(5).default)("c0d59b40",a,!0,{})},91:function(t,e,s){"use strict";var a=s(59);s.n(a).a},92:function(t,e,s){(t.exports=s(4)(!1)).push([t.i,".search-bar[data-v-0e071e42]{width:80%;margin:20px;transform:translateX(10%)}.card-panel[data-v-0e071e42]{margin:1rem}.cell-panel[data-v-0e071e42]{background-color:#fff;transition:box-shadow .5s}.cell-panel .cell[data-v-0e071e42]{line-height:5;font-weight:700}.cell-panel[data-v-0e071e42]:hover{box-shadow:0 0 1px gray}@media screen and (min-width:768px){.search-bar[data-v-0e071e42]{display:none}}@media screen and (min-width:800px){.card-panel[data-v-0e071e42]{margin:1rem calc((100vw - 750px)/2)}}.fade-enter-active[data-v-0e071e42],.fade-leave-active[data-v-0e071e42]{transition:opacity .5s}.fade-enter[data-v-0e071e42],.fade-leave-to[data-v-0e071e42]{opacity:0}",""])}}]);