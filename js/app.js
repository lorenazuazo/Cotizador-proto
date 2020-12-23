//constructores
function Seguro(marca,year,tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};
Seguro.prototype.cotizarSeguro =function(){
    /*
    1 = Americano 1.15
    2 = Asiatico 1.05
    3 = Europeo 1.35
    */
   let cantidad;
   let base = 2000;

   switch (this.marca) {
        case '1':
           cantidad = base * 1.15;
           break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
       default: 
           break;
   }

   //leer anio actual
   const diferencia = new Date().getFullYear() - this.year;
   //por cada anio se reduce el valor 3%
   cantidad -= cantidad * 0.03 * diferencia;
   
   /*
    si el seguro es basico se multiplica por 30%
    si es completo se multiplica por 50%
   */
  if(this.tipo === 'basico'){
      cantidad *= 1.30;
  }else if (this.tipo === 'completo'){
    cantidad *=  1.50;
  }
  return cantidad;
};

function UI(){};//se crea sin constructor pero hay que crearlo para poder agregar protos

//si no uso this puedo usar arrow function
UI.prototype.llenarOptionYear = () =>{
    const max = new Date().getFullYear();
    const min = max - 20;
    const selectYear = document.querySelector('#year');

    for (let i = max; i >= min; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option)
        
    };  
};

UI.prototype.mostarMensaje = (mensaje,tipo) =>{
    const divMsj = document.createElement('div');
    if(tipo === 'error'){
        divMsj.classList.add('error');
    }else{
        divMsj.classList.add('correcto');
    }

    divMsj.classList.add('mensaje','mt-10');
    divMsj.textContent = mensaje;
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(divMsj,document.querySelector('#resultado'));

    setTimeout(() => {
        divMsj.remove();
    }, 3000);
};

UI.prototype.mostrarResultado = (seguro,total) =>{
    const { marca, year, tipo } = seguro;
    const formulario = document.querySelector('#resultado');
    const div = document.createElement('div');
    div.classList.add('mt-10');

    let textMarca;

    switch (marca) {
        case '1':
            textMarca = 'Americano';
           break;
        case '2':
            textMarca = 'Asiatico';
            break;
        case '3':
            textMarca = 'Europeo';
            break;
       default: 
           break;
   }

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;
    

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        formulario.appendChild(div);
    }, 3000);
};

//instanciar 
const ui = new UI();


document.addEventListener('DOMContentLoaded', () =>{
    ui.llenarOptionYear();
});

eventListener();
function eventListener(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit',cotizarSeguro);

};

//funciones

function cotizarSeguro(e){
    e.preventDefault();
    const resultados = document.querySelector('#resultado div');
    if(resultados){
        resultados.remove();
    }
    //leer marca
    const marca = document.querySelector('#marca').value;
    
    //leer year
    const year = document.querySelector('#year').value;
    
    //leer cobertura
    const cobertura = document.querySelector('input[name="tipo"]:checked').value;
    
    
    if(marca === '' || year === '' || cobertura === '' ){
        ui.mostarMensaje('Todos los campos son obligatorios','error');
        return;
    };

    ui.mostarMensaje('Cotizando...','exito');
    //instanciar el seguro
    const seguro = new Seguro(marca,year,cobertura);
    
    //usar el proyo para cotizar seguro
    const total = seguro.cotizarSeguro();

    //mostar resultados
    ui.mostrarResultado(seguro,total);
    
};