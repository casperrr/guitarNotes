const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

class Neck{
    constructor(){
        this.stringNum = 6;
        this.frets = 12;
        //             0   1    2   3   4    5   6    7   8   9   10   11
        this.notes = ["a","a#","b","c","c#","d","d#","e","f","f#","g","g#"];
        //               standard       drop-d
        this.tunings = [
            {name: "Standard", tunNotes:[7,0,5,10,2,7]},
            {name: "Drop-D", tunNotes:[5,0,5,10,2,7]},
            {name: "New Standard", tunNotes:[3,10,5,0,7,10]}
        ];
        this.tuning = this.tunings[0].tunNotes;
        this.strings = [];
        this.neckWidth = canvas.width*(1-0.03*2);
        this.neckHeight = canvas.height*(1-0.15*2);
        this.neckPos = {
            startX: (canvas.width-this.neckWidth)/2,
            startY: (canvas.height-this.neckHeight)/2,
            endX: (canvas.width-this.neckWidth)/2 + this.neckWidth,
            endY: (canvas.height-this.neckHeight)/2 + this.neckHeight,
        };
        this.colorPallete = ["#b4e600","#ff8c00","#ff0059","#9500ff","#2962ff","#0ad2ff","#0fffdb"];
        this.drawColors = false;
        this.drawDegText = true;
        // this.scales = {
        //     chromatic: [1,1,1,1,1,1,1,1,1,1,1,1],
        //     major: [2,2,1,2,2,2,1],
        //     minor: [2,1,2,2,1,2,2],
        //     minPent:[3,2,2,3,2],
        //     majPent:[2,2,3,2,3],
        //     japan: [1,4,2,1,4],
        // };

        this.scales = [
            {name: "chromatic", degs: [1,1,1,1,1,1,1,1,1,1,1,1]},
            {name: "major", degs: [2,2,1,2,2,2,1]},
            {name: "minor", degs: [2,1,2,2,1,2,2]},
            {name: "minPent", degs: [3,2,2,3,2]},
            {name: "majPent", degs: [2,2,3,2,3]},
            {name: "japan", degs: [1,4,2,1,4]},
        ];

        this.scale = this.scales[1].degs;
        this.root = 10;

        this.initNeck();
    }
    
    initNeck(){
        for(let i = 0; i < this.stringNum;i++){
            this.strings.unshift(new GString(this.frets,this.tuning[i]));
        }
        this.draw();
    }

    draw(){
        c.strokeStyle = "rgb(255,255,255)";
        //draw neck
        c.lineWidth = 0.4;
        c.beginPath();
        c.rect(this.neckPos.startX,this.neckPos.startY,this.neckWidth,this.neckHeight);
        c.stroke();
        //draw frets
        let fretInterval = (this.neckWidth)/this.frets;
        c.lineWidth = 2.4;
        for(let i = 1;i<this.frets;i++){
            c.beginPath();
            c.moveTo(i*fretInterval+this.neckPos.startX,this.neckPos.startY);
            c.lineTo(i*fretInterval+this.neckPos.startX,this.neckPos.endY);
            c.stroke();
        }
        //draw strings
        let stringInterval = (this.neckHeight)/(this.stringNum+1)
        let offset = canvas.height*0.15;
        c.lineWidth = 1.5;
        for(let i = 1; i < this.stringNum+1; i++){
            this.strings[i-1].yPos = i*stringInterval+offset;
            c.beginPath();
            c.moveTo(this.neckPos.startX,i*stringInterval+offset);
            c.lineTo(this.neckPos.endX,i*stringInterval+offset);
            c.stroke();  
        }
        //draw fret markers
        let markerPos = [0,0,1,0,1,0,1,0,1,0,0,2];
        for(let i = 0; i < this.frets; i++){
            if(markerPos[i%12] == 1){
                //draw 1 circle
                c.beginPath();
                c.arc(i*fretInterval+this.neckPos.startX+(fretInterval/2),canvas.height/2,5,Math.PI*2,false);
                c.stroke();
            }else if(markerPos[i%12] == 2){
                //draw 2 circle
                c.beginPath();
                c.arc(i*fretInterval+this.neckPos.startX+(fretInterval/2),canvas.height*0.4,5,Math.PI*2,false);
                c.stroke();
                c.beginPath();
                c.arc(i*fretInterval+this.neckPos.startX+(fretInterval/2),canvas.height*0.6,5,Math.PI*2,false);
                c.stroke();
            }
        }
        //draw open notes
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "20px sans-serif";
        c.fillStyle = "#ffffff";
        for(let i = 0; i<this.stringNum; i++){
            c.fillText((this.notes[this.tuning[this.tuning.length-i-1]]).toUpperCase(),6,this.neckPos.startY+(i+0.85)*stringInterval+(stringInterval/5))
        }

    }

    drawNotes(){
        //calculate the scales right?
        //first let me draw the notes and then i might just use the array of like steps to figure out the erm when to draw and when to not like u know like just skip some of them in the array based on the value in the array u feel me?
        this.strings.forEach(strin =>{
            let index = strin.note-this.root; //note - root
            this.scale.forEach(step =>{
                index += step;
                this.drawSingleNote(strin,index)
            });
        })

            
    }

    drawSingleNote(str,fret,noteText,degColor){
        let x = (this.neckWidth/this.frets*fret)+this.neckPos.startX+(this.neckWidth/this.frets)/2;
        let y = str.yPos;
        c.beginPath();
        c.arc(x,y,17,0,Math.PI*2);
        // c.fillStyle = isroot? '#ff0000':'#000000';
        c.fillStyle = this.colorPallete[degColor];
        if(!this.drawColors && degColor != 2){
            c.fillStyle = "#000000";
        }
        c.fill();
        c.stroke();
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.beginPath();
        c.fillStyle = '#ffffff';
        c.fillText(noteText,x,y);
    }

    drawNotes2(){
        this.strings.forEach(strin =>{
            let index = ((this.root+12)-strin.openNote+1)%12;
            for(let i = 0; i < strin.notes.length; i++){
                let isroot = this.root==strin.notes[i]%12? true : false;
                this.drawSingleNote(strin,i,this.notes[strin.notes[i]%12],isroot);
            }
        });
    }


    //To have chords I need to colour every 
    //chords mode:
    //I need to have a scale and then eg have a root note string like the low E
    //each note in the scale will be a chords and it will need a chord formula eg shell chords which will be 1,3,7 each 1 3 7 from each root note will need to fit into the scale.
    //the next chord just moves each note up to the next degree in the scale.
    //you have the scale and the root of the chord in the scale. the interval from the scale tonic and the chord root is how BROO IM LOSING MY TRAIN OF THOUGHT
    //one solution i can kinda think of rn is just to like have a chord formula like 137 for example and just map colours to every chord from each root in a particular scale eg key of gMaj would start with GBF# in on colour and then ACG in another. Just adding one note up in the scale for the next chord. GOT I WROTE TO MUCH AND SAID SO LITTLE i need to refactor this wording because its bad and u know what i need to refactor this code too because thats also bad. 

    //idea for feature. add some sort of like tab into the program it it can tell u what scales its a part of or what key/keys it fits into.

    lilTest(){
        this.strings.forEach(strin =>{
            let index = ((this.root+12)-(strin.openNote+1))%12;
            //position sontrolled by sum of erm steps
            let degCol = 3;
            let degNum = 1;
            this.scale.forEach(step =>{
                index = (step+index)%12;
                let noteText = this.drawDegText? degNum+1 : this.notes[strin.notes[index]%12];
                // this.drawSingleNote(strin,index,this.notes[strin.notes[index]%12],degCol);
                this.drawSingleNote(strin,index,noteText,degCol);
                degCol = (degCol+1)%7;
                degNum = (degNum+1)%7;
                
                
            })
        });
    }

    clearNeck(){
        c.clearRect(0,0,canvas.width,canvas.height);
        this.draw();
    }
}

class GString{
    constructor(num,openNote){
        this.yPos; //this value is declared within draw... my bad
        this.notes = [];
        this.openNote = openNote;
        for(let i = 1; i<num+1; i++){
            this.notes.push(openNote+i);
        }
    }
}

//UI
function UI(){
    UIContainer = document.createElement("div");
    UIContainer.classList.add("UIcontainer");

    //-----------Scale Selector-----------------------
    let scaleSelect = document.createElement("select");
    scaleSelect.classList.add("dropDown");
    scaleSelect.classList.add("scale");
    scaleSelect.setAttribute("value","scale");
    document.body.appendChild(UIContainer);
    UIContainer.appendChild(scaleSelect);
    for(let i = 0; i < guitar.scales.length; i++){
        let option = document.createElement("option");
        option.setAttribute("value",`${i}`);
        option.innerHTML = `${guitar.scales[i].name}`;
        scaleSelect.appendChild(option)
    }
    scaleSelect.style.color = "white";
    
    //----------Root Note-----------------------------
    let rootSelect = document.createElement("select");
    rootSelect.classList.add("dropDown");
    rootSelect.classList.add("root");
    rootSelect.setAttribute("value","root");
    UIContainer.appendChild(rootSelect);
    for(let i = 0; i < guitar.notes.length; i++){
        let option = document.createElement("option");
        option.setAttribute("value",`${i}`);
        option.innerHTML = `${guitar.notes[i]}`;
        rootSelect.appendChild(option);
    }
    rootSelect.style.color = "white";

    //----------Tuning--------------------------------
    let tuningSelect = document.createElement("select");
    tuningSelect.classList.add("dropDown");
    tuningSelect.classList.add("tuning");
    rootSelect.setAttribute("value","tuning");
    UIContainer.appendChild(tuningSelect);
    for(let i = 0; i < guitar.tunings.length; i++){
        let option = document.createElement("option");
        option.setAttribute("value", `${i}`);
        option.innerHTML = `${guitar.tunings[i].name}`;
        tuningSelect.appendChild(option);
    }
    tuningSelect.style.color = "white";

    //-----------Styling-------------------------------
} 





function loop(){

    getAnimationFrame(loop);
}

let guitar = new Neck();
UI();
guitar.lilTest();

//------------UI Event Handler----------------
UIContainer.onchange = (e)=>{
    // console.log(e.target.classList[1]);
    switch(e.target.classList[1]){
        case "scale":
            console.log(e.target.value);
            guitar.scale = guitar.scales[e.target.value].degs;
            break;
        case "root":
            console.log(e.target.value);
            guitar.root = parseInt(e.target.value);
            break;
        case "tuning":
            guitar.tuning = guitar.tunings[parseInt(e.target.value)].tunNotes;
            guitar.strings = [];
            guitar.initNeck();
            break;
    }
    guitar.clearNeck();
    guitar.lilTest();
}
