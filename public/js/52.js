/*! For license information please see 52.js.LICENSE.txt */
(self.webpackChunk=self.webpackChunk||[]).push([[52],{989:(e,t,a)=>{"use strict";a.d(t,{A:()=>o});var n=a(540),l=a(942),r=a.n(l);const o=({children:e,className:t,header:a,subheader:l})=>n.createElement("section",{className:r()("mb-8",t)},a||l?n.createElement("div",{className:"flex flex-wrap mb-4"},a?n.createElement("h2",{className:"text-3xl font-bold"},a):null,l?n.createElement("h2",{className:"text-2xl text-gray-500 ml-4"},l):null):null,e)},52:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>v});var n=a(623),l=a(540),r=a(976);const o=({children:e})=>l.createElement("span",{className:"Skill-module__skill__vGIkf"},e),i={ALL:"all",BACKEND:"backend",CLOUD:"cloud",FRONTEND:"frontend"},c={PHP:{name:"PHP",type:i.BACKEND},LARAVEL:{name:"Laravel",type:i.BACKEND},JAVASCRIPT:{name:"JavaScript",type:i.FRONTEND},TYPESCRIPT:{name:"TypeScript",type:i.FRONTEND},REACT:{name:"React",type:i.FRONTEND},JQUERY:{name:"Jquery",type:i.FRONTEND},SQL:{name:"SQL",type:i.BACKEND},GIT:{name:"Git",type:i.BACKEND},AWS_ECOSYSTEM:{name:"AWS Ecosystem",type:i.CLOUD},JIRA:{name:"Jira",type:i.CLOUD},BITBUCKET:{name:"Bitbucket",type:i.CLOUD},GITHUB:{name:"GitHub",type:i.CLOUD},HTML:{name:"HTML",type:i.FRONTEND},CSS_SCSS:{name:"CSS/SCSS",type:i.FRONTEND},MICROSERVICES:{name:"Microservices",type:i.BACKEND},NODEJS:{name:"Node.js",type:i.BACKEND},COMPOSER:{name:"Composer",type:i.BACKEND},DOCKER:{name:"Docker",type:i.BACKEND},VALET:{name:"Valet",type:i.BACKEND},JAVA:{name:"Java",type:i.BACKEND},C_PLUS_PLUS:{name:"C++",type:i.BACKEND},PYTHON:{name:"Python",type:i.BACKEND},WEBPACK:{name:"Webpack",type:i.FRONTEND}};var s=a(942),m=a.n(s);const d="SkillFilter-module__skillFilter__button--selected__KAqy7",p="SkillFilter-module__skillFilter__button--unselected__RU8hY",u=({selectedType:e,onClick:t,className:a})=>l.createElement("div",{className:m()("SkillFilter-module__skillFilter__ra5JG",a)},Object.values(i).map((a=>l.createElement("button",{key:a,className:m()("SkillFilter-module__skillFilter__button__SAYNc",{[d]:e===a,[p]:e!==a}),onClick:()=>t(a)},a.toUpperCase()))));var g=a(989);const E=()=>{const[e,t]=(0,l.useState)(i.ALL);return l.createElement(g.A,{header:"Skills & Technologies",subheader:l.createElement(u,{selectedType:e,onClick:e=>{t(e)},className:"ml-4"})},l.createElement("div",{className:"flex flex-wrap gap-4"},Object.values(c).map((({name:t,type:a})=>e===i.ALL||e===a?l.createElement(o,{key:t},t):null))))};var y=a(83);const h=()=>{return e=void 0,t=void 0,n=function*(){try{const e=yield y.A.get("https://docs.google.com/document/d/14K7hLjViIuXXpuLgtiFRXHqMCbRjiwqoC5CeOnR1uDg/export?format=pdf",{responseType:"blob"}),t=window.URL.createObjectURL(new Blob([e.data],{type:"application/pdf"})),a=document.createElement("a");a.href=t,a.setAttribute("download","Kennen Lawrence - Resume.pdf"),document.body.appendChild(a),a.click(),a.remove()}catch(e){console.error("Error downloading file",e)}},new((a=void 0)||(a=Promise))((function(l,r){function o(e){try{c(n.next(e))}catch(e){r(e)}}function i(e){try{c(n.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?l(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(o,i)}c((n=n.apply(e,t||[])).next())}));var e,t,a,n},b=()=>l.createElement(g.A,{header:"About Me",className:"bg-white shadow rounded p-8"},l.createElement("p",{className:"mb-4"},"I'm Kennen Lawrence from Denver, CO. I excel in fostering collaborative environments, leading high-impact projects, and aligning technical initiatives with business objectives."),l.createElement("p",null,"My experience spans from launching industry-first tools at A2Z Sync to modernizing legacy codebases. I am procient in engineering strategy and implementation, optimizing performance, enhancing system scalability, and ensuring software reliability. I continuously seek opportunities for growth through industry certications, staying up-to-date with emerging technologies, and leadership training. I continuously strive for excellence both in my professional career and through leadership roles, including my work with Excel Taekwondo."),l.createElement("button",{onClick:h,className:"inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"},"Download My Resume")),N=({children:e,className:t,header:a,subheader:n})=>l.createElement("div",{className:m()("p-4 bg-white shadow rounded",t)},l.createElement("div",{className:"flex flex-row mb-2"},l.createElement("h3",{className:"font-bold text-xl"},a),n?l.createElement("h3",{className:"text-lg text-gray-500 ml-2"},n):null),e),f=[{image:"/images/CompTIA-Security-Plus.png",text:"In-Progress",alt:"Security+ Certification Logo"},{image:"/images/CompTIA-Network-Plus.png",text:"Todo",alt:"Network+ Certification Logo"},{image:"/images/CompTIA-A-Plus.png",text:"Todo",alt:"A+ Certification Logo"}],C=()=>l.createElement(g.A,{header:"Certificates"},l.createElement("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6"},l.createElement(N,{header:"CompTIA",subheader:"- Curiosity-Driven IT Exploration"},l.createElement("div",{className:"grid grid-cols-3 items-center justify-center"},f.map(((e,t)=>l.createElement("div",{key:t,className:"flex flex-col items-center"},l.createElement("img",{src:e.image,alt:e.alt,className:"w-24 h-24 object-contain"}),l.createElement("p",{className:"text-center text-gray-700"},e.text)))))))),v=()=>l.createElement(l.Fragment,null,l.createElement(g.A,{className:"bg-white shadow rounded p-8"},l.createElement("div",{className:"text-center"},l.createElement("h1",{className:"text-4xl font-bold mb-4"},"Innovative Software Engineer & Technical Leader"),l.createElement("p",{className:"text-xl text-gray-700 mb-6"},"Building scalable solutions and fostering collaboration through technology."),l.createElement(r.N_,{to:n.b.PROJECTS,className:"bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"},"View My Work"))),l.createElement(C,null),l.createElement("section",{className:"mb-8"},l.createElement("h2",{className:"text-3xl font-bold mb-4"},"Featured Experience"),l.createElement("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6"},l.createElement("div",{className:"bg-white shadow rounded p-4"},l.createElement("h3",{className:"font-bold text-xl mb-2"},"Amazon Autos Partnership"),l.createElement("p",null,"Played a pivotal role in launching Amazon Autos at A2Z Sync, establishing the company as a market leader.")),l.createElement("div",{className:"bg-white shadow rounded p-4"},l.createElement("h3",{className:"font-bold text-xl mb-2"},"Scalable React Libraries"),l.createElement("p",null,"Designed reusable React components that optimized UI performance, reducing load times by up to 50%.")),l.createElement("div",{className:"bg-white shadow rounded p-4"},l.createElement("h3",{className:"font-bold text-xl mb-2"},"Legacy Code Modernization"),l.createElement("p",null,"Led efforts to refactor and modernize legacy systems, improving maintainability and performance.")))),l.createElement(E,null),l.createElement(b,null))},942:(e,t)=>{var a;!function(){"use strict";var n={}.hasOwnProperty;function l(){for(var e="",t=0;t<arguments.length;t++){var a=arguments[t];a&&(e=o(e,r(a)))}return e}function r(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return l.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var a in e)n.call(e,a)&&e[a]&&(t=o(t,a));return t}function o(e,t){return t?e?e+" "+t:e+t:e}e.exports?(l.default=l,e.exports=l):void 0===(a=function(){return l}.apply(t,[]))||(e.exports=a)}()}}]);
//# sourceMappingURL=52.js.map