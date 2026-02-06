draw_set_color(c_dkgrey)
draw_roundrect_ext(w-140,15,w-15,h-15,12,12,false)
draw_set_color(c_white)
for (var i=0; i<array_length(buttons); i++){draw_roundrect_ext(w-130,25+75*i,w-25,75*(i+1),12,12,false)}
draw_set_color(c_black)
draw_set_font(spartan)
for (var i=0; i<array_length(buttons); i++){draw_text_transformed(w-125,38+75*i,buttons[i].text,0.175,0.175,0)}