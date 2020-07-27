
let mountains = [
    { no: "1", CompasPattern: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
    { no: "5", CompasPattern: "Amiata", height: 1738, place: "Siena" }
  ];

class MetronomeApp {
    /**
     * Creates a MetronomeApp.
     * @param soundsPath the path used to fetch the sound files
     * @param sounds an array of sound file names
     * @param visSettings settings for the visualizer
     * @param soundSelectId the ID of the HTML select control for the sounds
     * @param visTypeSelectId the ID of the HTML select control for the visualization types
     * @param startStopId the ID of the HTML button to start and stop the metronome
     */
    constructor(soundsPath, sounds, visSettings, soundSelectId, 
        visTypeSelectId, startStopId) {
        console.log('constructor: ' );

        this.visSettings = visSettings;
        this.soundSelectId = soundSelectId || 'metroSound';
        console.log('this.soundSelectId: ', this.soundSelectId);
        this.visTypeSelectId = visTypeSelectId || 'visType';
        this.startStopId = startStopId || 'metronome';

        const metroSoundListener = {
            setTempo: (t) => visSettings.tempoBpm = t,
            setStartTime: (t) => visSettings.startTime = t
        };
        this.metroWorker = new MetronomeWorker(soundsPath, sounds, metroSoundListener);

        visSettings.getTime = () => this.metroWorker.audioContext.currentTime;


        // Setting up selection of HTML.
        // CompasPattern: AsPalo, OnBeat.
        const CompasPattern = $('#' + 'CompasPattern');
        CompasPattern.append(`<option>AsPalo</option>`);
        CompasPattern.append(`<option>OnBeat</option>`);

        const soundSelect = $('#' + this.soundSelectId);
        for (const name of sounds) {
            const fileExtension = /\..*/;
            const optionText = name.replace('_', ' ').replace(fileExtension, '');
            console.log('optionText: ', optionText);
            soundSelect.append(`<option>${optionText}</option>`);
        }

        const visTypeSelect = $('#' + this.visTypeSelectId);
        visTypeSelect.append('<option>None</option>');
        visSettings.names.map((visTypeName, index) => {
            const sel = index === 0 ? ' selected' : '';
            visTypeSelect.append(`<option${sel}>${visTypeName}</option>`);
        });

        this.loadJson();
        this.aaa();
    }

    loadJson() {
        console.log('loadJson: ' );

        fetch("res/compassheet.json")
            .then(response => response.json())
            .then(json => console.log(json));
        // $.getJSON();
        try {
            $.getJSON("res/compassheet.json", function(json) {
                console.log('json: ', json); // this will show the info it in firebug console
            });
        } catch (e) {
            console.log('error: ', e);
        }

        // fs.readFile('js/script.json', function (err, data) {
        // })

        // console.log('loadJson: ' );
        // const file = '/res/compassheet.json';
        // jsonfile.readFile(file, function (err, obj) {
        //     if (err) {
        //         console.error(err);
        //     }
        //     console.dir(obj);
        // })
        // console.log('obj: ', obj);

    }

    // https://stackoverflow.com/questions/14643617/create-table-using-javascript
    // https://www.valentinog.com/blog/html-table/
    aaa() {

        function generateTableHead(table, data) {
            let thead = table.createTHead();
            let row = thead.insertRow();
            for (let key of data) {
                let th = document.createElement("th");
                let text = document.createTextNode(key);
                th.appendChild(text);
                row.appendChild(th);
            }
        }
        
        function generateTable(table, data) {
            for (let element of data) {
                let row = table.insertRow();
                for (let key in element) {
                    let cell = row.insertCell();
                    let text = document.createTextNode(element[key]);
                    cell.appendChild(text);
                }
            }
        }
        function tableCreate(){
            let table = document.querySelector("table");
            let data = Object.keys(mountains[0]);
            generateTableHead(table, data);
            generateTable(table, mountains);

        }
        tableCreate();
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

    addCompas() {
        // Append a text node to the cell
        var newText  = document.createTextNode('New row');
        // Insert a row in the table at the last row
        var newRow   = document.add();
//        newCell.appendChild(newText);
        console.log('addCompas, document: ', document);
//        this.metroWorker.addCompas();
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

const metronomeApp = new MetronomeApp('res/audio/',
    [ 'Low_Bongo.wav', 'Clap_bright.wav',],
    VisSettings);

// const metronomeApp = new MetronomeApp('res/audio/',
//     ['Clap_bright.wav', 'High_Woodblock.wav', 'Low_Woodblock.wav', 'High_Bongo.wav',
//         'Low_Bongo.wav', 'Claves.wav', 'Drumsticks.wav'],
//     VisSettings);
