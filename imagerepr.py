from tkinter import *
from itertools import groupby
import tkMessageBox
import tkFileDialog

LD = 20 #line distance
CW = 360 #canvas width
CH = 360 #canvas height
DEBUG = False

class imArray:
  def __init__(self):
    self.rect = []
    #initialize rect
    for i in range(CH//LD):
      self.rect.append([])
      for j in range(CW//LD):
        self.rect[-1].append(0)
  def __str__(self):
    return("\n".join(["".join([str(x) for x in row]) for row in self.rect]))
  def flip(self,i,j):
    self.rect[i][j] = (self.rect[i][j] + 1) % 2
  def fromTextRepr(self,text):
    row = 0
    for line in text.split("\n"):
      start = 0
      color = 0 #0 - white, 1 - black
      if DEBUG:
        print(line.split(","))
      for series in line.split(","):
        for i in range(int(series)):
          self.rect[row][start + i] = color
        #proceed to next value
        color = (color + 1) % 2
        start += int(series)
      #fill next columns with the next color
      if start < 18:
        for i in range(18-start):
          self.rect[row][start + i] = color
      row += 1
    #fill next rows with white
    while row<18:
      self.rect[row][:] = [0]*18
      row+=1
    if DEBUG:
      print(str(self))
  def toTextRepr(self):
    lines = []
    for row in self.rect:
      groups = groupby(row)
      if next(groups)[0]==1:
        text="0,"
      else:
        text=""
      groups = groupby(row)
      text+=",".join([str(len(list(appearances))) 
        for (_,appearances) in groups])
      if DEBUG:
        print(text)
      lines.append(text)
    returnText = "\n".join(lines)
    if DEBUG:
      print(returnText)
    return(returnText)

class canvasClass:
  def __init__(self,canvas):
    self.canvas = canvas
    # horizontal lines at an interval of "LD" pixel
    for x in range(0,CW,LD):
      # vertical lines at an interval of "LD" pixel
      for y in range(0,CH,LD):
        canvas.create_rectangle(x, y, x+LD,y+LD, fill="#ffffff")
  def draw(self):
    for i in range(len(theImArray.rect)):
      for j in range(len(theImArray.rect[i])):
        if theImArray.rect[i][j] == 0:
          self.canvas.create_rectangle(j*LD,i*LD, (j+1)*LD, (i+1)*LD, fill="#ffffff")
        else:
          self.canvas.create_rectangle(j*LD,i*LD, (j+1)*LD, (i+1)*LD, fill="#000000")
  def paint(self,i,j,color):
    self.canvas.create_rectangle(j*LD,i*LD, (j+1)*LD, (i+1)*LD, fill=color)
    if DEBUG:
      print(str(theImArray))    



def openFile():
  with tkFileDialog.askopenfile(mode='r') as f:
    theImArray.fromTextRepr(f.read())
    theCanvas.draw()


def saveFile():
  with tkFileDialog.asksaveasfile(mode='w') as f:
    f.write(theImArray.toTextRepr())

def clicked(event):
  i = event.y//LD
  j = event.x//LD
  theImArray.flip(i,j)
  if theImArray.rect[i][j] == 0:
    theCanvas.paint(i,j,"#ffffff")
  else:
    theCanvas.paint(i,j,"#000000")

theImArray = imArray()
print(str(theImArray))

master = Tk()

theCanvas = canvasClass(Canvas(master, width=CW, height=CH))

#The file menu
menubar = Menu(master)
filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="Open", command=openFile)
filemenu.add_command(label="Save", command=saveFile)
filemenu.add_separator()
filemenu.add_command(label="Exit", command=master.quit)
menubar.add_cascade(label="File", menu=filemenu)
master.config(menu=menubar)

theCanvas.canvas.pack()
theCanvas.canvas.bind("<Button-1>", clicked)

mainloop()
