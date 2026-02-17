document.addEventListener("DOMContentLoaded",()=>{

const grid=document.getElementById("album-grid");
const yearFilter=document.getElementById("yearFilter");
const monthFilter=document.getElementById("monthFilter");
const prevBtn=document.getElementById("prevPage");
const nextBtn=document.getElementById("nextPage");
const pageIndicator=document.getElementById("pageIndicator");

if(!grid||!window.ALBUM_DATA)return;

const images=window.ALBUM_DATA;

let currentPage=1;
let filteredImages=[...images];

/* ================= RESPONSIVE ITEMS PER PAGE ================= */

function getPerPage(){
  return window.innerWidth<=720?3:9;
}

/* ================= POPULATE YEAR FILTER ================= */

const years=[...new Set(images.map(img=>img.date.split("-")[0]))]
.sort((a,b)=>b-a);

years.forEach(year=>{
  const option=document.createElement("option");
  option.value=year;
  option.textContent=year;
  yearFilter.appendChild(option);
});

/* ================= FILTER LOGIC ================= */

function applyFilters(){

const selectedYear=yearFilter.value;
const selectedMonth=monthFilter.value;

filteredImages=images.filter(img=>{

const [year,month]=img.date.split("-");

if(selectedYear!=="all"&&year!==selectedYear)return false;
if(selectedMonth!=="all"&&month!==selectedMonth)return false;

return true;
});

currentPage=1;
render();
}

/* ================= PAGINATION ================= */

function getPaginatedData(){
const perPage=getPerPage();
const start=(currentPage-1)*perPage;
return filteredImages.slice(start,start+perPage);
}

function updatePagination(){
const perPage=getPerPage();
const totalPages=Math.ceil(filteredImages.length/perPage)||1;

pageIndicator.textContent=`Page ${currentPage} of ${totalPages}`;

prevBtn.disabled=currentPage===1;
nextBtn.disabled=currentPage===totalPages;
}

/* ================= RENDER ================= */

function render(){

const data=getPaginatedData();

if(data.length===0){
  grid.innerHTML=`
  <p style="text-align:center;color:var(--muted);grid-column:1/-1;">
    No images found for selected filter.
  </p>`;
  updatePagination();
  return;
}

grid.innerHTML=data.map(img=>`
<div class="album-card">
  <div class="album-image">
    <img src="${img.src}" alt="${img.title}">
    <div class="album-overlay"></div>
    <div class="album-content">
      <h3>${img.title}</h3>
      <div class="album-meta">
        ${img.capturedBy} · ${img.date}
      </div>
      <div class="album-description">
        ${img.description}
      </div>
    </div>
  </div>
</div>
`).join("");

updatePagination();
}

/* ================= EVENT LISTENERS ================= */

yearFilter.addEventListener("change",applyFilters);
monthFilter.addEventListener("change",applyFilters);

prevBtn.addEventListener("click",()=>{
const perPage=getPerPage();
const totalPages=Math.ceil(filteredImages.length/perPage);
if(currentPage>1){
  currentPage--;
  render();
  window.scrollTo({top:grid.offsetTop-100,behavior:"smooth"});
}
});

nextBtn.addEventListener("click",()=>{
const perPage=getPerPage();
const totalPages=Math.ceil(filteredImages.length/perPage);
if(currentPage<totalPages){
  currentPage++;
  render();
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
  render();
}
});

/* ================= INIT ================= */

render();

});