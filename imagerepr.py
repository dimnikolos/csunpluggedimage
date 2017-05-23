from tkinter import *
import tkMessageBox
import tkFileDialog

LINE_DISTANCE = 20
CANVAS_WIDTH = 360
CANVAS_HEIGHT = 360 

rect = []
for i in range(CANVAS_HEIGHT//LINE_DISTANCE):
  rect.append([])
  for j in range(CANVAS_WIDTH//LINE_DISTANCE):
    rect[-1].append(0)


def rectIndexFromXY(x,y):
  return((y//LINE_DISTANCE,x//LINE_DISTANCE))

def numRepr():
  nums = []
  for row in rect:
    nums.append([])
    count = 0
    countType = 0 #0 means white
                  #1 means black
    for cell in row:
      if cell == countType:
        count += 1
      else:
        nums[-1].append(count)
        countType = (countType + 1) % 2
        count = 1
    nums[-1].append(count)
  return(nums)

master = Tk()
w = Canvas(master, 
           width=CANVAS_WIDTH,
           height=CANVAS_HEIGHT)

def checkered():
  # horizontal lines at an interval of "line_distance" pixel
  for x in range(0,CANVAS_WIDTH,LINE_DISTANCE):
    # vertical lines at an interval of "line_distance" pixel
    for y in range(0,CANVAS_HEIGHT,LINE_DISTANCE):
      w.create_rectangle(x, y, x+LINE_DISTANCE,y+LINE_DISTANCE, fill="#ffffff")

def drawRect():
  for x in range(0,CANVAS_WIDTH,LINE_DISTANCE):
    # vertical lines at an interval of "line_distance" pixel
    for y in range(0,CANVAS_HEIGHT,LINE_DISTANCE):
        if rect[x//LINE_DISTANCE][y//LINE_DISTANCE] == 0:
          w.create_rectangle(x,y,x + LINE_DISTANCE, y+LINE_DISTANCE, fill="#ffffff")
        else:
          w.create_rectangle(x,y,x + LINE_DISTANCE, y+LINE_DISTANCE, fill="#000000")   

def openFile():
  with tkFileDialog.askopenfile(mode='r') as f:
    row = 0
    for line in f.readlines():
      startSer = 0
      countType = 0
      for num in line.split(","):
        for i in range(int(num)):
          rect[startSer + i][row] = countType
        countType = (countType + 1) % 2
        startSer += int(num)
      if startSer < 18:
        for i in range(18-startSer):
          rect[startSer + i][row] = countType
      row += 1
      if row==18:
        break
    drawRect()





def saveFile():
  with tkFileDialog.asksaveasfile(mode='w') as f:
    for line in numRepr():
      f.write(",".join([str(x) for x in line])+"\n")

  


def clicked(event):
  for x in range(0,CANVAS_WIDTH,LINE_DISTANCE):
    # vertical lines at an interval of "line_distance" pixel
    for y in range(0,CANVAS_HEIGHT,LINE_DISTANCE):
      if x < event.x < x+LINE_DISTANCE and y < event.y < y+LINE_DISTANCE:
        if rect[rectIndexFromXY(event.x,event.y)[0]][rectIndexFromXY(event.x,event.y)[1]] == 0:
          w.create_rectangle(x,y,x + LINE_DISTANCE, y+LINE_DISTANCE, fill="#000000")
          rect[rectIndexFromXY(event.x,event.y)[0]][rectIndexFromXY(event.x,event.y)[1]] = 1
        else:
          w.create_rectangle(x,y,x + LINE_DISTANCE, y+LINE_DISTANCE, fill="#ffffff")
          rect[rectIndexFromXY(event.x,event.y)[0]][rectIndexFromXY(event.x,event.y)[1]] = 0


#The file menu
menubar = Menu(master)
filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="Open", command=openFile)
filemenu.add_command(label="Save", command=saveFile)
filemenu.add_separator()
filemenu.add_command(label="Exit", command=master.quit)
menubar.add_cascade(label="File", menu=filemenu)
master.config(menu=menubar)

w.pack()
w.bind("<Button-1>", clicked)

checkered()

mainloop()
