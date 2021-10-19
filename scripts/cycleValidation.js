// Storage-> 2D matrix
let graphComponentMatrix=[];

for(let i=0;i<rows;i++){
    let row=[];
    for(let j=0;j<cols;j++){
        //to push children of a particular cell
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

//true denotes cycle and false denotes not cyclic

function isGraphCyclic(){
    //Dependency -> visited, dfs-visited(2D array)
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

    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(visited[i][j]===true) continue;
            let ans=dfsCycleDetection(graphComponentMatrix, i , j,visited,dfsVisited);
            if(ans===true) return [i,j];
        }
    }
    return null;
}

function dfsCycleDetection(graphComponentMatrix, srcr , srcc,visited,dfsVisited){
    visited[srcr][srcc]=true;
    dfsVisited[srcr][srcc]=true;

    for(let i=0;i<graphComponentMatrix[srcr][srcc].length;i++){
        let [r,c]=graphComponentMatrix[srcr][srcc][i];
        if(dfsVisited[r][c] === true){
            return true;
        }
        if(visited[r][c]===false){
            let ans=dfsCycleDetection(graphComponentMatrix, r , c,visited,dfsVisited);
            if(ans == true) return true;
        }
        
    }

    dfsVisited[srcr][srcc]=false;
    return false;
}