(this["webpackJsonpwebapp-react"]=this["webpackJsonpwebapp-react"]||[]).push([[0],{79:function(t,n,e){"use strict";e.r(n);var c,i,a,s,r,j,o=e(0),b=e.n(o),l=e(38),d=e.n(l),h=e(15),u=e(2),x=e(3),O=e(39),p=e.n(O),g=e(1),f=x.a.h1(c||(c=Object(u.a)(["\n\n    background: yellow;\n    color:blue;\n"]))),m=function(t){return Object(g.jsx)(g.Fragment,{children:Object(g.jsxs)(f,{children:["testitem's text is: ",t.text," "]})})},v=x.a.div(i||(i=Object(u.a)(["\n\n\tbackground: #3684a8;\n    left: 0;\n\ttop: 0px;\n\theight: 10vh;\n\twidth: 100%;\n\tposition: absolute;\n\n    \n"]))),w=x.a.div(a||(a=Object(u.a)(["\n\n\tbackground-color: #ec622c;\n    left: 0;\n\ttop: 10vh;\n\twidth: 20vw;\n\theight: 90vh;\n\tposition: absolute;\n\n"]))),k=x.a.div(s||(s=Object(u.a)(["\n\n\tbackground: #b9e4a8ef;\n\ttop: 10vh;\n\tleft: 20vw;\n\twidth: 80vw;\n\theight: 90vh;\n\tposition: absolute;\n\n    display: flex;\n    justify-content: center;\n    align-items: center;\n"]))),y=x.a.button(r||(r=Object(u.a)(["\n\n   background: yellow;\n   margin: 20px;\n\n"]))),F=x.a.div(j||(j=Object(u.a)(["\n\n    background: #23686d;\n    padding: 2px;\n    width: 200px;\n    height: 200px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n\n"])));var C,_=function(t){var n=t.initial_state,e=void 0===n?0:n,c=Object(o.useState)(e),i=Object(h.a)(c,2),a=i[0],s=i[1];return Object(g.jsx)(g.Fragment,{children:Object(g.jsxs)(F,{children:[Object(g.jsx)(y,{text:"+",onClick:function(){s(a+1)},children:"+"}),Object(g.jsx)("p",{children:a}),Object(g.jsx)(y,{text:"-",onClick:function(){s(a-1)},children:"-"})]})})},S=x.a.div(C||(C=Object(u.a)(["\n height : 200px;\n width: 200px;\n background:red;\n margin: 10px;\n"]))),E={title:"Testing Main",html:Object(g.jsxs)(g.Fragment,{children:[Object(g.jsx)(_,{initial_state:7}),Object(g.jsx)(m,{}),Object(g.jsx)(m,{data:!0}),Object(g.jsx)(S,{})]})},I={title:"A List of TextItems",html:Object(g.jsxs)(g.Fragment,{children:[Object(g.jsx)(S,{}),"list"]})};var J=function(){var t=Object(o.useState)(E),n=Object(h.a)(t,2),e=n[0],c=n[1],i=Object(o.useRef)();return Object(o.useEffect)((function(){console.log("on mount"),i.current=p.a.connect("http://localhost:3003")})),Object(g.jsxs)(g.Fragment,{children:[Object(g.jsx)(v,{}),Object(g.jsxs)(w,{children:[Object(g.jsx)("button",{onClick:function(){c(E),i.current.emit("main_state","test")},children:E.title}),Object(g.jsx)("button",{onClick:function(){c(I),i.current.emit("main_state","list")},children:I.title})]}),Object(g.jsx)(k,{children:e.html})]})};d.a.render(Object(g.jsx)(b.a.StrictMode,{children:Object(g.jsx)(J,{})}),document.getElementById("root"))}},[[79,1,2]]]);
//# sourceMappingURL=main.ae5f235c.chunk.js.map