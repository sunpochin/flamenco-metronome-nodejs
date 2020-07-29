
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
        this.soundSelectId = soundSelectId || 'soundSelect';
//        console.log('this.soundSelectId: ', this.soundSelectId);
        this.visTypeSelectId = visTypeSelectId || 'visType';
        this.startStopId = startStopId || 'metronome';

        const metroSoundListener = {
            setTempo: (t) => visSettings.tempoBpm = t,
            setStartTime: (t) => visSettings.startTime = t
        };
        this.metroWorker = new MetronomeWorker(soundsPath, sounds, metroSoundListener);

        visSettings.getTime = () => this.metroWorker.audioContext.currentTime;



        this.datas = [];
        this.loadJson();

        const visTypeSelect = $('#' + this.visTypeSelectId);
        visTypeSelect.append('<option>None</option>');
        visSettings.names.map((visTypeName, index) => {
            const sel = index === 0 ? ' selected' : '';
            visTypeSelect.append(`<option${sel}>${visTypeName}</option>`);
        });
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
            // for (const name of sounds) {
            //     const fileExtension = /\..*/;
            //     const optionText = name.replace('_', ' ').replace(fileExtension, '');
            //     console.log('optionText: ', optionText);
            //     soundSelect.append(`<option>${optionText}</option>`);
            // }
            // soundSelect.append(`<option>${optionText}</option>`);
        }
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

                this.addHeader();
                this.rowsCreate2(this.datas);
//                this.rowsCreate(this.datas);
            });
        }
        await getJson();

        this.SetupSelection();
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

    addHeader() {
        var myParent = document.body;

        var iContainer = document.createElement('div');
        iContainer.className="container";
        myParent.appendChild(iContainer);

        var iRow, iNo, iCol, iBtn;
        var colID = "", iSelect = "", option = "";
        // adding row.
        iRow = document.createElement('div');
        iRow.className = "row";

        iNo = document.createElement('button');
        console.log('colID: ', colID);
        iNo.setAttribute("id", colID);
        iNo.className = "btn-info";
        iNo.textContent = colID;
        iNo.setAttribute("onChange", "metronomeApp.setSound(this.selectedIndex + 1)");
        iNo.setAttribute('style', 'height:40px; width:180px');

        iCol = document.createElement('div');
        iCol.className = "col-md-6";
        iCol.appendChild(iNo);            
        iRow.appendChild(iCol);


        iBtn = document.createElement('button');
        colID = "add_0" ;
        iBtn.setAttribute("id", colID);
        iBtn.className = "btn-info";
        iBtn.textContent = "+ compas"
        iBtn.setAttribute("onClick", "metronomeApp.addCompas(this)");

        iCol = document.createElement('div');
        iCol.className = "col-md-6";
        console.log('colID: ', colID);
        iCol.appendChild(iBtn);            
        iRow.appendChild(iCol);

        iContainer.appendChild(iRow);

    }

    rowsCreate2(data) {
        var myParent = document.body;
        var arrayPalo = ["Alegrias","Tangos","Soleares","Bulerias"];
        var arraySpeedType = ["Constant", "Inc. by Beat", "Inc. by Compas", "Dec. by Beat", "Dec. by Compas"];

        var iContainer = document.createElement('div');
        iContainer.className="container";
        myParent.appendChild(iContainer);

        for (let element of data) {
//            console.log('element: ', element);
            var iRow, iNo, iCol, iBtn;
            var colID = "", iSelect = "", option = "";
            // adding row.
            iRow = document.createElement('div');
            iRow.className = "row";

            iNo = document.createElement('button');
            colID = "no_" + element["no"];
            console.log('colID: ', colID);
            iNo.setAttribute("id", colID);
            iNo.className = "btn-info";
            iNo.textContent = colID;
            iNo.setAttribute("onChange", "metronomeApp.setSound(this.selectedIndex + 1)");

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            iCol.appendChild(iNo);            
            iRow.appendChild(iCol);


            iSelect = document.createElement('select');
            colID = "Palo_" + element["no"];
            iSelect.setAttribute("id", colID);
            iSelect.setAttribute("class", "form-control-sm");
            iSelect.setAttribute("onChange", "metronomeApp.setSound(this.selectedIndex + 1)");
            for (var i = 0; i < arrayPalo.length; i++) {
                option = document.createElement("option");
                option.value = arrayPalo[i];
                option.text = arrayPalo[i];
                iSelect.appendChild(option);
            }

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            console.log('colID: ', colID);
            iCol.setAttribute("id", colID);
            iCol.appendChild(iSelect);            
            iRow.appendChild(iCol);

            
            var iInput = document.createElement('input');
            colID = "Speed_" + element["no"];
            iInput.setAttribute("id", colID);
            iInput.setAttribute("type", "text");
            iInput.setAttribute("class", "form-control");

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            console.log('colID: ', colID);
            iCol.setAttribute("id", colID);
            iCol.appendChild(iInput);            
            iRow.appendChild(iCol);


            iSelect = document.createElement('select');
            // iSelect.setAttribute("id", rowID);
            colID = "soundSelect_" + element["no"];
            iSelect.setAttribute("id", colID);
            iSelect.setAttribute("class", "form-control-sm");
            iSelect.setAttribute("onChange", "metronomeApp.setSound(this.selectedIndex + 1)");

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            console.log('colID: ', colID);
            iCol.setAttribute("id", colID);
            iCol.appendChild(iSelect);            
            iRow.appendChild(iCol);


            iBtn = document.createElement('button');
            colID = "add_" + element["no"];
            iBtn.setAttribute("id", colID);
            iBtn.className = "btn-info";
            iBtn.textContent = "+ compas"
            iBtn.setAttribute("onClick", "metronomeApp.addCompas(this)");

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            console.log('colID: ', colID);
//            iBtn.setAttribute("class", "form-control");
            iCol.appendChild(iBtn);            
            iRow.appendChild(iCol);
            

            iContainer.appendChild(iRow);
        }

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

    addCompas(element) {
        console.log('addCompas, compasNo: ', element);
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
