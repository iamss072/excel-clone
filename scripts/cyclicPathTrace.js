//for delay and wait
function colorPromise(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

//true denotes cycle and false denotes not cyclic

async function isGraphCyclicTracePath(cycleResponse){
    //Dependency -> visited, dfs-visited(2D array)
    let[srcr,srcc]=cycleResponse;
    let visited=[];
    let dfsVisited = [];
    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let dfsVisitedRow=[];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    // for(let i=0;i<rows;i++){
    //     for(let j=0;j<cols;j++){
    //         if(visited[i][j]===true) continue;
    //         let ans=dfsCycleDetection(graphComponentMatrix, i , j,visited,dfsVisited);
    //         if(ans===true) return true;
    //     }
    // }
    let ans=await dfsCycleDetectionTracePath(graphComponentMatrix, srcr , srcc,visited,dfsVisited);
    if(ans === true){
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}


//coloring cells for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcr , srcc,visited,dfsVisited){
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;
    let cell=document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
    let originalColor=cell.style.backgroundColor;
    cell.style.backgroundColor="lightblue";
    await colorPromise();
    
    for(let i=0;i<graphComponentMatrix[srcr][srcc].length;i++){
        let [r,c]=graphComponentMatrix[srcr][srcc][i];
        if(dfsVisited[r][c] === true){
            let cyclicCell=document.querySelector(`.cell[rid="${r}"][cid="${c}"]`);
            let curcolor=cyclicCell.style.backgroundColor;
            cyclicCell.style.backgroundColor="lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor=curcolor;
            await colorPromise();
            cell.style.backgroundColor=originalColor;
            return Promise.resolve(true);
        }
        if(visited[r][c]===false){
            let ans=await dfsCycleDetectionTracePath(graphComponentMatrix, r , c,visited,dfsVisited);
            if(ans == true){
                await colorPromise();
                cell.style.backgroundColor=originalColor;
                return Promise.resolve(true);
            }
        }
        
    }
    cell.style.backgroundColor=originalColor;
    await colorPromise();
    dfsVisited[srcr][srcc]=false;
    return Promise.resolve(false);
}