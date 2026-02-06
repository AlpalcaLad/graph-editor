w = display_get_gui_width()
h = display_get_gui_height()
clickDl = false

buttons = [
	{
		text: "+ Node",
		onClick: function(){
			instance_destroy(bin_o)
			instance_create_layer(toolsManager_o.x,toolsManager_o.y,"boxes",box_o)
		}
	},
	{
		text: "+ Arrow",
		onClick: function(){
			instance_destroy(bin_o)
			instance_create_layer(toolsManager_o.x,toolsManager_o.y,"arrows",arrow_o)
		}
	}, 
	{
		text: " Eraser",
		onClick: function(){
			instance_create_layer(toolsManager_o.x,toolsManager_o.y,"mouse",bin_o)
		}
	}, 
	{
		text: "  Save",
		onClick: function(){
			
		}
	}, 
	{
		text: "  Load",
		onClick: function(){
			
		}
	}
]