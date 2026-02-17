document.addEventListener("DOMContentLoaded",()=>{

const liveRoot=document.getElementById("live-root");
const grid=document.getElementById("streams-grid");
const prevBtn=document.getElementById("prevStreamPage");
const nextBtn=document.getElementById("nextStreamPage");
const pageIndicator=document.getElementById("streamPageIndicator");

if(!window.STREAMS_DATA||!grid)return;

/* ================= SORT NEWEST FIRST ================= */

const streams=[...window.STREAMS_DATA]
.sort((a,b)=>new Date(b.date)-new Date(a.date));

const liveStreams=streams.filter(s=>s.isLive);
let archiveStreams=streams.filter(s=>!s.isLive);

let currentPage=1;

/* ================= RESPONSIVE ITEMS ================= */

function getPerPage(){
  return window.innerWidth<=720?2:6;
}

/* ================= YOUTUBE THUMBNAIL ================= */

function getYouTubeID(url){
  const match=url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match?match[1]:null;
}

function getThumbnail(url){
  const id=getYouTubeID(url);
  return id?`https://img.youtube.com/vi/${id}/maxresdefault.jpg`:"";
}

/* ================= RENDER LIVE ================= */

function renderLive(){

if(!liveRoot)return;

if(liveStreams.length===0){
  liveRoot.innerHTML=`<div class="no-live">
    No active live streams at the moment.
  </div>`;
  return;
}

const containerClass=liveStreams.length===1?"live-single":"live-grid";

liveRoot.innerHTML=`
<div class="${containerClass}">
${liveStreams.map(stream=>`
<div class="live-card">
  <div class="live-badge">LIVE</div>
  <div class="live-thumbnail">
    <img src="${getThumbnail(stream.youtubeLink)}" alt="${stream.title}">
  </div>
  <div class="live-content">
    <h3>${stream.title}</h3>
    <p>${stream.description}</p>
    <a class="live-link" href="${stream.youtubeLink}" target="_blank">
      Watch Live
    </a>
  </div>
</div>
`).join("")}
</div>
`;
}

/* ================= PAGINATION ================= */

function getPaginatedData(){
const perPage=getPerPage();
const start=(currentPage-1)*perPage;
return archiveStreams.slice(start,start+perPage);
}

function updatePagination(){
const perPage=getPerPage();
const totalPages=Math.ceil(archiveStreams.length/perPage)||1;

pageIndicator.textContent=`Page ${currentPage} of ${totalPages}`;

prevBtn.disabled=currentPage===1;
nextBtn.disabled=currentPage===totalPages;
}

/* ================= RENDER ARCHIVE ================= */

function renderArchive(){

const data=getPaginatedData();

if(data.length===0){
  grid.innerHTML=`
  <div class="no-live">
    No archived streams available.
  </div>`;
  updatePagination();
  return;
}

grid.innerHTML=data.map(stream=>`
<div class="stream-card">
  <div class="stream-thumbnail">
    <img src="${getThumbnail(stream.youtubeLink)}" alt="${stream.title}">
  </div>
  <div class="stream-content">
    <h3>${stream.title}</h3>
    <div class="stream-meta">${stream.date}</div>
    <div class="stream-description">
      ${stream.description}
    </div>
    <a class="stream-link" href="${stream.youtubeLink}" target="_blank">
      Watch Replay
    </a>
  </div>
</div>
`).join("");

updatePagination();
}

/* ================= EVENTS ================= */

prevBtn.addEventListener("click",()=>{
if(currentPage>1){
  currentPage--;
  renderArchive();
  window.scrollTo({top:grid.offsetTop-100,behavior:"smooth"});
}
});

nextBtn.addEventListener("click",()=>{
const totalPages=Math.ceil(archiveStreams.length/getPerPage());
if(currentPage<totalPages){
  currentPage++;
  renderArchive();
  window.scrollTo({top:grid.offsetTop-100,behavior:"smooth"});
}
});

/* ================= HANDLE RESIZE ================= */

let lastMode=getPerPage();

window.addEventListener("resize",()=>{
const currentMode=getPerPage();
if(currentMode!==lastMode){
  lastMode=currentMode;
  currentPage=1;
  renderArchive();
}
});

/* ================= INIT ================= */

renderLive();
renderArchive();

});