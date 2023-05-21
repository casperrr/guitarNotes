const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

class Neck{
    constructor(tune){
        this.stringNum = 6;
        this.frets = 12;
        //             0   1    2   3   4    5   6    7   8   9   10   11
        this.notes = ["a","a#","b","c","c#","d","d#","e","f","f#","g","g#"];
        //               standard       drop-d
        this.tunings = [[7,0,5,10,2,7],[5,0,5,10,2,7]];
        this.tuning = this.tunings[tune];
        this.strings = [];
        this.neckWidth = canvas.width*(1-0.03*2);
        this.neckHeight = canvas.height*(1-0.15*2);
        this.neckPos = {
            startX: (canvas.width-this.neckWidth)/2,
            startY: (canvas.height-this.neckHeight)/2,
            endX: (canvas.width-this.neckWidth)/2 + this.neckWidth,
            endY: (canvas.height-this.neckHeight)/2 + this.neckHeight,
        };
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

        this.scale = this.scales[0].degs;
        this.root = 0;

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

    drawSingleNote(str,fret,noteText,isroot){
        let x = (this.neckWidth/this.frets*fret)+this.neckPos.startX+(this.neckWidth/this.frets)/2;
        let y = str.yPos;
        c.beginPath();
        c.arc(x,y,17,0,Math.PI*2);
        c.fillStyle = isroot? '#ff0000':'#000000';
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

    lilTest(){
        this.strings.forEach(strin =>{
            let index = ((this.root+12)-(strin.openNote+1))%12;
            //position sontrolled by sum of erm steps
            this.drawSingleNote(strin,index,this.notes[strin.notes[index]%12],true);
            let rootLoc = index;
            this.scale.forEach(step =>{
                index = (step+index)%12;
                if(index != rootLoc) this.drawSingleNote(strin,index,this.notes[strin.notes[index]%12]);
                
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
} 





function loop(){

    getAnimationFrame(loop);
}

let guitar = new Neck(0);
UI();
guitar.lilTest();

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
    }
    guitar.clearNeck();
    guitar.lilTest();
}
