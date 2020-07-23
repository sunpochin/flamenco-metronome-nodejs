let endtime = new Date().getTime();
let beatAlegriasTraditional = [1.5, 0.5, 1, 1.5, 0.5, 1,
    1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 1.0 ];

let beatTangos = [1.0, 0.5, 0.5, 1.0, 1.0];


class MetronomeWorker {
    constructor(soundsPath, sounds, listener) {
        this.soundsPath = soundsPath;
        const dummyListener = { setTempo: (t) => {}, setStartTime: (t) => {} };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 140;
        this.soundNum = 1;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const urls = sounds.map(name => this.soundsPath + name);
        this.soundFiles = new SoundFiles(this.audioContext, urls);
    }

    /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        console.log('in setTempo');
        this.tempoBpm = bpm;
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number) {
        this.soundNum = number;
    }

    setPalo(paloType) {
        this.paloType = paloType;
    }


    playMetronome() {
        let ms = this;
        let counter = 0;
        // An array to represent the beating pattern of different palos.
        var beatPattern = beatAlegriasTraditional;

        let nextStart = ms.audioContext.currentTime;
        
        function schedule() {
            if (!ms.running) return;

            ms.listener.setStartTime(nextStart);
            ms.listener.setTempo(ms.tempoBpm);
            const bufIndex = ms.soundNum - 1;
            if (bufIndex >= ms.soundFiles.buffers.length) {
                alert('Sound files are not yet loaded')
            } else if (ms.tempoBpm) {

                nextStart += (60 / ms.tempoBpm) * beatPattern[counter];

                ms.source = ms.audioContext.createBufferSource();
                ms.source.buffer = ms.soundFiles.buffers[bufIndex];
                ms.source.connect(ms.audioContext.destination);
                ms.source.onended = schedule;
                ms.source.start(nextStart);

                let diff = new Date().getTime() - endtime;
                endtime = new Date().getTime();
                console.log('endtime: ', endtime, ', diff: ', diff);

                counter++;
                counter = counter % beatPattern.length;
            }
        }
        schedule();
    }


    /** Toggles the running state of the metronome */
    toggle() {
        const ms = this;

        if (this.running = !this.running) {
            this.playMetronome();
        } else {
            this.listener.setTempo(0);
            if (this.source) {
                this.source.disconnect();
                this.source = undefined;
            }
        }
    }
}

class SoundFiles {
    constructor(context, urlList) {
        this.buffers = [];
        const self = this;

        urlList.forEach((url, index) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onload = () => context.decodeAudioData(xhr.response,
                (buffer) => self.buffers[index] = buffer,
                (error) => console.error('decodeAudioData error', error));
            xhr.open("GET", url);
            xhr.send();
        });
    }
}
