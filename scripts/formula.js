for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let adress=adressBar.value;
            let[activeCell,cellProp] = getCellAndCellProp(adress);
            let enteredData = activeCell.innerText;

            if(enteredData == cellProp.value) return;

            cellProp.value=enteredData;
            //if data modified remove P-C relation , formula empty , update children with hardcoded value
            removeChildFromParent(cellProp.formula);
            cellProp.formula="";
            updateChildrenCells(adress);
        })
    }
}

let formulaBar=document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula=formulaBar.value;
    if(e.key=="Enter" && inputFormula){
        
        

        //if change in formula break old parent child relation
        let adress = adressBar.value;
        let [cell,cellProp]=getCellAndCellProp(adress);
        if(inputFormula !== cellProp.formula){
            removeChildFromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula,adress);

        //check formula is cyclic or not then evaluate
        //true denotes cycle and false denotes not cyclic
        let cycleResponse=isGraphCyclic();

        if(cycleResponse){
            // alert("Your formula is cyclic");
            let response=confirm("Your formula is cyclic. Do you want to trace your path?");

            while(response === true){
                //Keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(cycleResponse); // I want to complete full iteration of color tracking so i will wait here also
                response=confirm("Your formula is cyclic. Do you want to trace your path?");
            }

            removeChildFromGraphComponent(inputFormula,adress);
            return;
        }

        let evaluatedValue=evaluateFormula(inputFormula);

        

        setcellUIAndCellProp(evaluatedValue,inputFormula,adress); //to update UI and cell prop in DB

        addChildToParent(inputFormula);

        updateChildrenCells(adress)
    }
})

function addChildToParent(formula){
    let childAdress=adressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAdress);
        }
    }
}



function removeChildFromParent(formula){
    let childAdress=adressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=getCellAndCellProp(encodedFormula[i]);
            let idx=parentCellProp.children.indexOf(childAdress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

function addChildToGraphComponent(formula, childAdress){
    let[crid,ccid]=decodeRIDCIDFromAdress(childAdress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let[prid,pcid]=decodeRIDCIDFromAdress(encodedFormula[i]);
            //B1 : A1 + 10
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula,childAdress){
    let[crid,ccid]=decodeRIDCIDFromAdress(childAdress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let[prid,pcid]=decodeRIDCIDFromAdress(encodedFormula[i]);
            
            graphComponentMatrix[prid][pcid].pop();//removes only last one causing cycle that was intially pushed
        }
    }
}

function updateChildrenCells(parentAdress){
    let [parentCell,parentCellProp] = getCellAndCellProp(parentAdress);
    let children=parentCellProp.children;

    for(let i=0;i<children.length;i++){
        let childAdress = children[i];
        let [childCell,childCellProp] = getCellAndCellProp(childAdress);

        let childFormula=childCellProp.formula;
        let evaluatedChildValue=evaluateFormula(childFormula);

        setcellUIAndCellProp(evaluatedChildValue,childFormula,childAdress);

        updateChildrenCells(childAdress);
    }
}

function evaluateFormula(formula){
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [cell,cellProp]=getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
        }
    }
    let decodedFormula=encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setcellUIAndCellProp(evaluatedValue,formula,adress){
    let [cell,cellProp]=getCellAndCellProp(adress);

    cell.innerText=evaluatedValue; //UI update
    cellProp.value=evaluatedValue; //DB update
    cellProp.formula=formula;
}