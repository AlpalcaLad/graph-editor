placed = false
clickDl = true
containedText = [""]
highlighted = false
selectedIndex = 0
enterDl = false
longestLength = 0
deleteDl = false

index = 0
with box_o other.index ++


bbox = [x-50,y-20,x+50+clamp(string_width(longestLength)-80,0,999),y+(string_height(longestLength)-4)*array_length(containedText)-4]
//x-50,y-20,x+50+clamp(string_width(longestLength)-80,0,999),y+(string_height(longestLength)-4)*array_length(containedText)-4