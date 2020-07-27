
//   let mountains = [
//     { no: "1", CompasPattern: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
//     { no: "5", CompasPattern: "Amiata", height: 1738, place: "Siena" }
//   ];

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

        this.datas = [];
        this.loadJson();
    }

    async loadJson() {
        const getJson = async () => {
            return fetch("res/compassheet.json")
            .then(response => response.json())
            .then(json => {
                this.datas = json;
                // console.log('json: ', json)
                // console.log('this.datas: ', this.datas)
                this.tableCreate();
                this.rowsCreate(this.datas);
            });
        }
        await getJson();
    }

    // https://stackoverflow.com/questions/14643617/create-table-using-javascript
    // https://www.valentinog.com/blog/html-table/
    generateTableHead(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    
    generateTable(table, data) {
        for (let element of data) {
            let row = table.insertRow();
            for (let key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }
    
    tableCreate() {
        console.log('this.datas: ', this.datas)
        let table = document.querySelector("table");
        let data = Object.keys(this.datas[0]);
        this.generateTableHead(table, data);
        this.generateTable(table, this.datas);
    }

    //https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically
    //https://stackoverflow.com/questions/14643617/create-table-using-javascript
    rowsCreate(data) {
        var myParent = document.body;
        var arrayPalo = ["Alegrias","Tangos","Soleares","Bulerias"];
        var arraySpeedType = ["Constant", "Inc. by Beat", "Inc. by Compas", "Dec. by Beat", "Dec. by Compas"];

        console.log('document: ', document);
        for (let lala of data) {
//            element.classList.add("otherclass");
            var tr = document.createElement('tr');

            let keys = Object.keys(this.datas[0]);
            // how many colomns.
//            for (let key of keys) 
            {
                // console.log('key: ', key);
                var td;
                var selectList1, selectList2, selectList3, selectList4 ;
                var option;

                td = document.createElement('td');
                selectList1 = document.createElement("select");
                selectList1.id = "selectPalo";
                for (var i = 0; i < arrayPalo.length; i++) {
                    option = document.createElement("option");
                    option.value = arrayPalo[i];
                    option.text = arrayPalo[i];
                    selectList1.appendChild(option);
                }
                td.appendChild(selectList1);
                tr.appendChild(td);

                td = document.createElement('td');
                selectList2 = document.createElement("select");
                selectList2.id = "selectSpeed";
                option = document.createElement("option");
                option.value = arrayPalo[i];
                option.text = arrayPalo[i];
                selectList2.appendChild(option);
                td.appendChild(selectList2);
                tr.appendChild(td);

                td = document.createElement('td');
                selectList3 = document.createElement("select");
                selectList3.id = "mySelect";
                option = document.createElement("option");
                option.value = arrayPalo[i];
                option.text = arrayPalo[i];
                selectList3.appendChild(option);
                td.appendChild(selectList3);
                tr.appendChild(td);

                td = document.createElement('td');
                selectList4 = document.createElement("select");
                selectList4.id = "selectIncDec";
                for (var i = 0; i < arraySpeedType.length; i++) {
                    option = document.createElement("option");
                    option.value = arraySpeedType[i];
                    option.text = arraySpeedType[i];
                    selectList4.appendChild(option);
                }
                td.appendChild(selectList4);
                tr.appendChild(td);
            }
            myParent.appendChild(tr);

        }
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
