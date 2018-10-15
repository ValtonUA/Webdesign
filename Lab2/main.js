var button = document.querySelector('.enter .button')
var image = document.querySelector('.enter img')	

button.style.fontSize = document.documentElement.clientHeight/ 15 + 'px'
button.style.paddingTop = button.style.paddingBottom = 
	document.documentElement.clientHeight/ 95 + 'px'
button.style.paddingLeft = button.style.paddingRight = 	
	document.documentElement.clientHeight / 15 + 'px'

var pictures = []
var picture_size = 0
var num_of_cycles = 0
var show_time = 0
var block = false

window.onload = setTimeout (start, 500)


function start () {
	document.querySelector('.enter').style.display = 'flex'
	document.querySelector('.enter').style.opacity = 1;
	setTimeout(function () {
		image.style.transition = 'all 2.5s cubic-bezier(0, 0.1, 0.1, 1.3)'
		image.style.left = '0'
	}, 100)
	setTimeout(function () {
		button.style.transition = "all 1.5s"
		button.style.transform = "scale(1)"
	}, 3000)
}

function to_choose_theme() {
	if (block)
	 return
	block = true
	image.style.transitionTimingFunction = 'cubic-bezier(0.9, -0.3, 0.9, 1)'
	image.style.left = '100vw'
	button.style.transform = "scale(0)"
	setTimeout (function () {
		document.querySelector('body').style.background 
			= 'url(img/background.jpg) no-repeat center top / cover'
	}, 3000)
	setTimeout (function () {
		document.querySelector('.enter').style.display = 'none'
		document.querySelector('.choose_theme').style.display = 'block'
	}, 3500)
	setTimeout(function () {
		document.querySelector('.choose_theme').style.opacity = 1
		block = false
	}, 3600)
}

function to_choose_settings() {
	document.querySelector('.choose_theme').style.opacity = 0;
	setTimeout (function () {
		document.querySelector('.choose_theme').style.display = 'none'
		document.querySelector('.choose_settings').style.display = 'block'
		document.querySelector('.menu_size').style.display = 'flex'
		document.querySelector('.menu_method').style.display = 'flex'
		document.querySelector('.browse_method').style.transition = "all 0s"
	}, 1500)
	setTimeout(function () {
		document.querySelector('.choose_settings').style.opacity = 1
		document.querySelector('.browse_method').style.transform = 'scale(0)'
		block = false
	}, 1600)
}

function is_cars() {
	if (block) 
		return
	block = true
	pictures.push("img/cars/car1.jpg")
	pictures.push("img/cars/car2.jpg")
	pictures.push("img/cars/car3.jpg")
	pictures.push("img/cars/car4.jpg")
	pictures.push("img/cars/car5.jpg")
	to_choose_settings()
}

function is_sceneries() {
	if (block) 
		return
	block = true
	pictures.push("img/sceneries/scenery1.jpg")
	pictures.push("img/sceneries/scenery2.jpg")
	pictures.push("img/sceneries/scenery3.jpg")
	pictures.push("img/sceneries/scenery4.jpg")
	pictures.push("img/sceneries/scenery5.jpg")
	to_choose_settings()
}

function is_buildings() {
	if (block) 
		return
	block = true
	pictures.push("img/buildings/building1.jpg")
	pictures.push("img/buildings/building2.jpg")
	pictures.push("img/buildings/building3.jpg")
	pictures.push("img/buildings/building4.jpg")
	pictures.push("img/buildings/building5.jpg")
	to_choose_settings()
}

var sizes = [document.querySelector('.L'),
			document.querySelector('.M'),
			document.querySelector('.S')]
function is_large() {
	if (block) 
		return
	block = true
	picture_size = 90
	 sizes[1].style.background = 'white'
	 sizes[2].style.background = 'white'
	document.querySelector('.browse_method').style.transition = "all 1.5s"
	setTimeout (function () {
		sizes[0].style.background = 'yellow'
		document.querySelector('.browse_method').style.transform = 'scale(1)'
	}, 100)
}

function is_medium() {
	if (block) 
		return
	block = true
	picture_size = 70
	sizes[0].style.background = 'white'
	sizes[2].style.background = 'white'
	document.querySelector('.browse_method').style.transition = "all 1.5s"
	setTimeout (function () {
		sizes[1].style.background = 'yellow'
		document.querySelector('.browse_method').style.transform = 'scale(1)'
	}, 100)
}

function is_small() {
	if (block) 
		return
	block = true
	picture_size = 50
	sizes[0].style.background = 'white'
	sizes[1].style.background = 'white'
	document.querySelector('.browse_method').style.transition = "all 1.5s"
	setTimeout (function () {
		sizes[2].style.background = 'yellow'
		document.querySelector('.browse_method').style.transform = 'scale(1)'
	}, 100)
}

function is_onclick() {
	if (confirm('Are you sure?'))
		to_slideshow()
}

function is_timer() {
	num_of_cycles = + prompt('Enter a number of cycles:', 2)

	if (num_of_cycles == 0) 
		return
	if (isNaN(num_of_cycles)){
		alert('Error! Input value is not a number')
		return
	}
	if (num_of_cycles < 1)
		num_of_cycles = 1

	show_time = + prompt('Enter an amount of time per 1 picture:', 3)

	if (show_time == 0) 
		return
	if (isNaN(show_time)) {
		alert('Error! Input value is not a number')
		return
	}
	if (show_time < 0.5)
		show_time = 0.5
	
	to_slideshow()
}

var container = document.querySelector('.container')
var slide = document.querySelector('.slide')
var to_left = document.querySelector('.left')
var to_right = document.querySelector('.right')

function to_slideshow() {
	// Preparations
	document.querySelector('.choose_settings').style.opacity = 0
	document.querySelector('body').style.background = 'black'
	setTimeout (function() {
		document.querySelector('.choose_settings').style.display = 'none'
		container.style.background = 'url(./img/red_curtain.png)'
		container.style.height = '0vh'
	}, 1500)
	setTimeout (function() {
		container.style.transition = "height 2s"
		container.style.height = '97vh'
		slideshow()
	}, 2200)
	//////////////////////////////////////////////////////////////
}

var page_index = 0

function slideshow () {
	document.querySelector('.slideshow').style.display = 'block'
	slide.style.height = picture_size + 'vh'
	slide.style.width = picture_size + 'vw'
	slide.style.marginTop = (97 - picture_size) / 2 + 'vh'
	slide.src = pictures[0]
	setTimeout (function () {
		document.querySelector('.slideshow').style.opacity = 1
		if (num_of_cycles == 0 || show_time == 0){ // Onclick
			to_left.style.transform = 'scale(1)'
			to_right.style.transform = 'scale(1)'
			to_left.style.opacity = 0.15
			to_right.style.opacity = 0.15
		}
		else {	// Timer
			for (i = 0; i < num_of_cycles; i++) {
				for (var j = 1; j <= pictures.length; j++) {
					setTimeout(next, show_time*(i*pictures.length + j)*1000)	
				}	
			}
		}
	}, 2200)
}

function next() {
	page_index++
	if (page_index >= pictures.length)
		page_index = 0
	slide.src = pictures[page_index]
}

function prev() {
	page_index--
	if (page_index < 0)
		page_index = pictures.length - 1
	slide.src = pictures[page_index]
}