/*! modernizr 3.7.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-flexbox-flexboxtweener-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(e,n){return!!~(""+e).indexOf(n)}function s(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):w?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function i(){var e=n.body;return e||(e=s(w?"svg":"body"),e.fake=!0),e}function l(e,t,r,o){var l,a,f,u,d="modernizr",c=s("div"),p=i();if(parseInt(r,10))for(;r--;)f=s("div"),f.id=o?o[r]:d+(r+1),c.appendChild(f);return l=s("style"),l.type="text/css",l.id="s"+d,(p.fake?p:c).appendChild(l),p.appendChild(c),l.styleSheet?l.styleSheet.cssText=e:l.appendChild(n.createTextNode(e)),c.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",u=x.style.overflow,x.style.overflow="hidden",x.appendChild(p)),a=t(c,e),p.fake?(p.parentNode.removeChild(p),x.style.overflow=u,x.offsetHeight):c.parentNode.removeChild(c),!!a}function a(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function f(n,t,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,n,t);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){var i=s.error?"error":"log";s[i].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&n.currentStyle&&n.currentStyle[r];return o}function u(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(a(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+a(n[o])+":"+r+")");return s=s.join(" or "),l("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"===f(e,null,"position")})}return t}function d(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function c(e,n,i,l){function a(){c&&(delete P.style,delete P.modElem)}if(l=!r(l,"undefined")&&l,!r(i,"undefined")){var f=u(e,i);if(!r(f,"undefined"))return f}for(var c,p,m,y,h,v=["modernizr","tspan","samp"];!P.style&&v.length;)c=!0,P.modElem=s(v.shift()),P.style=P.modElem.style;for(m=e.length,p=0;p<m;p++)if(y=e[p],h=P.style[y],o(y,"-")&&(y=d(y)),P.style[y]!==t){if(l||r(i,"undefined"))return a(),"pfx"!==n||y;try{P.style[y]=i}catch(e){}if(P.style[y]!==h)return a(),"pfx"!==n||y}return a(),!1}function p(e,n){return function(){return e.apply(n,arguments)}}function m(e,n,t){var o;for(var s in e)if(e[s]in n)return!1===t?e[s]:(o=n[e[s]],r(o,"function")?p(o,t||n):o);return!1}function y(e,n,t,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),l=(e+" "+_.join(i+" ")+i).split(" ");return r(n,"string")||r(n,"undefined")?c(l,n,o,s):(l=(e+" "+z.join(i+" ")+i).split(" "),m(l,n,t))}function h(e,n,r){return y(e,t,t,n,r)}var v=[],g={_version:"3.7.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){v.push({name:e,fn:n,options:t})},addAsyncTest:function(e){v.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=g,Modernizr=new Modernizr;var C=[],x=n.documentElement,w="svg"===x.nodeName.toLowerCase(),S="Moz O ms Webkit",_=g._config.usePrefixes?S.split(" "):[];g._cssomPrefixes=_;var b={elem:s("modernizr")};Modernizr._q.push(function(){delete b.elem});var P={style:b.elem.style};Modernizr._q.unshift(function(){delete P.style});var z=g._config.usePrefixes?S.toLowerCase().split(" "):[];g._domPrefixes=z,g.testAllProps=y,g.testAllProps=h,Modernizr.addTest("flexbox",h("flexBasis","1px",!0)),Modernizr.addTest("flexboxtweener",h("flexAlign","end",!0)),function(){var e,n,t,o,s,i,l;for(var a in v)if(v.hasOwnProperty(a)){if(e=[],n=v[a],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)i=e[s],l=i.split("."),1===l.length?Modernizr[l[0]]=o:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=o),C.push((o?"":"no-")+l.join("-"))}}(),function(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(w&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(e.length>0&&(n+=" "+t+e.join(" "+t)),w?x.className.baseVal=n:x.className=n)}(C),delete g.addTest,delete g.addAsyncTest;for(var E=0;E<Modernizr._q.length;E++)Modernizr._q[E]();e.Modernizr=Modernizr}(window,document);
