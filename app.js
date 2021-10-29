import {BackgroundAudio} from './audio.js';

const elCtrlPlay = document.getElementById('play');
const elCtrlAudio = document.getElementById('audio');

const audio = new BackgroundAudio();

/*const elAudio = document.createElement('audio');*/
/*elAudio.src = './audio/backaudio.m4a';*/
/*elAudio.loop = true;*/

const state = {
  enabled: false,
  audio: true,
  id: 0
};
const pos = {
  center: [-84.446, 80.051],
  pitch: 60,
  zoom: 2,
  bearing: 0
};

const conf = Object.assign(
  {},
  {
    token:
      'pk.eyJ1IjoiZnJlZGZ4aSIsImEiOiJja3ZiOXlxcjUwNnFwMnZuNjh1aTFwcG0zIn0.nMBltJycIM6sn_kqj8_zcg',
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    projection: {
      name: 'albers',
      center: [0, 0],
      parallels: [90, 90]
    }
  },
  pos
);

mapboxgl.accessToken = conf.token;
window.map = new mapboxgl.Map(conf);

window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'play':
      {
        if (e.target.checked) {
          state.enabled = true;
          if (state.audio) {
            audio.start();
          }
          update();
        } else {
          state.enabled = false;
          audio.stop();
        }
      }
      break;
    case 'audio':
      {
        if (e.target.checked) {
          state.audio = true;
          if (state.enabled) {
            audio.start();
          }
        } else {
          state.audio = false;
          audio.stop();
        }
      }
      break;
    case 'reset':
      {
        cancelAnimationFrame(state.id);
        const playing = state.enabled === true;
        if (playing) {
          state.enabled = false;
        }
        map.flyTo(pos);
        map.once('idle', () => {
          if (playing) {
            state.enabled = true;
            update();
          }
        });
      }
      break;
    default: {
      return;
    }
  }
});

function update() {
  cancelAnimationFrame(state.id);
  state.id = requestAnimationFrame(() => {
    const b = map.getBearing();
    const z = map.getZoom();
    const p = map.getPitch();

    if (p > 0) {
      map.setPitch(p - 1 / 100);
    }

    map.setBearing(b + 1 / 30);
    map.setCenter(pos.center);

    if (z < 10) {
      map.setZoom(z + 1 / 2000);
    }
    if (state.enabled) {
      update();
    }
  });
}
