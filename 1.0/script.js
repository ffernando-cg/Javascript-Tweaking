/*
*   Code by Francisco Fernanco Cruz Galvez
*   on 09/August/2020
*   Using FranksLaboratory and PagePilling documentation
*/
const canvas = $("#canvas1")[0];
const ctx = canvas.getContext('2d');
canvas.width = $(window).innerWidth();
canvas.height = $(window).innerHeight();
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 150) * (canvas.width / 150)
};
let particlesArray;

//class in charge of particle creation and setter of the direction and movement of them
//clase que se encarga de las particulas y le proporciona la direccion, movimiento y tamaño entre otras cosas
class Particle{
  constructor(x,y,directionX,directionY,size,color){
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  //function in charge of drawing the circles on screen
  //funcion que se encarga de dibujar los circulos en pantalla
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false );
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  //makes the movement every frame and makes sure its among the window size
  //genera el movimiento cada frame y se asegura de que esta dentro del tamaño total de la ventana
  update() {
    if(this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if(this.y > canvas.height || this.y < 0 ){
      this.directionY = -this.directionY;
    }

    //detects where is the mouse and forces the dots to have a space among a set radius around the mouse
    //detecta donde esta el mouse y fuerza los puntos de alrededor que tengan un espacio al rededor del mouse dentro del radio seleccionado 
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    if(distance<mouse.radius + this.size){
      if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
        this.x += 10;
      }
      if(mouse.x > this.x && this.x > this.size *10) {
        this.x -=10;
      }
      if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
        this.y += 10;
      }
      if(mouse.y > this.y && this.y > this.size *10) {
        this.y -=10;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

//function that initialices the creation of dots among the screen and sets every x and y respectively
//funcion que se encarga de inicializar la creacion de puntos dentro del margen de la pantalla y les proporciona tanto la x como la y
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for(let i = 0; i < numberOfParticles/2; i++){
    let size = (Math.random() * 5 ) + 1;
    let x = (Math.random() * ((innerWidth - size * 2)-(size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2)-(size * 2)) + size * 2);
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let color = '#ffffff';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

//Defines the animation per dot per frame to move along the screen by having an invisible linear path setted
//Define la animacion por punto y por frame para que los puntos se muevan en proporcion a una linea invisible setteada
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth,innerHeight);

  for(let i = 0; i < particlesArray.length; i++){
    particlesArray[i].update();
  }
  //Calls the function to calculate nearby dots and draw a fading black line on the near ones
  //Llamado de funcion para el calculo de puntos cercanos y dibuja una linea opaca en los puntos mas cercanos uno de otros
  connect();
}


function connect(){
  let opacityValue = 1;
  //Cicle to verify any dot on screen  (Example  (A)------B )
  //Ciclo para verificar cada punto A
  for(let a=0; a<particlesArray.length; a++){

    //Cicle to verify every existent dot B on any side of the screen
    //Ciclo para verificar cada punto B existente de cualquier lado de la pantalla
    for(let b=a;b<particlesArray.length; b++){

      //Calculate the distance between two points by comparing both X & Y
      //Calcula la distancia entre dos puntos comparando ambos X & Y
      //EX: ((1200-800)*(1200-800)) + ((785-120)*(785-120)) = 602225
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
      + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

      //Calculate the distance among those two selected dots and compares them by the canvas/7 (The 7 was gotten by trial and error)
      //Calcula la distancia entre los dos puntos seleccionados y los comapra entre el canvas/7 (El 7 fue obtenido por prueba y error)
      if(distance < (canvas.width/7) * (canvas.height/7)) {

        //Takes the distance and distort the opacity of each line by dropping a 1 to 0.0 eventually;
        //Toma la distancia y distorciona la opacidad de cada linea haciendo que un 1 pase a 0.0 eventualmente
        //EX: distance = 602225 ------> opacityValue = 1 - (602225/20000) = -29.1111 (No line drawn)
        //EX2: distance = 125 ------> opactityValue = 1 - (125/20000) = 0.99375 (Line drawn)
        opacityValue = 1 -(distance/20000);
        ctx.strokeStyle='rgba(140,85,31,'+ opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

//window events for animation
//If the windows is resized, the canvas adapts to it and reduces the mouse radius effects
//Si la ventana es transformada de tamaño, el canvas se adapta a ella y se reduce el radio de efecto del mouse
$(window).resize(
function(){
  canvas.width = innerWidth;
  canvas.height =innerHeight;
  mouse.radius = ((canvas.height/80) * (canvas.height/80));
});

//If the mouse leaves the window, the dots will not be modified until further change
//Si el mouse abandona la ventana, los puntos no se veran modificados hasta un proximo cambio
$(window).on('mouseleave',
  function(){
    mouse.x = undefined;
    mouse.y = undefined;
  }
)

//When the mouse moves among the canvas, the properties change to make the radius more natural
//Cuando el mouse se mueve dentro del canvas, las propiedades cambian para que el radio se vea mas natural
$(document).mousemove(
  function(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  }
);

//When document is ready, pagepilling plugin transforms the document for horizontal scroll and animation between pages
//Cuando el documento esta listo, el plugin pagepilling transforam el docuemnto para proporcionar el scroll horizontal y la animacion entre paginas
$(document).ready(function() {
	$('.container--horizontal').pagepiling({
	    menu: null,
        direction: 'horizontal',
        verticalCentered: true,
        sectionsColor: [],
        anchors: [],
        scrollingSpeed: 700,
        easing: 'swing',
        loopBottom: true,
        loopTop: true,
        css3: true,
        navigation: false,
       	normalScrollElements: null,
        normalScrollElementTouchThreshold: 5,
        touchSensitivity: 5,
        keyboardScrolling: true,
        sectionSelector: '.section',
        animateAnchor: true,

		//events
		onLeave: function(index, nextIndex, direction){
     if(index == 1 && direction =='down'){
			  
      }
      else if(index == 1 && direction == 'up'){

      }
    },
		afterLoad: function(anchorLink, index){
      if(index == 1){
        
      };
              
    },
		afterRender: function(){},
    });
    $('pp-tableCell').append('');
});
    
init();
animate();