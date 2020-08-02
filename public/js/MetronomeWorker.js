
let endtime = new Date().getTime();
// let beatAlegriasTraditional = [1.5, 0.5, 1, 1.5, 0.5, 1,
//     1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 1.0 ];

let beatAlegriasTraditional = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
    
let beatTangos = [0, 1.0, 0.5, 0.5, 1.0, 1.0];
//let compasTempoPair = [(1, 140), (4, 180), (7, 140), (8, 70) ];
var compasTempoMap = new Map([
//    [1, 140], [2, 180], [7, 140], [8, 70]] );
//    [1, 5140], [2, 5180], [7, 5140], [8, 570]] );
    [1, 70], [5, 80], [7, 90], [11, 100],
    [13, 120], [15, 120], [17, 120],
    [29, 140], [30, 160], [31, 180], [32, 200],
    [33, 200],


] );

export default class MetronomeWorker {
    constructor(soundsPath, sounds, listener) {
        this.soundsPath = soundsPath;
        const dummyListener = { setTempo: (t) => {}, setStartTime: (t) => {} };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 140;
        this.soundNum = 1;
        this.sounds = sounds;
        // this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // const urls = sounds.map(name => this.soundsPath + name);
        // this.soundFiles = new SoundFiles(this.audioContext, urls);

        this.compasNo = 0;

    }

    /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        console.log('in setTempo');
        this.tempoBpm = bpm;
    }


    setAudioContext(audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const urls = this.sounds.map(name => this.soundsPath + name);
        this.soundFiles = new SoundFiles(this.audioContext, urls);
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
        const ms = this;
        let counter = 0;
        // An array to represent the beating pattern of different palos.
        var beatPattern = beatAlegriasTraditional;

        let nextStart = ms.audioContext.currentTime;
        function schedule() {
//            const speed = compasTempoMap[ms.compasNo];
            const speed = compasTempoMap.get( ms.compasNo );
//            const speed = compasTempoMap.get( 7 );
            console.log('typeof', typeof(ms.compasNo), ' ,compas no: ', ms.compasNo, ', speed: ', speed);

            console.log('speed: ', speed)
            if (undefined !== speed ) {
                // change speed only when it's a valid Map.get() result.
                ms.tempoBpm = speed;
            }
            console.log('ms.compasNo', ms.compasNo, ' ,speed: ', speed, ' ,ms.tempoBpm: ', ms.tempoBpm);

            if (!ms.running) {
                return;
            }

            ms.listener.setStartTime(nextStart);
            ms.listener.setTempo(ms.tempoBpm);
            let bufIndex = 1; // non-heavy beat sound.
            if (bufIndex >= ms.soundFiles.buffers.length) {
                alert('Sound files are not yet loaded')
            } else if (ms.tempoBpm) {
                counter++;
                // change compas
                if (beatPattern.length == counter) {
                    counter = counter % beatPattern.length;
                    ms.compasNo += 1;
                }

                // if (counter == 2 || counter == 5 || counter == 8 
                //     || 11 == counter || 14 == counter
                //     // || 0 == counter
                // //     ) {
                //     // if (counter == 1 || counter == 4 || counter == 7 
                //     //     || 10 == counter || 13 == counter
                if (counter == 0 
                    ) {
                    bufIndex = 0;
                }
                console.log('counter: ', counter, ' ,bufIndex: ', bufIndex);

                ms.source = ms.audioContext.createBufferSource();
                ms.source.buffer = ms.soundFiles.buffers[bufIndex];
                ms.source.connect(ms.audioContext.destination);
                ms.source.onended = schedule;

                nextStart += (60 / ms.tempoBpm) * beatPattern[counter];
                ms.source.start(nextStart);

                // debugging.
                let diff = new Date().getTime() - endtime;
                endtime = new Date().getTime();
                console.log('endtime: ', endtime, ', diff: ', diff);
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
