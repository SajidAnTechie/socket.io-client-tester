import{$79f4d3a836c3f432f44b3bcf91623c1b$init as e,$7f912fa8d6b13fea068c9f4c87e4971d$init as t}from"./index.c47d8eb6.js";var n,o=(n=e())&&n.__esModule?n.default:n;e(),t();const s=document.querySelector("[add-btn]"),a=document.querySelector("[add-event-input]"),r=document.querySelector("[success-message]"),u=document.querySelector("[add-listener-input]");document.querySelector("[add-event-form]").addEventListener("submit",(async e=>{e.preventDefault();const n=a.value,d=u.value;if([n,d].includes(""))return;r.classList.add("d-none"),t().changeDom(s,"saving",{cursor:"not-allowed",pointerEvents:"none"});const c={event:n,listener:d};200===(await o.post("https://socketapiserver.herokuapp.com/api/event",c)).status&&(t().changeDom(s,"save",{cursor:"pointer",pointerEvents:"auto"}),r.classList.remove("d-none"),a.value="",u.value="")}));
//# sourceMappingURL=add-event.747202bc.js.map