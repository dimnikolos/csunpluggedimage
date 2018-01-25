//Starting main -------------------------------
var rows = 18;
var cols = 18;
var LD = 20;
var CW = cols * LD; //WIDTH
var CH = rows * LD; //HEIGHT

var theImage = new imArray();
var amDrawing = false;
var cwhite = '#f0f0f0';
var cblack = '#a0a0a0';
var canvas = document.getElementById('cgrid');
var ctx = canvas.getContext('2d');

var theImage = new imArray(rows,cols);

var prevCell = {i:-1,j:-1};


//helper function
function showText(){
    $('#ctext').val(theImage.toTextRepr());
}
//helper function
function distance(a,b){
    //a and b are returned from etoij
    //zero if a == b
    //different than zero if a != b
    return(a.i - b.i + (a.j - b.j));
}
//helper function
function etoij(e){
        //x,y relative positions
        var rx = e.clientX - canvas.getBoundingClientRect().left;
        var ry = e.clientY - canvas.getBoundingClientRect().top;

        //i,j in image
        var i = Math.floor(ry/LD);
        var j = Math.floor(rx/LD);
        return {i:i,j:j};
}
//helper function
function drawGrid(ctx,image){
    for (var x=0; x<CW; x+=LD){
        for (var y=0; y<CH; y+=LD){
            j = Math.floor(x/LD);
            i = Math.floor(y/LD);
            if (image[i][j] == 0)
                ctx.fillStyle = cwhite;
            else
                ctx.fillStyle = cblack
            ctx.beginPath();
            ctx.rect(x,y,LD,LD);
            ctx.fillRect(x+1,y+1,LD-2,LD-2);
            ctx.stroke();

        }
    }
}

function reset(){
    console.log(theImage.str());
    ctx.fillStyle = cwhite;
    ctx.strokeStyle = cblack;
    theImage.reset();
    drawGrid(ctx,theImage.imageArr);
    showText();
}


function fromText(){
    theImage.fromTextRepr($('#ctext').val());
    drawGrid(ctx,theImage.imageArr);
}


$('#cgrid').on('click',function(e){
    currentCell = etoij(e);
    if (distance(currentCell,startingCell) == 0){

        i = currentCell.i;
        j = currentCell.j;

        
        theImage.flip(i,j);
        drawGrid(ctx,theImage.imageArr);
        showText();
        prevCell = currentCell;
    }

});


$('#cgrid').mousemove(function(e){
    if (amDrawing){
        currentCell = etoij(e);
        if (distance(currentCell,prevCell)!=0){
            i = currentCell.i;
            j = currentCell.j;
            theImage.flip(i,j);
            drawGrid(ctx,theImage.imageArr);
            showText();
            prevCell = currentCell;
        }
    }
});

$('#cgrid').mousedown(function(e){
    startingCell = etoij(e);
    amDrawing = true;
});
$('#cgrid').mouseup(function(e){
    amDrawing = false;
});

