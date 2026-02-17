document.addEventListener("DOMContentLoaded",()=>{

/* ================= HAMBURGER ANIMATION ================= */

const hamburger=document.querySelector(".hamburger"),
nav=document.querySelector(".nav"),
navLinks=document.querySelectorAll(".nav a");

if(hamburger){
hamburger.addEventListener("click",()=>{
hamburger.classList.toggle("active");
});
}

if(navLinks.length){
navLinks.forEach(link=>{
link.addEventListener("click",()=>{
if(nav&&nav.classList.contains("open")){
nav.classList.remove("open");
hamburger&&hamburger.classList.remove("active");
}
});
});
}

/* ================= GALLERY BUTTON STATE ================= */

const track=document.querySelector(".gallery-track"),
pages=document.querySelectorAll(".gallery-page"),
prev=document.querySelector(".gallery-nav.prev"),
next=document.querySelector(".gallery-nav.next");

if(track&&pages.length){

let current=0;

const updateButtons=()=>{
prev&&(prev.style.opacity=current===0?.4:1);
next&&(next.style.opacity=current===pages.length-1?.4:1);
};

track.addEventListener("transitionend",()=>{
const matrix=new WebKitCSSMatrix(getComputedStyle(track).transform);
current=Math.round(Math.abs(matrix.m41)/track.offsetWidth);
updateButtons();
});

updateButtons();
}

/* ================= SCROLL PROGRESS BAR ================= */

const progress=document.createElement("div");
progress.style.position="fixed";
progress.style.top="0";
progress.style.left="0";
progress.style.height="2px";
progress.style.width="0%";
progress.style.background="var(--accent)";
progress.style.zIndex="999";
progress.style.transition="width .1s linear";
document.body.appendChild(progress);

window.addEventListener("scroll",()=>{
const h=document.documentElement,
scrolled=(h.scrollTop)/(h.scrollHeight-h.clientHeight);
progress.style.width=(scrolled*100)+"%";
},{passive:true});

/* ================= FADE IN GALLERY ================= */

const gallerySection=document.querySelector(".gallery-section");

if(gallerySection){
gallerySection.style.opacity="0";
gallerySection.style.transition="opacity .8s ease";
const observer=new IntersectionObserver(e=>{
e.forEach(entry=>{
if(entry.isIntersecting){
gallerySection.style.opacity="1";
}
});
},{threshold:.2});
observer.observe(gallerySection);
}

/* ================= REDUCED MOTION SUPPORT ================= */

if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
document.querySelectorAll("*").forEach(el=>{
el.style.transition="none";
el.style.animation="none";
});
}

});