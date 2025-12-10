if arm.aimMode{
if drawAng>90 and drawAng<270 image_yscale=-1
else image_yscale=1


shootDl=clamp(shootDl-client_o.time_speed-abs(player_o.flipping)*!arm.shooting*client_o.time_speed,-1,shootDlMax)
if !player_o.cutscening and arm!=-1 and shootDl<1 and (arm.shooting or abs(player_o.flipping)){
	var bullet=instance_create_layer(x,y,"particles",bullet_o)
	var accuracyLoss=4*player_o.shootingNumber + 1 - sqr(1/client_o.time_speed)
	bullet.direction=drawAng+random_range(-accuracyLoss,accuracyLoss)
	bullet.speedIn=3
	bullet.dmg+=2*abs(player_o.flipping)
	bullet.backstabMult=backstabMult
	shootDl=shootDlMax*3/irandom_range(1,5)
	if player_o.shootingNumber<2 shootDl/=1.5
	if player_o.shootingNumber<1 shootDl/=1.25
	if client_o.time_speed<1 shootDl/=1.5
	arm.recoil+=10
	//camera_o.screenShake=clamp(camera_o.screenShake+1/client_o.time_speed,camera_o.screenShakeMax/4,camera_o.screenShakeMax)
	audio_play_sound(gunShot_sound,1,false,1-0.4*(client_o.time_speed<1),0,client_o.time_speed)
	var muzzle_flash = instance_create_layer(x+lengthdir_x(2,drawAng),y+lengthdir_y(2,drawAng),"particles",muzzleFlash_o)
	muzzle_flash.image_angle=drawAng
	if image_yscale==1{
		muzzle_flash.x+=lengthdir_x(2,drawAng+90)
		muzzle_flash.y+=lengthdir_y(2,drawAng+90)
	}
	if pushBack!=0{
		player_o.hsp-=lengthdir_x(pushBack,drawAng)
		player_o.vsp-=lengthdir_y(pushBack,drawAng)
	}
}
}