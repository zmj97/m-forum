(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{102:function(e,t,a){"use strict";a.r(t);var r={name:"EditPanel",data(){return{username:this.getCurrentUser().username,showCropper:!1,formItem:{avatar:null,email:"",telephone:null,gender:null}}},inject:["reload"],methods:{inputImg(e){this.$http.post("/statics/upload-avatar",{username:this.username,_name:this.username+".png",miniurl:e}).then(e=>{this.formItem.avatar=e.data,this.submitChange()}).catch(e=>{console.error(e),this.$Message.error("修改头像失败！")})},clickChangeButton(){document.getElementById("inputFile").click()},submitChange(){this.$http.post("/user/update/info",{username:this.username,formdata:this.formItem}).then(e=>{"success"===e.data?(this.$router.push("/home/user/"+this.username),location.reload(),alert("修改成功")):this.$Message.error("修改失败")})},cancel(){this.$router.go(-1)}},mounted(){this.getUserData(this.username,e=>{this.formItem.avatar=e.avatar,this.formItem.email=e.email,this.formItem.telephone=e.telephone,this.formItem.gender=e.gender})}},o=(a(83),a(1)),n=Object(o.a)(r,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticStyle:{overflow:"auto"}},[a("m-avatar",{staticClass:"avatar",attrs:{avatar:e.formItem.avatar,size:3}}),e._v(" "),a("Button",{staticClass:"change-button",on:{click:function(){e.showCropper=!0}}},[e._v("修改头像")]),e._v(" "),a("avatar-cropper",{on:{ok:e.inputImg},model:{value:e.showCropper,callback:function(t){e.showCropper=t},expression:"showCropper"}}),e._v(" "),a("Form",{attrs:{model:e.formItem,"label-width":80,id:"edit-form"}},[a("FormItem",{attrs:{label:"用户名"}},[a("Input",{attrs:{value:e.username,disabled:""}})],1),e._v(" "),a("FormItem",{attrs:{label:"邮箱"}},[a("Input",{attrs:{placeholder:"请输入邮箱"},model:{value:e.formItem.email,callback:function(t){e.$set(e.formItem,"email",t)},expression:"formItem.email"}})],1),e._v(" "),a("FormItem",{attrs:{label:"手机"}},[a("Input",{attrs:{placeholder:"请输入手机号"},model:{value:e.formItem.telephone,callback:function(t){e.$set(e.formItem,"telephone",t)},expression:"formItem.telephone"}})],1),e._v(" "),a("FormItem",{attrs:{label:"性别"}},[a("RadioGroup",{model:{value:e.formItem.gender,callback:function(t){e.$set(e.formItem,"gender",t)},expression:"formItem.gender"}},[a("Radio",{attrs:{label:"male"}},[e._v("男")]),e._v(" "),a("Radio",{attrs:{label:"female"}},[e._v("女")])],1)],1),e._v(" "),a("FormItem",{staticStyle:{"text-align":"center"}},[a("Button",{attrs:{type:"primary"},on:{click:e.submitChange}},[e._v("提交")]),e._v(" "),a("Button",{staticStyle:{"margin-left":"1rem"},on:{click:e.cancel}},[e._v("取消")])],1)],1)],1)},[],!1,null,"21c0ebb3",null);t.default=n.exports},55:function(e,t,a){var r=a(84);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,a(5).default)("7f864b0e",r,!0,{})},83:function(e,t,a){"use strict";var r=a(55);a.n(r).a},84:function(e,t,a){(e.exports=a(4)(!1)).push([e.i,".avatar[data-v-21c0ebb3]{position:relative;top:50%;left:50%;margin:5rem 0;transform:scale(3)}.change-button[data-v-21c0ebb3]{position:relative;left:-86px;margin-left:50%;width:126px;height:126px;border:0;border-radius:63px;background-color:#fff;font-size:1rem;font-weight:700;letter-spacing:2px;z-index:3000;opacity:0;transition:opacity .1s linear,color .1s linear}.change-button[data-v-21c0ebb3]:hover{opacity:.5;color:#000}#edit-form[data-v-21c0ebb3]{max-width:500px;margin:1rem auto;padding-right:1rem}",""])}}]);