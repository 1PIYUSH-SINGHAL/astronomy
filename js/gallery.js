document.addEventListener("DOMContentLoaded",()=>{

const track=document.getElementById("homeGalleryTrack");
const prevBtn=document.querySelector(".gallery-nav.prev");
const nextBtn=document.querySelector(".gallery-nav.next");

if(!track||!window.ALBUM_DATA)return;

/* ================= GET LATEST 9 ================= */

const latest=[...window.ALBUM_DATA]
.sort((a,b)=>new Date(b.date)-new Date(a.date))
.slice(0,9);

/* ================= BUILD PAGES (3 PER PAGE) ================= */

function chunk(arr,size){
const out=[];
for(let i=0;i<arr.length;i+=size)
out.push(arr.slice(i,i+size));
return out;
}

const pagesData=chunk(latest,3);

/* ================= RENDER ================= */

track.innerHTML=pagesData.map(page=>`
<div class="gallery-page">
${page.map(img=>`
<img src="${img.src}" alt="${img.title}">
`).join("")}
</div>
`).join("");

const pages=[...track.querySelectorAll(".gallery-page")];
if(!pages.length)return;

let index=0,startX=0,currentX=0,isDragging=false;

const clamp=i=>Math.max(0,Math.min(i,pages.length-1));
const update=()=>track.style.transform=`translateX(-${index*100}%)`;

/* ================= BUTTONS ================= */

if(prevBtn)prevBtn.addEventListener("click",()=>{
index=clamp(index-1);
update();
});

if(nextBtn)nextBtn.addEventListener("click",()=>{
index=clamp(index+1);
update();
});

/* ================= KEYBOARD ================= */

document.addEventListener("keydown",e=>{
if(e.key==="ArrowRight"){
index=clamp(index+1);
update();
}
if(e.key==="ArrowLeft"){
index=clamp(index-1);
update();
}
});

/* ================= TOUCH SWIPE ================= */

track.addEventListener("touchstart",e=>{
isDragging=true;
startX=e.touches[0].clientX;
});

track.addEventListener("touchmove",e=>{
if(!isDragging)return;
currentX=e.touches[0].clientX;
});

track.addEventListener("touchend",()=>{
if(!isDragging)return;
const diff=currentX-startX;
if(Math.abs(diff)>50){
index=clamp(index+(diff<0?1:-1));
update();
}
isDragging=false;
});

/* ================= TRANSITION LOCK ================= */

let locked=false;
track.addEventListener("transitionstart",()=>locked=true);
track.addEventListener("transitionend",()=>locked=false);

});