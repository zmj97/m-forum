(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(t,e,a){"use strict";var s=a(78);a.n(s).a},101:function(t,e,a){(t.exports=a(6)(!1)).push([t.i,"#content[data-v-1a42a700],#detail[data-v-1a42a700],#header[data-v-1a42a700],#new-reply[data-v-1a42a700],#replys[data-v-1a42a700]{padding:1rem;margin:0}#fix-menu[data-v-1a42a700]{position:fixed;width:25px;bottom:10%;right:1rem;font-size:1.5rem;color:#19be6b;z-index:1999}#fix-menu a[data-v-1a42a700]{color:#19be6b}#detail[data-v-1a42a700]{position:relative;font-size:.8rem;line-height:20px}#detail .info[data-v-1a42a700]{margin-top:-40px}#detail .info-left[data-v-1a42a700]{position:absolute;left:70px}#detail .username[data-v-1a42a700]{margin-top:.6rem;font-size:1rem;font-weight:700}#detail .info-right[data-v-1a42a700]{position:absolute;right:1rem;color:#999}#header[data-v-1a42a700]{margin-top:1rem;text-align:center}#content[data-v-1a42a700]{overflow-x:auto}#new-reply[data-v-1a42a700]{background-color:#eee}.no-reply[data-v-1a42a700]{border-top:2px dotted #bbb;padding:3rem 0;font-size:1rem;text-align:center}@media screen and (max-width:60rem){#header[data-v-1a42a700]{top:260px;width:100%}#header .buttons[data-v-1a42a700]{top:260px}#fix-menu[data-v-1a42a700]{font-size:2rem;line-height:1.5}}@media screen and (max-width:40rem){#top[data-v-1a42a700]{height:0}#header[data-v-1a42a700]{position:static;width:auto}#detail[data-v-1a42a700]{margin-top:0}}.fade-enter-active[data-v-1a42a700],.fade-leave-active[data-v-1a42a700]{transition:opacity .2s}.fade-enter[data-v-1a42a700],.fade-leave-to[data-v-1a42a700]{opacity:0}",""])},72:function(t,e,a){"use strict";a.r(e);var s=a(12),r={name:"ReplyItem",props:["replyData","index","postId","title"],data:()=>({avatar:null,showReplyPanel:!1,showNewFirst:!0,replyContent:""}),filters:{timeFilter(t){const e=new Date(t),a=new Date;return e.getDate()===a.getDate()&&e.getMonth()===a.getMonth()&&e.getYear()===a.getYear()?"今天"+e.toLocaleString().split(" ")[1]:e.getDate()+1===a.getDate()&&e.getMonth()===a.getMonth()&&e.getYear()===a.getYear()?"昨天"+e.toLocaleString().split(" ")[1]:e.toLocaleString()}},computed:{convertedContent(){let t=s.mavonEditor.getMarkdownIt().render(this.replyData.content),e=t.indexOf("<img src=");for(;-1!==e;)e=(t=t.slice(0,e+5)+'style="display: block;max-width: 100%;" '+t.slice(e+5)).indexOf("<img src=");return t}},methods:{getAvatar(){this.getUserData(this.replyData.username,t=>{this.avatar=t.avatar})},reply(){var t={username:this.getCurrentUser().username,time:new Date,content:this.replyContent};this.$http.post("/post/create/reply-to-reply",{_id:this.postId,title:this.title,username:this.replyData.username,replyIndex:this.index,reply:t}).then(e=>{"success"===e.data?(this.$Message.success("评论成功！"),!this.showNewFirst&&this.changeOrder(),this.replyData.replys.unshift(t),this.replyContent="",setTimeout(()=>{var t="reply-"+this.index;window.location.hash="#"+t,this.hintReply(t,5)},0)):this.$Message.error("数据库连接错误!")}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},changeOrder(){this.replyData.replys.reverse(),this.showNewFirst=!this.showNewFirst},deleteReply(){this.$http.post("/post/delete/reply",{_id:this.postId,index:this.index}).then(t=>{"success"===t.data?(this.$Message.success("删除成功！"),this.$emit("removeReply")):this.$Message.error("数据库连接错误!")}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},deleteReplyInReply(t,e){this.$http.post("/post/delete/reply-to-reply",{_id:this.postId,index:this.index,reply:t}).then(t=>{"success"===t.data?(this.$Message.success("删除成功！"),this.replyData.replys.splice(e,1)):this.$Message.error("数据库连接错误!")}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})}},watch:{postId(){this.getAvatar()}},mounted(){this.replyData.replys.reverse(),this.getAvatar()}},i=(a(96),a(3)),o=Object(i.a)(r,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticClass:"reply-item"},[a("router-link",{attrs:{to:"/home/user/"+t.replyData.username}},[a("m-avatar",{staticClass:"reply-avatar",attrs:{avatar:t.avatar,size:2}})],1),t._v(" "),a("h4",[a("router-link",{attrs:{to:"/home/user/"+t.replyData.username}},[t._v("\n      "+t._s(t.replyData.username)+"\n    ")])],1),t._v(" "),a("div",{staticClass:"content-list",domProps:{innerHTML:t._s(t.convertedContent)}}),t._v(" "),a("p",{staticClass:"little-gray"},[t._v("\n    回复于"+t._s(t._f("timeFilter")(t.replyData.time))+"\n    "),t._v(" "),a("a",{staticStyle:{float:"right"},on:{click:function(){t.showReplyPanel=!t.showReplyPanel}}},[t._v("回复("+t._s(t.replyData.replys.length)+")")]),t._v(" "),t.replyData.username===t.getCurrentUser().username?a("a",{staticClass:"delete-link",on:{click:t.deleteReply}},[t._v("删除")]):t._e()]),t._v(" "),a("span",{staticClass:"little-gray floor-right"},[t._v(t._s(t.index+1)+"楼")]),t._v(" "),a("transition",{attrs:{name:"fade"}},[t.showReplyPanel?a("div",{staticClass:"reply-panel"},[0<t.replyData.replys.length?a("a",{on:{click:function(){return t.changeOrder()}}},[t.showNewFirst?a("span",[t._v("最早在前")]):a("span",[t._v("最新在前")])]):t._e(),t._v(" "),t._l(t.replyData.replys,function(e,s){return a("div",{key:s,staticClass:"reply-to-reply-item"},[a("router-link",{attrs:{to:"/home/user/"+e.username}},[t._v("\n          "+t._s(e.username)+"\n        ")]),t._v(" "),a("span",{staticStyle:{margin:"0 5px"}},[t._v(" : ")]),t._v(" "),t._v("\n        "+t._s(e.content)+"\n        "),t._v(" "),a("p",{staticClass:"little-gray"},[t._v("\n          "+t._s(t._f("timeFilter")(e.time))+"\n          "),t._v(" "),e.username===t.getCurrentUser().username?a("a",{staticClass:"delete-link",on:{click:function(){return t.deleteReplyInReply(e,s)}}},[t._v("删除")]):t._e()])],1)}),t._v(" "),a("Input",{staticClass:"input-margin-top",attrs:{placeholder:"回复这一楼"},model:{value:t.replyContent,callback:function(e){t.replyContent=e},expression:"replyContent"}}),t._v(" "),a("Button",{staticClass:"reply-button",attrs:{type:"success"},on:{click:function(){return t.reply()}}},[t._v("回复")])],2):t._e()])],1)},[],!1,null,"56a4cb29",null).exports,n={name:"NewReply",props:["_id","username","title"],data:()=>({value:"你说得对",imgFiles:{}}),methods:{fullScreenMdEditor(t){return-1===this.$route.matched[1].path.indexOf("/home/home")?void(document.getElementById("md-editor").style.zIndex=t?"2000":"500"):void(t?(document.getElementById("md-editor").style.top="60px",document.getElementById("md-editor").style.height="auto",document.getElementById("md-editor").style.zIndex="2000",document.getElementById("main").style.overflow="hidden"):(document.getElementById("md-editor").style.top="0",document.getElementById("md-editor").style.height="500px",document.getElementById("md-editor").style.zIndex="500",document.getElementById("main").style.overflow="auto"))},$imgAdd(t,e){this.imgFiles[t]=e},$imgDel(t){delete this.imgFiles[t]},uploadReply(){this.$http.post("/statics/upload",this.imgFiles).then(t=>{t.data.forEach(t=>{this.$refs.md.$img2Url(t[0],t[1])});let e={username:this.$store.state.Users.currentUser.username,time:new Date,content:this.value,replys:[]};this.$http.post("/post/create/reply",{_id:this._id,title:this.title,username:this.username,reply:e}).then(t=>{"success"===t.data?(this.$Message.success("回复成功！"),this.$emit("appendReply",e)):this.$Message.error("回复失败！")}).catch(t=>{this.$Message.error("回复失败！"),console.log(t)})})}}},l=(a(98),{name:"PostPart",props:["postData"],inject:["reload"],data(){return{avatar:null,currentUser:this.$store.state.Users.currentUser.username,joinedGroups:[],modalDelete:!1,postDataFinal:this.postData,showFixMenu:!0,stared:!1,stars:[],showBack:!1}},filters:{timeFilter(t){var e=new Date(t),a=new Date;return e.getDate()===a.getDate()&&e.getMonth()===a.getMonth()&&e.getYear()===a.getYear()?"今天"+e.toLocaleString().split(" ")[1]:e.getDate()+1===a.getDate()&&e.getMonth()===a.getMonth()&&e.getYear()===a.getYear()?"昨天"+e.toLocaleString().split(" ")[1]:e.toLocaleString()}},components:{ReplyItem:o,NewReply:Object(i.a)(n,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Button",{attrs:{type:"success"},on:{click:t.uploadReply}},[t._v("提交回复")]),t._v(" "),a("mathjax-toolbar",{attrs:{contentId:"md-editor"}}),t._v(" "),a("mavon-editor",{ref:"md",staticStyle:{"z-index":"500"},attrs:{id:"md-editor",ishljs:!0,scrollStyle:!0,autofocus:!1},on:{imgAdd:t.$imgAdd,imgDel:t.$imgDel,fullScreen:t.fullScreenMdEditor},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)},[],!1,null,"4af525fa",null).exports},computed:{replysCount(){return this.postDataFinal.replys.length},convertedContent(){let t=s.mavonEditor.getMarkdownIt().render(this.postDataFinal.content),e=t.indexOf("<img src=");for(;-1!==e;)e=(t=t.slice(0,e+5)+'style="display: block;max-width: 100%;" '+t.slice(e+5)).indexOf("<img src=");return t}},methods:{inGroup(t){return!t||this.joinedGroups.some(function(e){return t===e})},getAvatar(){this.getUserData(this.postDataFinal.username,t=>{this.avatar=t.avatar})},getStars(){this.$http.post("/user/find/stars",{username:this.currentUser}).then(t=>{"error"===t.data?this.$Message.error("数据库连接失败"):(this.stars=t.data.stars.map(t=>t.id),this.stared=this.stars.includes(this.postDataFinal._id))}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},backTop(){let t,e;t=0,this.$route.query.postId?e=document.getElementById("panel"):"/home/home"===this.$route.path?768>document.body.clientWidth?(t=document.getElementById("list").scrollHeight,e=document.getElementById("panel")):e=document.getElementById("main"):e=document.getElementsByClassName("post")[0];const a=(t-e.scrollTop)/10,s=setInterval(()=>{var r=Math.abs;e.scrollTop+=a,r(e.scrollTop-t)<=r(a/2)&&clearInterval(s)},20)},starPost(){this.$http.post("/user/create/star",{username:this.currentUser,id:this.postDataFinal._id,title:this.postDataFinal.title,abstract:this.postDataFinal.abstract?this.postDataFinal.abstract:100<this.postDataFinal.content.length?this.postDataFinal.content.slice(0,100)+"...":this.postDataFinal.content}).then(t=>{"success"===t.data?(this.$Message.success("收藏成功"),this.getStars()):this.$Message.error("收藏失败")}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},unstarPost(){this.$http.post("/user/delete/star",{username:this.currentUser,id:this.postDataFinal._id}).then(t=>{"success"===t.data?(this.$Message.success("取消收藏成功"),this.getStars()):this.$Message.error("取消收藏失败")}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！")})},okDelete(){this.$http.post("/post/delete",{_id:this.postDataFinal._id}).then(t=>{"success"===t.data?(this.$Message.success("删除成功"),this.reload()):this.$Message.error("删除失败")})},goBack(){this.$router.back(-1)},appendDataToReply(){let t="reply-"+this.postDataFinal.replys.length;this.reload(),setTimeout(()=>{window.location.hash="#"+t,this.hintReply(t,5)},100)},postNotExist(){this.$Message.error("该帖子不存在！"),this.$router.push("/home")},scrollListener(){if(!(768<document.body.clientWidth)&&document.getElementById("list")){let t=document.getElementById("panel").scrollTop-document.getElementById("list").scrollHeight+300;this.showFixMenu&&0>t?this.showFixMenu=!1:!this.showFixMenu&&0<t&&(this.showFixMenu=!0)}},resizeListener(){768<document.body.clientWidth?this.showFixMenu=!0:void 0===this.$route.query.postId&&this.scrollListener()}},watch:{postData(){setTimeout(()=>{this.getAvatar()}),void 0===this.$route.query.postId&&(this.postDataFinal=this.postData),this.stared=this.stars.includes(this.postDataFinal._id)}},mounted(){void 0===this.postDataFinal&&void 0===this.$route.query.postId?this.postNotExist():void 0===this.$route.query.postId?(this.getAvatar(),this.getStars()):(this.showBack=!0,this.getJoinedGroupsNames(this.getCurrentUser().username,this.joinedGroups),this.$http.post("/post/find/byId",{_id:[this.$route.query.postId]}).then(t=>{"empty"===t.data?this.postNotExist():"error"===t.data?(this.$Message.error("数据库连接错误!"),this.$router.push("/home")):(!this.inGroup(t.data[0].group)&&(this.$Message.error("无权查看！"),this.$router.push("/home")),this.postDataFinal=t.data[0],this.getAvatar(),this.getStars(),this.$route.query.replyIndex&&setTimeout(()=>{var t="reply-"+this.$route.query.replyIndex;window.location.hash="#"+t,this.hintReply(t,5)},0))}).catch(t=>{console.error(t),this.$Message.error("网络连接错误！"),this.$router.push("/home")})),this.scrollListener(),window.addEventListener("mousewheel",this.scrollListener,!1),window.addEventListener("touchmove",this.scrollListener,!1),window.addEventListener("resize",this.resizeListener,!1)},destroyed(){window.removeEventListener("mousewheel",this.scrollListener,!1),window.removeEventListener("touchmove",this.scrollListener,!1),window.removeEventListener("resize",this.resizeListener,!1)}}),d=(a(100),Object(i.a)(l,function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.postDataFinal?a("div",{staticStyle:{overflow:"auto"}},[a("div",{attrs:{id:"detail"}},[a("router-link",{attrs:{to:"/home/user/"+t.postDataFinal.username}},[a("m-avatar",{attrs:{avatar:t.avatar,size:3}})],1),t._v(" "),a("div",{staticClass:"info"},[a("router-link",{attrs:{to:"/home/user/"+t.postDataFinal.username}},[a("span",{staticClass:"username info-left"},[t._v(t._s(t.postDataFinal.username))])]),t._v(" "),a("span",{staticClass:"info-right"},[t._v("编辑于"+t._s(t._f("timeFilter")(t.postDataFinal.time)))]),t._v(" "),a("br"),t._v(" "),a("span",{staticClass:"info-right"},[t._v("回复 "+t._s(t.replysCount))])],1)],1),t._v(" "),a("h1",{attrs:{id:"header"}},[t._v(t._s(t.postDataFinal.title))]),t._v(" "),a("div",{staticStyle:{"text-align":"center"}},[t.postDataFinal.abstract?a("div",[t._v("\n      "+t._s(t.postDataFinal.abstract)+"\n    ")]):t._e(),t._v(" "),t.postDataFinal.group?a("router-link",{attrs:{to:"/home/group/"+t.postDataFinal.group}},[a("Tag",{staticClass:"group",attrs:{color:"success"}},[t._v(t._s(t.postDataFinal.group))]),t._v(" "),a("br")],1):t._e(),t._v(" "),0<t.postDataFinal.tags.length?a("div",t._l(t.postDataFinal.tags,function(e){return a("Tag",{key:e,staticStyle:{margin:"5px"},attrs:{color:"blue"}},[t._v("\n        "+t._s(e)+"\n      ")])}),1):t._e()],1),t._v(" "),a("article",{attrs:{id:"content"},domProps:{innerHTML:t._s(t.convertedContent)}}),t._v(" "),0<t.postDataFinal.replys.length?a("section",{attrs:{id:"replys"}},t._l(t.postDataFinal.replys,function(e,s){return a("reply-item",{key:s,attrs:{replyData:e,index:s,id:"reply-"+s,postId:t.postDataFinal._id,title:t.postDataFinal.title},on:{removeReply:function(){return t.postDataFinal.replys.splice(s,1)}}})}),1):a("p",{staticClass:"no-reply"},[t._v("快来当第一个回复的人吧！")]),t._v(" "),a("section",{attrs:{id:"new-reply"}},[a("new-reply",{attrs:{_id:t.postDataFinal._id,title:t.postDataFinal.title,username:t.postDataFinal.username},on:{appendReply:t.appendDataToReply}})],1),t._v(" "),a("transition",{attrs:{name:"fade"}},[t.showFixMenu?a("div",{attrs:{id:"fix-menu"}},[a("a",{on:{click:t.backTop}},[a("Icon",{attrs:{type:"ios-arrow-up"}})],1),t._v(" "),t.stared?a("Icon",{staticStyle:{cursor:"pointer"},attrs:{type:"md-star"},on:{click:t.unstarPost}}):a("Icon",{staticStyle:{cursor:"pointer"},attrs:{type:"md-star-outline"},on:{click:t.starPost}}),t._v(" "),a("a",{attrs:{href:"#new-reply"}},[a("Icon",{attrs:{type:"ios-text"}})],1),t._v(" "),t.currentUser===t.postDataFinal.username?a("Icon",{staticStyle:{cursor:"pointer",color:"#ed4014"},attrs:{type:"md-trash"},on:{click:function(){t.modalDelete=!0}}}):t._e(),t._v(" "),t.showBack?a("Icon",{staticStyle:{cursor:"pointer"},attrs:{type:"md-arrow-back"},on:{click:t.goBack}}):t._e()],1):t._e()]),t._v(" "),a("Modal",{attrs:{title:"删除帖子",zIndex:5e3},on:{"on-ok":t.okDelete},model:{value:t.modalDelete,callback:function(e){t.modalDelete=e},expression:"modalDelete"}},[a("p",[t._v("确定要删除这篇帖子么？")])])],1):t._e()},[],!1,null,"1a42a700",null));e.default=d.exports},76:function(t,e,a){var s=a(97);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);(0,a(7).default)("feacffa8",s,!0,{})},77:function(t,e,a){var s=a(99);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);(0,a(7).default)("a1277de8",s,!0,{})},78:function(t,e,a){var s=a(101);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);(0,a(7).default)("59a19780",s,!0,{})},96:function(t,e,a){"use strict";var s=a(76);a.n(s).a},97:function(t,e,a){(t.exports=a(6)(!1)).push([t.i,".reply-item[data-v-56a4cb29]{position:relative;padding:1rem;padding-left:60px;border-top:2px solid #eee;overflow:hidden}.reply-avatar[data-v-56a4cb29]{float:left;margin-left:-50px}.little-gray[data-v-56a4cb29]{margin-top:10px;font-size:.8rem;color:#999}.floor-right[data-v-56a4cb29]{position:absolute;top:1rem;right:1rem;letter-spacing:2px}.delete-link[data-v-56a4cb29]{float:right;margin-right:10px;color:#ed4014;transition:opacity .2s}.delete-link[data-v-56a4cb29]:hover{opacity:.8}.reply-panel[data-v-56a4cb29]{background-color:#eee;margin-top:1rem;padding:1rem;overflow:hidden}.reply-panel .reply-button[data-v-56a4cb29]{float:right;margin-top:1rem}.reply-to-reply-item[data-v-56a4cb29]{padding:1rem 0;border-bottom:1px solid #ddd}.input-margin-top[data-v-56a4cb29]{margin-top:2rem}.fade-enter-active[data-v-56a4cb29],.fade-leave-active[data-v-56a4cb29]{transition:opacity .2s}.fade-enter[data-v-56a4cb29],.fade-leave-to[data-v-56a4cb29]{opacity:0}",""])},98:function(t,e,a){"use strict";var s=a(77);a.n(s).a},99:function(t,e,a){(t.exports=a(6)(!1)).push([t.i,"#md-editor[data-v-4af525fa]{margin-top:5px;height:auto}",""])}}]);