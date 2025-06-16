#region element cycling

elements = [["a",1],["b",1],["c",2],["d",3],["e",4]]
#After bringing b to the front
elementgBringingB = [["a",1],["c",1],["d",2],["e",3],["b",4]]
#After bringing c to the front
elementsBringingC = [["a",1],["b",1],["d",2],["e",3],["c",4]]
'''
Assertion=>
tempStore=last.depth
for all elements after the selected one:
    depth -> previous_element.depth
selected.depth=tempStore
'''