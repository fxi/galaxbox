export class GalaxBox {
  constructor(opt) {
    const gb = this;
    gb.updateSteps = gb.updateSteps.bind(gb);
    gb.handleClick = gb.handleClick.bind(gb);
    gb.next = gb.next.bind(gb);
    gb.init(opt);
  }

  init(opt) {
    const gb = this;
    if (gb._init) {
      return;
    }
    gb._init = true;
    gb._elAudio = document.createElement('audio');
    gb._elAudio.src = './audio/red_in_black.mp3';
    gb._elAudio.loop = true;
    gb._state = {
      enabled: false,
      audio: true,
      id_frame: 0,
      id_step: 0,
      reverse: false,
      steps: []
    };
    gb._stepInit = {
      center: [-84.446, 80.051],
      pitch: 60,
      zoom: 2,
      bearing: 0
    };
    gb._conf = Object.assign(
      {},
      {
        token: opt.token,
        container: opt.selectorMap,
        attributionControl: false,
        style: 'mapbox://styles/mapbox/satellite-v9',
        projection: {
          name: 'albers',
          center: [0, 0],
          parallels: [90, 90]
        }
      },
      gb._stepInit
    );

    /**
     * Build map
     */
    mapboxgl.accessToken = gb._conf.token;
    gb._map = new mapboxgl.Map(gb._conf);

    /**
     * Audio attribe
     */
    gb._map.addControl(
      new mapboxgl.AttributionControl({
        customAttribution:
          'Track:<a href="https://freemusicarchive.org/music/Kosta_T/Complect_for/rnb" target="_blank">Red in Black by Kosta T (by-nc-sa/3.0/us/)</a>'
      })
    );

    /**
     * Build steps
     */
    gb.updateSteps();

    /**
     * Handle events
     */
    window.addEventListener('click', gb.handleClick);
  }

   updateSteps() {
    const gb = this;
    gb._state.steps.length = 0;
    gb._state.reverse = false;
    let end = false;
    let b = gb._stepInit.bearing;
    let c = gb._stepInit.center;
    let p = gb._stepInit.pitch;
    let z = gb._stepInit.zoom;
    while (!end) {
      if (p > 0) {
        p -= 1 / 100;
      }
      b += +1 / 30;
      if (z < 10) {
        z += 1 / 2000;
      } else {
        end = true;
      }
      gb._state.steps.push({
        center: c,
        pitch: p,
        zoom: z,
        bearing: b
      });
    }
  }

  next() {
    const gb = this;
    cancelAnimationFrame(gb._state.id_frame);
    gb._state.id_frame = requestAnimationFrame(() => {
      const id = gb._state.id_step++;
      const step = gb._state.steps[id];
      if (!step) {
        gb._state.reverse = true;
        gb._state.id_step = 0;
        gb._state.steps.reverse();
        return gb.next();
      }
      gb._map.jumpTo(step);
      if (gb._state.enabled) {
        return gb.next();
      }
    });
  }

  handleClick(e) {
    const gb = this;
    switch (e.target.id) {
      case 'play':
        {
          if (e.target.checked) {
            gb._state.enabled = true;
            if (gb._state.audio) {
              gb._elAudio.play();
            }
            gb.next();
          } else {
            gb._state.enabled = false;
            gb._elAudio.pause();
          }
        }
        break;
      case 'audio':
        {
          if (e.target.checked) {
            gb._state.audio = true;
            if (gb._state.enabled) {
              gb._elAudio.start();
            }
          } else {
            gb._state.audio = false;
            gb._elAudio.stop();
          }
        }
        break;
      case 'reset':
        {
          cancelAnimationFrame(gb._state.id_frame);
          const playing = gb._state.enabled === true;
          if (playing) {
            gb._state.enabled = false;
          }
          gb._elAudio.currentTime = 0;
          gb._map.flyTo(gb._stepInit);
          gb.updateSteps();
          gb._state.id_step = 0;
          gb._map.once('idle', () => {
            if (playing) {
              gb._state.enabled = true;
              gb.next();
            }
          });
        }
        break;
      default: {
        return;
      }
    }
  }
}
