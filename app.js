
const elInput = document.getElementById('start');

mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsc2lua2kiLCJhIjoiY2puZW5rZ3N6MGRzYzNwb3drOW12MWEzdyJ9.IZC03hW3hKtBcbMgD0_KPw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9',
  projection: {
    name: 'albers',
    center: [0, 0],
    parallels: [90, 90]
  },
  
  center: [80, 80],
  pitch : 60,
  zoom: 0.7
});


map.on('ready',()=>{
map.setPaintProperty('background','background-color','rgba(0,0,0,0)')

})

window.map = map;
const state ={
 enabled : false
}

elInput.addEventListener('click',(e)=>{
  if(e.target.checked){
   state.enabled = true;
    update();
  }else{
    state.enabled = false;
  }
});

function update() {
  requestAnimationFrame(() => {
    let b = map.getBearing();
    let z = map.getZoom();
    let p = map.getPitch();
    
    if(p>0){
     map.setPitch(p - 1/100);
    }
    
    map.setBearing(b+ 1/20);
    
    if(z<10){
     map.setZoom(z + 1/2000);
    }
    if(state.enabled){
     update();
    }
   
  })
}

