document.addEventListener("DOMContentLoaded",()=>{

const root=document.getElementById("about-dynamic-root");
if(!root)return;

/* ================= DATE LOGIC ================= */

const startYear=2023;
const now=new Date();
const yearsActive=now.getFullYear()-startYear;

/* ================= OPTIONAL STATIC FALLBACK DATA ================= */

const observationCount=24;
const imageCount=100;

/* ================= RENDER ================= */

root.innerHTML=`
<h2 style="margin-bottom:2rem;">Club Statistics</h2>
<div class="stats-grid">
  <div class="stat">
    <h3 data-target="${yearsActive}">0</h3>
    <p>Years Active</p>
  </div>
  <div class="stat">
    <h3 data-target="${observationCount}">0</h3>
    <p>Observations Conducted</p>
  </div>
  <div class="stat">
    <h3 data-target="${imageCount}">0</h3>
    <p>Images Captured</p>
  </div>
</div>
`;

/* ================= COUNTER ANIMATION ================= */

const counters=root.querySelectorAll("[data-target]");

function animateCounter(el){
  const target=+el.dataset.target;
  let current=0;
  const duration=1000;
  const startTime=performance.now();

  function update(time){
    const progress=Math.min((time-startTime)/duration,1);
    el.textContent=Math.floor(progress*target);
    if(progress<1)requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ================= TRIGGER ON VIEW ================= */

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      counters.forEach(c=>animateCounter(c));
      observer.disconnect();
    }
  });
},{threshold:.5});

observer.observe(root);

});