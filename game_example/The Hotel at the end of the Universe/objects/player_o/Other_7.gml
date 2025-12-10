if cutscening{
	cutscening=false
	controlling=true
	sprite_index=playerIdle_s
	image_index=0
	image_speed=0.5
	arm1.drawAng=90
	arm1.targAng=90
	arm2.drawAng=270
	arm2.targAng=270
	vsp -= 4
	with spawner_o{
		if !destroyed and sprite_index==monsterSpawnerDestroyed_s{
			image_index=image_number-1
			image_speed=0
			destroyed=true
			alarm[0]=-1
			created=[]
			camera_o.follow=player_o
			player_o.cutscening=false
			player_o.controlling=true
			player_o.sprite_index=playerIdle_s
			camera_o.targetZoom=0.75
			for (var i=0; i<60; i++){
				var dust = instance_create_layer(irandom_range(bbox_left-5,bbox_right+5),irandom_range(bbox_top-5,bbox_bottom+5),"particles",dust_o)
				dust.hspeed=random_range(-0.5,0.5)
				dust.vspeed=random_range(-0.5,0.2)
				var blendVal=clamp(15*point_distance(x,y,dust.x,dust.y),0,255)
				dust.image_blend=make_color_rgb(255,255-blendVal,0)
			}
			with enemy_o{
				var playerAng = point_direction(x,y,player_o.x,player_o.y)//blend_angles(point_direction(x,y,player_o.x,player_o.y),90,8)
				var playerDist = point_distance(x,y,player_o.x,player_o.y)
				var thrustPower=-25*(1/sqrt(clamp(playerDist,1,16)))
				hsp=thrustPower*dcos(playerAng)
				vsp=thrustPower*dsin(playerAng)
			}
			var dustNum=120
			for (var i=1; i<dustNum; i++){
				var dust = instance_create_layer(x,y,"particles",dust_o)
				dust.direction=i*(360/dustNum)+random_range(-15,15)
				dust.speed=5+random_range(-1,1)
				dust.image_alpha=0.5
				dust.image_xscale=random_range(1,3)
				dust.image_yscale=dust.image_xscale
			}
		}
	}
}