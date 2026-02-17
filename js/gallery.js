document.addEventListener("DOMContentLoaded",()=>{

const track=document.querySelector(".gallery-track"),
pages=[...document.querySelectorAll(".gallery-page")],
prevBtn=document.querySelector(".gallery-nav.prev"),
nextBtn=document.querySelector(".gallery-nav.next");

if(!track||!pages.length)return;

let index=0,startX=0,currentX=0,isDragging=false;

const update=()=>track.style.transform=`translateX(-${index*100}%)`;

const clamp=i=>Math.max(0,Math.min(i,pages.length-1));

if(prevBtn)prevBtn.addEventListener("click",()=>{index=clamp(index-1);update()});
if(nextBtn)nextBtn.addEventListener("click",()=>{index=clamp(index+1);update()});

/* Keyboard Support */
document.addEventListener("keydown",e=>{
if(e.key==="ArrowRight"){index=clamp(index+1);update()}
if(e.key==="ArrowLeft"){index=clamp(index-1);update()}
});

/* Touch Swipe Support */
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

/* Optional: prevent rapid spam clicks */
let locked=false;
track.addEventListener("transitionstart",()=>locked=true);
track.addEventListener("transitionend",()=>locked=false);

});