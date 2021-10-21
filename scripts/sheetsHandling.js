let addSheetBtn=document.querySelector(".sheet-add-icon");
let sheetsFolderCont=document.querySelector(".sheets-folder-cont");
addSheetBtn.addEventListener("click",(e)=>{
    let sheet=document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolders.length);

    sheet.innerHTML=`
        <div class="sheet-content">Sheet-${allSheetFolders.length+1}</div>
    `;
    sheetsFolderCont.appendChild(sheet);
    //DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        if(e.button !==2){
            return;
        } //0->left 1-> drag 2->rightclick
        let allSheetFolders=document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length == 1){
            alert("You neet to have at least 1 sheet!!");
            return;
        }
        let response=confirm("Your sheet will be removed permanently. Are you sure?");
        if( response === false){
            return;
        }
        let sheetIdx=Number(sheet.getAttribute("id"));
        collectedSheetDB.splice(sheetIdx,1);
        collectedGraphComponent.splice(sheetIdx,1);
        handleSheetUIRemoval(sheet);
        //by default sheet 1 to active
        
    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent=allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText=`Sheet-${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    allSheetFolders[0].click();
}

function handleSheetDB(sheetIdx){
    sheetDB=collectedSheetDB[sheetIdx];
    graphComponentMatrix=collectedGraphComponent[sheetIdx];
}

function handleSheetProperties(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstCell=document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet){
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for( let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    sheet.style.backgroundColor="grey";
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click",(e)=>{
        let sheetIdx=Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}



function createSheetDB(){
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
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphComponentMatrix=[];

    for(let i=0;i<rows;i++){
        let row=[];
        for(let j=0;j<cols;j++){
            //to push children of a particular cell
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}