const def = {
  melody: [
    '',
    'A3',
    'A#3',
    'D4',
    'F4',
    '',
    'A2',
    '',
    '',
    'A3',
    'A#3',
    'D4',
    'E4',
    '',
    'A#2',
    ''
  ],
  rythm: ['A#0', 'A1', 'A#0', 'A1']
};

export class BackgroundAudio {
  constructor(opt) {
    const ba = this;
    ba._opt = Object.assign({}, def, opt);
    ba.playNote = ba.playNote.bind(ba);
  }
  init() {
    const ba = this;
    if (ba._init) {
      return;
    }
    ba._init = true;
    ba._enabled = false;
    Tone.Transport.bpm.value = 67;
    ba.synth = ba.createSynth();
    ba.seq = new Tone.Sequence(ba.playNote, ba._opt.melody, '1n');
    ba.seqRythm = new Tone.Sequence(ba.playNote, ba._opt.rythm, '2n');
  }

  start() {
    const ba = this;
    if (ba._enabled) {
      return;
    }
    ba.init();
    Tone.Transport.start();
    ba.seq.start(0);
    ba.seqRythm.start();
    ba._enabled = true;
  }
  stop() {
    const ba = this;
    if (!ba._enabled) {
      return;
    }
    Tone.Transport.stop();
    ba.seq.cancel();
    ba.seq.stop(0);
    ba.seqRythm.cancel();
    ba.seqRythm.stop(0);
    ba._enabled = false;
  }

  playNote(time, note) {
    const ba = this;
    if (time && note != '') {
      ba.synth.triggerAttackRelease(note, '1n');
    }
  }

  createSynth() {
    const vol = new Tone.Volume(-15).toMaster();
    const reverb = new Tone.Freeverb(0.9).connect(vol);
    const delay = new Tone.FeedbackDelay(0.304, 0.5).connect(reverb);
    const vibrato = new Tone.Vibrato(5, 0.2).connect(delay);
    const polySynth = new Tone.PolySynth(3, Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 0.2,
        release: 0.1
      }
    });
    reverb.wet.value = 0.1;
    delay.wet.value = 0.2;
    return polySynth.connect(vibrato);
  }
}
