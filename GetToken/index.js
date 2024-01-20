(function(p,A,U,h,B,C,N,$){"use strict";function b(e){const{metro:{findByProps:c,findByStoreName:a,common:{lodash:{merge:o}}}}=e,n=c("_sendMessage"),{createBotMessage:t}=c("createBotMessage"),r=c("BOT_AVATARS"),{getChannelId:u}=a("SelectedChannelStore");return function(l,s){if(l.channelId??=u(),[null,void 0].includes(l.channelId))throw new Error("No channel id to receive the message into (channelId)");let d=l;if(l.really){typeof s=="object"&&(d=o(d,s));const i=[d,{}];i[0].tts??=!1;for(const m of["allowedMentions","messageReference"])m in i[0]&&(i[1][m]=i[0][m],delete i[0][m]);const k="overwriteSendMessageArg2";return k in i[0]&&(i[1]=i[0][k],delete i[0][k]),n._sendMessage(l.channelId,...i)}return s!==!0&&(d=t(d)),typeof s=="object"&&(d=o(d,s),typeof s.author=="object"&&function(){const i=s.author;typeof i.avatarURL=="string"&&(r.BOT_AVATARS[i.avatar??i.avatarURL]=i.avatarURL,i.avatar??=i.avatarURL,delete i.avatarURL)}()),n.receiveMessage(d.channel_id,d),d}}function v(e,c,a){if(!e?.name||!e?.description)throw new Error(`No name(${e?.name}) or description(${e?.description}) in the passed command (command name: ${e?.name})`);if(e.displayName??=c?.names?.[a]??e.name,e.displayDescription??=c?.names?.[a]??e.description,e.options){if(!Array.isArray(e.options))throw new Error(`Options is not an array (received: ${typeof e.options})`);for(var o=0;o<e.options.length;o++){const t=e.options[o];if(!t?.name||!t?.description)throw new Error(`No name(${t?.name}) or description(${t?.description} in the option with index ${o}`);if(t.displayName??=c?.options?.[o]?.names?.[a]??t.name,t.displayDescription??=c?.options?.[o]?.descriptions?.[a]??t.description,t?.choices){if(!Array.isArray(t?.choices))throw new Error(`Choices is not an array (received: ${typeof t.choices})`);for(var n=0;n<t.choices.length;n++){const r=t.choices[n];if(!r?.name)throw new Error(`No name of choice with index ${n} in option with index ${o}`);r.displayName??=c?.options?.[o]?.choices?.[n]?.names?.[a]??r.name}}}}return e}function E(e){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:27;if(typeof e!="string")throw new Error("Passed chars isn't a string");if(e?.length<=0)throw new Error("Invalid chars length");let a="";for(let o=0;o<c;o++)a+=e[Math.floor(Math.random()*e.length)];return a}const S={getLoading(){return Math.random()<.01?this.aol:this.loadingDiscordSpinner},getFailure(){return Math.random()<.01?this.fuckyoy:this.linuth},getSuccess(){return""},loadingDiscordSpinner:"a:loading:1105495814073229393",aol:"a:aol:1108834296359301161",linuth:":linuth:1110531631409811547",fuckyoy:":fuckyoy:1108360628302782564"},P={command:"https://cdn.discordapp.com/attachments/1099116247364407337/1112129955053187203/command.png"},T="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",M=T.replace("+/","_-");function R(e,c){if(typeof e!="number")throw new Error(`Passed data isn't a number (received: ${typeof e})`);let a="";for(;e>0;)a=(c?M:T).charAt(e%64)+a,e=Math.floor(e/64);return a}const{meta:{resolveSemanticColor:I}}=h.findByProps("colors","meta"),O=h.findByStoreName("ThemeStore"),g=function(){return parseInt(I(O.theme,A.semanticColors.BACKGROUND_SECONDARY).slice(1),16)},f={author:{username:"TokenUtils",avatar:"command",avatarURL:P.command}};let y;function w(){return window.sendMessage?window.sendMessage?.(...arguments):(y||(y=b(vendetta)),y(...arguments))}var _={meta:vendetta.plugin,patches:[],onUnload(){this.patches.forEach(function(e){return e()}),this.patches=[]},onLoad(){var e=this;const c="Copy Token",a=N.before("render",h.findByProps("ScrollView").View,function(o){try{let n=B.findInReactTree(o,function(s){return s.key===".$UserProfileOverflow"});if(!n||!n.props||n.props.sheetKey!=="UserProfileOverflow")return;const t=n.props.content.props;if(t.options.some(function(s){return s?.label===c}))return;const r=h.findByStoreName("UserStore").getCurrentUser()?.id,u=Object.keys(n._owner.stateNode._keyChildMapping).find(function(s){return n._owner.stateNode._keyChildMapping[s]&&s.match(/(?<=\$UserProfile)\d+/)})?.slice?.(13)||r,l=h.findByProps("getToken").getToken();t.options.unshift({isDestructive:!0,label:c,onPress:function(){try{$.showToast(u===r?"Copied your token":`Copied token of ${t.header.title}`),C.setString(u===r?l:[Buffer.from(u).toString("base64").replaceAll("=",""),R(+Date.now()-129384e4,!0),E(M,27)].join(".")),t.hideActionSheet()}catch(s){console.error(s);let d=!1;try{d=a()}catch{d=!1}alert(`[TokenUtils \u2192 context menu patch \u2192 option onPress] failed. Patch ${d?"dis":"en"}abled
`+s.stack)}}})}catch(n){console.error(n);let t=!1;try{t=a()}catch{t=!1}alert(`[TokenUtils \u2192 context menu patch] failed. Patch ${t?"dis":"en"}abled
`+n.stack)}});this.patches.push(a);try{const o={get(n,t){try{const r={...f,interaction:{name:"/token get",user:h.findByStoreName("UserStore").getCurrentUser()}},{getToken:u}=h.findByProps("getToken");w({loggingName:"Token get output message",channelId:t.channel.id,embeds:[{color:g(),type:"rich",title:"Token of the current account",description:`${u()}`}]},r)}catch(r){console.error(r),alert(`There was an error while exeCuting /token get
`+r.stack)}},login(n,t){try{const r={...f,interaction:{name:"/token login",user:h.findByStoreName("UserStore").getCurrentUser()}},u=new Map(n.map(function(l){return[l.name,l]})).get("token").value;try{w({loggingName:"Token login process message",channelId:t.channel.id,embeds:[{color:g(),type:"rich",title:`<${S.getLoading()}> Switching accounts\u2026`}]},r),h.findByProps("login","logout","switchAccountToken").switchAccountToken(u)}catch(l){console.error(l),w({loggingName:"Token login failure message",channelId:t.channel.id,embeds:[{color:g(),type:"rich",title:`<${S.getFailure()}> Failed to switch accounts`,description:`${l.message}`}]},r)}}catch(r){console.error(r),alert(`There was an error while executing /token login
`+r.stack)}}};[v({type:1,inputType:1,applicationId:"-1",execute:o.get,name:"token get",description:"Shows your current user token"}),v({type:1,inputType:1,applicationId:"-1",execute:o.login,name:"token login",description:"Logs into an account using a token",options:[{required:!0,type:3,name:"token",description:"Token of the account to login into"}]})].forEach(function(n){return e.patches.push(U.registerCommand(n))})}catch(o){console.error(o),alert(`There was an error while loading TokenUtils
`+o.stack)}}};return p.EMBED_COLOR=g,p.authorMods=f,p.default=_,Object.defineProperty(p,"__esModule",{value:!0}),p})({},vendetta.ui,vendetta.commands,vendetta.metro,vendetta.utils,vendetta.metro.common.clipboard,vendetta.patcher,vendetta.ui.toasts);
