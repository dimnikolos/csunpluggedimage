class imArray{
  constructor(){
    this.imageArr = [];
    for (var i=0; i<CH/LD; i+=1){
      this.imageArr.push([])
      for (var j=0; j<CW/LD; j+=1){
        this.imageArr[this.imageArr.length - 1].push(0);
   	  }
    }
  }//constructor
  str(){
  	var strings = []
    for (var i=0; i<CH/LD; i+=1){
    	strings.push('\n');
      for (var j=0; j<CW/LD; j+=1){
      	strings.push(this.imageArr[j][i].toString());
   	  }
    }
    return(strings.join(""));
  }
    
  reset(){
    for (var i=0; i<CH/LD; i+=1){
      for (var j=0; j<CW/LD; j+=1){
      	this.imageArr[i][j] = 0;
   	  }
    }
  }
  flip(i,j){
    this.imageArr[i][j] = 1 - this.imageArr[i][j];
  }


  
  fromTextRepr(text){
    var row = 0;
    var textarray = text.split("\n");
    for (var row=0; row<textarray.length; row++){
      var start = 0;
      var color = 0; //0 - white, 1 - black
      var linearray = textarray[row].split(",");
      for (var series=0; series<linearray.length; series++){
        for (var i=0; i<parseInt(linearray[series]); i++){
          this.imageArr[start + i][row] = color;
        }
        color = 1 - color;
        start += parseInt(linearray[series]);
      }
      
      if (start < 18){
        for (var i=0; i < 18-start; i++){
          this.imageArr[start + i][row] = color;
        }
      }
  	}
    while (row<18){
      for (var j=0; j < 18; j++)
      	this.imageArr[j][row] = 0;
      row+=1
    }
  }
  toTextRepr(){
    var lines = [];
    var text = '';
    for (var i=0; i<CH/LD; i++){
	  if (this.imageArr[i][0]==1)
        text +='0,'
      var counting = this.imageArr[i][0];
      var theCount = 0;
      for (var j=0; j<CW/LD; j++){
      	if (this.imageArr[j][i] == counting)
      		theCount++;
      	else{
      		text = text.concat(theCount.toString()).concat(',');
      		counting = 1 - counting;
      		theCount = 1;
      	}
      }
      text = text.concat(theCount.toString());
      text = text.concat('\n');
    }
    return(text);
  }
}//class

//Strarting main -------------------------------
var canvas = document.getElementById("cgrid");
var prevPosX = 0;
var prevPosY = 0;
var LD = 20;
var CW = 360;
var CH = 360;
var DEBUG = true;
var theImage = new imArray();

canvas.addEventListener('click', function(e){
	var mx = e.clientX - canvas.getBoundingClientRect().left;
	var my = e.clientY - canvas.getBoundingClientRect().top
	var ctx = canvas.getContext("2d");

	for (var x=0; x<CW; x+=LD){
		for (var y=0; y<CH; y+=LD){
			if (mx > x && mx < x + LD){
				if (my > y && my < y + LD){
					if (theImage.imageArr[x/LD][y/LD] == 0)
						ctx.fillStyle = "#000000";
					else
						ctx.fillStyle = "#f0f0f0";
				ctx.fillRect(x+1,y+1,LD-2,LD-2);
				theImage.flip(x/LD,y/LD);
				document.getElementById('ctext').value = theImage.toTextRepr();
				break;
				}
			}
		}
	}

}, false);


function handlemousemove(e){
  var mx = e.clientX - canvas.getBoundingClientRect().left;
  var my = e.clientY - canvas.getBoundingClientRect().top
  var ctx = canvas.getContext("2d");
  var i = Math.floor(my/LD);
  var j = Math.floor(mx/LD);
  if (Math.abs(prevPosY-i) > 0 || Math.abs(prevPosX-j) >0){
    prevPosY = i;
    prevPosX = j;
    console.log(theImage.str());
    theImage.flip(j,i);
    my = i*LD;
    mx = j*LD;
    if (theImage.imageArr[i][j] == 0)
      ctx.fillStyle = "#000000";
    else
      ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(mx+1,my+1,LD-2,LD-2);
    document.getElementById('ctext').value = theImage.toTextRepr();
    }
}

canvas.addEventListener('mousedown', function(e){
  canvas.addEventListener('mousemove',handlemousemove, false);
},false);

canvas.addEventListener('mouseup', function(e){
  var mx = e.clientX - canvas.getBoundingClientRect().left;
  var my = e.clientY - canvas.getBoundingClientRect().top
  var ctx = canvas.getContext("2d");
  var i = Math.floor(my/LD);
  var j = Math.floor(mx/LD);
  
  prevPosY = i;
  prevPosX = j;
  console.log(theImage.str());
  theImage.flip(j,i);
  my = i*LD;
  mx = j*LD;
  if (theImage.imageArr[i][j] == 0)
    ctx.fillStyle = "#000000";
  else
    ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(mx+1,my+1,LD-2,LD-2);
  document.getElementById('ctext').value = theImage.toTextRepr();
  
  canvas.removeEventListener('mousemove',handlemousemove, false);
},false);









function init(canvas){
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = "#f0f0f0";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.rect(0,0,CH,CW);
	ctx.stroke();

	for (var x=0; x<CW; x+=LD){
		for (var y=0; y<CH; y+=LD){
			ctx.beginPath();
			ctx.rect(x,y,LD,LD);
			ctx.fillRect(x+1,y+1,LD-2,LD-2);
			ctx.stroke();
		}
	}
}

function drawFromRepr(imageInst){
	var ctx = canvas.getContext("2d");
	for (var x=0; x<CW; x+=LD){
		for (var y=0; y<CH; y+=LD){
			ctx.beginPath();
      ctx.strokeStyle = 2;
			ctx.rect(x,y,LD,LD);
      ctx.stroke();
			if (imageInst.imageArr[x/LD][y/LD] == 0)
				ctx.fillStyle = "#f0f0f0";
			else
				ctx.fillStyle = "#000000";
			ctx.fillRect(x+1,y+1,LD-2,LD-2);
		}
	}

}

function drawImageFromText(){
	theImage.fromTextRepr(document.getElementById('ctext').value);
	drawFromRepr(theImage);
}

function reset(){
	document.getElementById('ctext').value = "";
	theImage.reset();
	drawFromRepr(theImage);

}

document.onload = reset(canvas);