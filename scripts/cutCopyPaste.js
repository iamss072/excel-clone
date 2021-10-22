let ctrlKey;
let originalBorder="1px solid rgb(224, 223, 223)";

document.addEventListener("keydown",(e)=>{
    ctrlKey=e.ctrlKey;
})

document.addEventListener("keyup",(e)=>{
    ctrlKey=e.ctrlKey;
})

for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn=document.querySelector(".copy");
let cutBtn=document.querySelector(".cut");
let pasteBtn=document.querySelector(".paste");

let rangeStorage=[];
function handleSelectedCells(cell){
    cell.addEventListener("click",(e)=>{
        // console.log(e);
        // if(e.ctrlKey === false) return;
        //select cells range work
        if(!ctrlKey) return;

        if(rangeStorage.length >= 2){
            defaultSelectedCellsUI();
            rangeStorage=[];
            
            // return;
        }

        //UI
        cell.style.border="3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,cid]);
    })
}

function defaultSelectedCellsUI(){
    for(let i=0;i<rangeStorage.length;i++){
        let cell=document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border=originalBorder;
    }
}

let copyData=[];

copyBtn.addEventListener("click",(e)=>{

    if(rangeStorage.length<2) return;
    copyData=[];

    let strow=rangeStorage[0][0];
    let stcol=rangeStorage[0][1];
    let endrow=rangeStorage[1][0];
    let endcol=rangeStorage[1][1];
    for(let i=strow;i<=endrow;i++){
        let copyRow=[];
        for(let j=stcol;j<=endcol;j++){
            let cellProp=JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click",(e)=>{

    if(rangeStorage.length<2) return;
    copyData=[];
    let strow=rangeStorage[0][0];
    let stcol=rangeStorage[0][1];
    let endrow=rangeStorage[1][0];
    let endcol=rangeStorage[1][1];
    for(let i=strow;i<=endrow;i++){
        let copyRow=[];
        for(let j=stcol;j<=endcol;j++){

            //DB
            let cellProp=sheetDB[i][j];
            let tempcellProp=JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(tempcellProp);

            cellProp.bold=false;
            cellProp.italic=false;
            cellProp.underline=false;
            cellProp.alignment="left";
            cellProp.fontFamily="monospace";
            cellProp.fontSize=14;
            cellProp.fontColor="#000000";
            cellProp.BGcolor="#ffffff";
            cellProp.value= "";

            //UI
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
        copyData.push(copyRow);
    }
    // console.log(copyData);
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2) return;
    let rowDiff=Math.abs(rangeStorage[0][0]-rangeStorage[1][0]);
    let colDiff=Math.abs(rangeStorage[0][1]-rangeStorage[1][1]);
    //Paste cells data work
    let adress=adressBar.value;
    let[stRow,stCol]=decodeRIDCIDFromAdress(adress);

    for(let i=stRow,r=0;i<=stRow+rowDiff;i++,r++){
        for(let j=stCol,c=0;j<=stCol+colDiff;j++,c++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell){
                continue;
            }
            let data=copyData[r][c];
            let cellProp=sheetDB[i][j];

            cellProp.bold=data.bold;
            cellProp.italic=data.italic;
            cellProp.underline=data.underline;
            cellProp.alignment=data.alignment;
            cellProp.fontFamily=data.fontFamily;
            cellProp.fontSize=data.fontSize;
            cellProp.fontColor=data.fontColor;
            cellProp.BGcolor=data.BGcolor;
            cellProp.value= data.value;
            

            cell.click();
        }
    }

})