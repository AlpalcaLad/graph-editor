if array_contains(hits,1){
	shader_set(bloodOnHits)
	var u_hits = shader_get_uniform(bloodOnHits,"hits")
	shader_set_uniform_f_array(u_hits,hits)
	var u_size = shader_get_uniform(bloodOnHits,"spriteSize")
	shader_set_uniform_f_array(u_size,spriteSize)
	draw_self()
	shader_reset()
} else {
	draw_self()
}