document.addEventListener("DOMContentLoaded",()=>{

const root=document.getElementById("resources-root");
if(!root)return;

/* ================= DATA ================= */

const equipment=[
{
name:"Telescope I",
image:"../assets/icons/resources/telescope/telescope1.png",
description:"Primary observation telescope used for planetary and lunar imaging.",
specs:[
"Aperture: ",
"Mount: ",
"Use: "
]
},
{
name:"Telescope II",
image:"../assets/icons/resources/telescope/telescope2.png",
description:"Portable observation telescope for quick deployment sessions.",
specs:[
"Aperture: ",
"Mount: ",
"Use: "
]
},
{
name:"Astrophotography Camera",
image:"../assets/icons/resources/camera/camera.png",
description:"",
specs:[
"Sensor: ",
"Exposure: ",
"Use: "
]
}
];

/* ================= RENDER FUNCTION ================= */

function renderEquipment(){

root.innerHTML=
`<div class="equipment-grid">
${equipment.map(item=>`
  <div class="equipment-card">
    <div class="equipment-image">
      <img src="${item.image}" alt="${item.name}">
    </div>
    <div class="equipment-content">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <ul>
        ${item.specs.map(s=>`<li>${s}</li>`).join("")}
      </ul>
    </div>
  </div>
`).join("")}
</div>`;

}

/* ================= INIT ================= */

renderEquipment();

});