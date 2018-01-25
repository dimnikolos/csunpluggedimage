class imArray{
  constructor(rows,cols){
    this.rows = rows
    this.cols = cols
    this.imageArr = []
    for (var i = 0; i<rows; i+=1){
      this.imageArr.push([])
      for (var j=0; j<cols; j+=1){
        this.imageArr[this.imageArr.length-1].push(0);
      }
    }

  }//constructor

  str(){
    var s = []
    for (var i=0; i<this.rows; i+=1){
      s.push('\n');
      s.push(i.toString())
      s.push(':')
      for (var j=0; j<this.cols; j+=1){
        s.push(this.imageArr[i][j].toString());
      }
    }
    return(s.join(""));
  }
    
  reset(){
    for (var i=0; i<this.rows; i+=1){
      for (var j=0; j<this.cols; j+=1){
        this.imageArr[i][j] = 0;
      }
    }
  }
  
  paint(i,j,color){
    this.imageArr[i][j] =  color;
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
          this.paint(row,start+i,color)
        }
        color = 1 - color;
        start += parseInt(linearray[series]);
      }
      
      if (start < 18){
        for (var i=0; i < 18-start; i++){
          this.paint(row,start+i,color)
        }
      }
    }
    while (row<18){
      for (var j=0; j < 18; j++)
        this.paint(row,j,0)
      row+=1
    }
  }//fromTextRepr
  toTextRepr(){
    var lines = [];
    var text = '';
    for (var i=0; i<this.rows; i++){
      if (this.imageArr[i][0]==1)
        text +='0,'
      var counting = this.imageArr[i][0];
      var theCount = 0;
      for (var j=0; j<this.cols; j++){
        if (this.imageArr[i][j] == counting)
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
  }//toTextRepr
}//class


function testImArray(){
  theImage = new imArray(18,18);
  console.log(theImage.str());
  for (var i =0; i<18; i++)
    theImage.paint(i,i,1);
  console.log(theImage.toTextRepr());
  theImage.fromTextRepr('0,1,17\n1,1,16\n2,1,15\n3,1,14\n4,1,13\n5,1,12\n6,1,11\n7,1,10\n8,1,9\n9,1,8\n10,1,7\n\
    11,1,6\n12,1,5\n13,1,4\n14,1,3\n15,1,2\n16,1,1\n16,1,1\n');
  console.log(theImage.str());
}