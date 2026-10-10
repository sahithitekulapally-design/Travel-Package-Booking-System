const packages = [
 {id:1,name:"Munnar Green Escape",category:"Mountain",days:"3 days / 2 nights",price:7499,place:"Kerala, India",description:"Tea gardens, misty hills and peaceful nature walks.",image:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"},
 {id:2,name:"Goa Beach Retreat",category:"Beach",days:"4 days / 3 nights",price:9999,place:"Goa, India",description:"Golden beaches, sunset views and a relaxed coastal stay.",image:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80"},
 {id:3,name:"Jaipur Heritage Tour",category:"City",days:"3 days / 2 nights",price:6999,place:"Rajasthan, India",description:"Discover colorful markets, forts and royal architecture.",image:"https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80"},
 {id:4,name:"Himalayan Adventure",category:"Mountain",days:"5 days / 4 nights",price:12999,place:"Himachal Pradesh, India",description:"Mountain scenery, fresh air and guided local experiences.",image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"},
 {id:5,name:"Andaman Blue Waters",category:"Beach",days:"5 days / 4 nights",price:18499,place:"Andaman Islands, India",description:"Clear waters, island views and memorable beach time.",image:"https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=80"},
 {id:6,name:"Hyderabad City Break",category:"City",days:"2 days / 1 night",price:4499,place:"Telangana, India",description:"Explore historic landmarks, local food and city culture.",image:"https://images.unsplash.com/photo-1565552629475-1f5f5a9b4e31?auto=format&fit=crop&w=900&q=80"}
];
const grid = document.getElementById("packageGrid");
const select = document.getElementById("packageSelect");
let activeCategory = "All";
const money = n => "₹" + Number(n).toLocaleString("en-IN");

function renderPackages(){
 const query = document.getElementById("search").value.toLowerCase().trim();
 const visible = packages.filter(p => (activeCategory==="All" || p.category===activeCategory) && (p.name.toLowerCase().includes(query)||p.place.toLowerCase().includes(query)));
 grid.innerHTML = visible.length ? visible.map(p=>`
 <article class="package-card">
   <img src="${p.image}" alt="${p.name}" loading="lazy">
   <div class="package-info"><span class="tag">${p.category} · ${p.days}</span>
   <h3>${p.name}</h3><p>${p.description}</p>
   <div class="card-bottom"><div class="price">${money(p.price)} <small>/ person</small></div><button class="book-btn" data-book="${p.id}">Book now ↗</button></div></div>
 </article>`).join("") : '<p class="empty">No packages match your search.</p>';
 grid.querySelectorAll("[data-book]").forEach(btn=>btn.addEventListener("click",()=>{
   select.value=btn.dataset.book; document.getElementById("bookings").scrollIntoView({behavior:"smooth"});
 }));
}
function loadBookings(){
 let bookings=JSON.parse(localStorage.getItem("tripnestBookings")||"[]");
 const list=document.getElementById("bookingList");
 list.innerHTML=bookings.length?bookings.slice().reverse().map(b=>`
 <div class="booking-item"><div><strong>${escapeHtml(b.name)} · ${escapeHtml(b.packageName)}</strong>
 <p>${escapeHtml(b.date)} · ${b.travelers} traveler(s) · ${escapeHtml(b.email)} · Total package value ${money(b.price*b.travelers)}</p></div><span class="status">Request saved</span></div>`).join(""):'<p class="empty">No bookings yet. Choose a package above to get started.</p>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
packages.forEach(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=`${p.name} — ${money(p.price)}/person`;select.appendChild(o);});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeCategory=btn.dataset.category;renderPackages();}));
document.getElementById("search").addEventListener("input",renderPackages);
document.getElementById("bookingForm").addEventListener("submit",e=>{
 e.preventDefault();const form=new FormData(e.target);const pkg=packages.find(p=>p.id===Number(form.get("package")));
 const booking={name:form.get("name").trim(),email:form.get("email").trim(),packageName:pkg.name,packageId:pkg.id,date:form.get("date"),travelers:Number(form.get("travelers")),price:pkg.price,createdAt:new Date().toISOString()};
 const bookings=JSON.parse(localStorage.getItem("tripnestBookings")||"[]");bookings.push(booking);localStorage.setItem("tripnestBookings",JSON.stringify(bookings));
 document.getElementById("formMessage").textContent="Booking request saved in this browser!";
 e.target.reset();document.getElementById("travelers");loadBookings();
});
document.getElementById("travelDate").min=new Date().toISOString().split("T")[0];
document.getElementById("clearBookings").addEventListener("click",()=>{if(confirm("Delete all saved booking requests from this browser?")){localStorage.removeItem("tripnestBookings");loadBookings();}});
renderPackages();loadBookings();