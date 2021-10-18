//storage
let sheetDB=[];

for(let i=0;i<rows;i++){
    let sheetRow=[];
    for(let j=0;j<cols;j++){
        let cellProp={
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            BGcolor: "#ffffff",
            value: "",
            formula: "",
            children: [],
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

//selectors for cell properties
let bold=document.querySelector(".bold");
let italic=document.querySelector(".italic");
let underline=document.querySelector(".underline");
let fontSize=document.querySelector(".font-size-prop");
let fontFamily=document.querySelector(".font-family-prop");
let fontColor=document.querySelector(".font-color-prop");
let BGcolor=document.querySelector(".BGcolor-prop");
let alignment=document.querySelectorAll(".alignment");
let leftAlign=alignment[0];
let centerAlign=alignment[1];
let rightAlign=alignment[2];


//application of two way binding
//attach property listeners

// let adressBar=document.querySelector(".adress-bar");
let activeColorProp="#f1f2f6";
let inactiveColorProp="lightgray";
bold.addEventListener("click",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    //modification
    cellProp.bold=!cellProp.bold; //Data change
    cell.style.fontWeight=cellProp.bold?"bold":"normal"; //UI change
    bold.style.backgroundColor=cellProp.bold ? activeColorProp : inactiveColorProp;
})

italic.addEventListener("click",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    //modification
    cellProp.italic=!cellProp.italic; //Data change
    cell.style.fontStyle=cellProp.italic?"italic":"normal"; //UI change
    italic.style.backgroundColor=cellProp.italic ? activeColorProp : inactiveColorProp;
})

underline.addEventListener("click",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    //modification
    cellProp.underline=!cellProp.underline; //Data change
    cell.style.textDecoration=cellProp.underline?"underline":"none"; //UI change
    underline.style.backgroundColor=cellProp.underline ? activeColorProp : inactiveColorProp;
})


fontSize.addEventListener("change",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    cellProp.fontSize=fontSize.value; //Data change
    cell.style.fontSize=cellProp.fontSize + "px"; //Cell UI change
    fontSize.value=cellProp.fontSize;

})

fontFamily.addEventListener("change",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    cellProp.fontFamily=fontFamily.value; //Data change
    cell.style.fontFamily=cellProp.fontFamily;
    fontFamily.value=cellProp.fontFamily;
})

fontColor.addEventListener("change",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    cellProp.fontColor=fontColor.value; //Data change
    cell.style.color=cellProp.fontColor;
    fontColor.value=cellProp.fontColor;
})


BGcolor.addEventListener("change",(e)=>{
    let adress=adressBar.value;
    let [cell,cellProp]=getCellAndCellProp(adress);

    cellProp.BGcolor=BGcolor.value; //Data change
    cell.style.backgroundColor=cellProp.BGcolor;
    BGcolor.value=cellProp.BGcolor;
})


alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e)=>{
        let adress=adressBar.value;
        let [cell,cellProp]=getCellAndCellProp(adress);

        let alignValue=e.target.classList[0];
        cellProp.alignment=alignValue;
        cell.style.textAlign=cellProp.alignment; //cell UI change
        
        switch(alignValue){ //icon UI change
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;
        }
    })
})

let allCells=document.querySelectorAll(".cell");

for(let i=0;i<allCells.length;i++){
    addListenerToAttachCellProperties(allCells[i]);
}



function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{
        let adress=adressBar.value;
        let [rid,cid]=decodeRIDCIDFromAdress(adress);
        let cellProp=sheetDB[rid][cid];
        
        //set formula bar

        let formulaBar=document.querySelector(".formula-bar");
        formulaBar.value=cellProp.formula;
        
        //apply cell properties
        
        cell.style.fontWeight=cellProp.bold?"bold":"normal";
        cell.style.fontStyle=cellProp.italic?"italic":"normal";
        cell.style.textDecoration=cellProp.underline?"underline":"none";
        cell.style.fontSize=cellProp.fontSize + "px";
        cell.style.fontFamily=cellProp.fontFamily;
        cell.style.color=cellProp.fontColor;
        cell.style.backgroundColor=cellProp.BGcolor;
        cell.style.textAlign=cellProp.alignment;

        //icon reflection

        bold.style.backgroundColor=cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor=cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor=cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value=cellProp.fontSize;
        fontFamily.value=cellProp.fontFamily;
        fontColor.value=cellProp.fontColor;
        BGcolor.value=cellProp.BGcolor;

        let alignValue=cellProp.alignment;
        switch(alignValue){ //icon UI change
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;
        }
    })
}


function getCellAndCellProp(adress){
    let [rid,cid]=decodeRIDCIDFromAdress(adress);
    //access cell & storage object
    let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp=sheetDB[rid][cid];
    return [cell,cellProp];
}
function decodeRIDCIDFromAdress(adress){
    //adress-> "A1"
    let rid=Number(adress.slice(1))-1; //"1"->1->0
    let cid=adress.charCodeAt(0)-65; //"A"->65
    return [rid,cid];
}
