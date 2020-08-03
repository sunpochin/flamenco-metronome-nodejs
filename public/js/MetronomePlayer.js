import MetronomeWorker from './MetronomeWorker.js';

let self = null;
export default class MetronomePlayer {
    /**
     * Creates a MetronomePlayer.
     * @param soundsPath the path used to fetch the sound files
     * @param sounds an array of sound file names
     * @param visSettings settings for the visualizer
     * @param soundSelectId the ID of the HTML select control for the sounds
     * @param visTypeSelectId the ID of the HTML select control for the visualization types
     * @param startStopId the ID of the HTML button to start and stop the metronome
     */
    constructor(soundsPath, sounds, visSettings, soundSelectId, 
        visTypeSelectId, startStopId) {
        // console.log('constructor: ' );
        self = this;

        this.visSettings = visSettings;
        this.soundSelectId = soundSelectId || 'soundSelect';
        this.sounds = sounds;
//        console.log('this.soundSelectId: ', this.soundSelectId);
        this.visTypeSelectId = visTypeSelectId || 'visType';
        this.startStopId = startStopId || 'metronome';

        const metroSoundListener = {
            setTempo: (t) => visSettings.tempoBpm = t,
            setStartTime: (t) => visSettings.startTime = t
        };
        self.metroWorker = new MetronomeWorker(soundsPath, sounds, metroSoundListener);
        //gmetroWorker = new MetronomeWorker(soundsPath, sounds, metroSoundListener);

        visSettings.getTime = () => this.metroWorker.audioContext.currentTime;

        this.datas = [];
        this.loadJson();

        const visTypeSelect = $('#' + this.visTypeSelectId);
        visTypeSelect.append('<option>None</option>');
        visSettings.names.map((visTypeName, index) => {
            const sel = index === 0 ? ' selected' : '';
            visTypeSelect.append(`<option${sel}>${visTypeName}</option>`);
        });

        var btnplaymetronome = document.getElementById('playmetronome');
        btnplaymetronome.addEventListener("click", function() {
            self.toggle();
        });

    }

    setAudioContext(audio) {
        self.metroWorker.setAudioContext(audio);
    }

    SetupSelection() {
        // Setting up selection of HTML.
        // CompasPattern: AsPalo, OnBeat.
        const CompasPattern = $('#' + 'CompasPattern');
        CompasPattern.append(`<option>AsPalo</option>`);
        CompasPattern.append(`<option>OnBeat</option>`);

        console.log('cnt: ', this.datas.length)
        for (let element of this.datas) {
            const soundSelect = $('#' + this.soundSelectId + element["no"]);
            console.log('soundSelect: ', soundSelect);
            for (const name of this.sounds) {
                const fileExtension = /\..*/;
                const optionText = name.replace('_', ' ').replace(fileExtension, '');
                console.log('optionText: ', optionText);
                soundSelect.append(`<option>${optionText}</option>`);
            }
            // soundSelect.append(`<option>${optionText}</option>`);
        }
    }

    async loadJson() {
        const getJson = async () => {
            return fetch("res/compas-table.json")
            .then(response => response.json())
            .then(json => {
                this.datas = json;
                // console.log('json: ', json)
                // console.log('this.datas: ', this.datas)
//                this.tableCreate();

                // this.addHeader();
                // this.rowsCreate2(this.datas);
            });
        }
        await getJson();

        this.SetupSelection();
    }


    
    onclick(e) {
        console.log('onclick! ', e);
        alert(this.constructor.name); // SomeClass
    }

    /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        this.metroWorker.setTempo(bpm);
    }

    /**
     * Setting palo pattern.
     * @param bpm tempo in beats per minute
     */
    setPalo(type) {
        this.metroWorker.setPalo(type);
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number) {
        this.metroWorker.setSound(number);
    }

    /**
     * Sets the visualization type.
     * @param index a 0-based number specifying the visualization to use
     */
    setVisualization(index) {
        this.visSettings.visualizationType = index;
    }

    /** Starts the metronome if it is stopped, and vice versa. */
    toggle() {
        this.metroWorker.toggle();
        $('#' + this.startStopId).val(this.metroWorker.running ? 'Stop' : 'Start')
    }
}

// const metronomeApp = new MetronomePlayer('res/audio/',
//     [ 'Low_Bongo.wav', 'Clap_bright.wav',],
//     VisSettings);

// const metronomeApp = new MetronomePlayer('res/audio/',
//     ['Clap_bright.wav', 'High_Woodblock.wav', 'Low_Woodblock.wav', 'High_Bongo.wav',
//         'Low_Bongo.wav', 'Claves.wav', 'Drumsticks.wav'],
//     VisSettings);
