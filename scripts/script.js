let rows=100;
let cols=26;

let adressColCont=document.querySelector(".adress-col-cont");
for(let i=0;i<rows;i++){
    let adressCol=document.createElement("div");
    adressCol.innerText=i+1;
    adressCol.setAttribute("class","adress-col");
    adressColCont.appendChild(adressCol);
}

let adressRowCont=document.querySelector(".adress-row-cont");
for(let i=0;i<cols;i++){
    let adressRow=document.createElement("div");
    adressRow.innerText=String.fromCharCode(65+i);
    adressRow.setAttribute("class","adress-row");
    adressRowCont.appendChild(adressRow); 
}

let cellsCont=document.querySelector(".cells-cont");
for(let i=0;i<rows;i++){
    let rowCont=document.createElement("div");
    rowCont.setAttribute("class","row-cont");
    for(let j=0;j<cols;j++){
        let cell=document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true");
        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell,i,j);
    }
    cellsCont.appendChild(rowCont);
}

let adressBar=document.querySelector(".adress-bar");
function addListenerForAddressBarDisplay(cell,i,j){
    cell.addEventListener("click",(e)=>{
        let val=String.fromCharCode(65+j)+(i+1);
        adressBar.value=val;
    })
}