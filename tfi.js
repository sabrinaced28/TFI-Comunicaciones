
         // Referencias a elementos HTML
         const binaryInput = document.getElementById('binaryInput');
        const modulationSelect = document.getElementById('modulationSelect');
        const generateButton = document.getElementById('generateButton');
        const signalCanvas = document.getElementById('signalCanvas');
        const modulatedCanvas = document.getElementById('modulatedCanvas');
        const clearButton = document.getElementById('clearButton');
        const constellationCanvas = document.getElementById('constellationCanvas');
        const pskInfo = document.getElementById('4pskInfo');
        const truthTableBody= document.getElementById('truthTableBody');
        const container= document.getElementById('inputSignalContainer');

        const truthTables = {
            "4PSK": [
                { bits: "00", phase: "0°" },
                { bits: "01", phase: "90°" },
                { bits: "10", phase: "180°" },
                { bits: "11", phase: "270°" }
            ],
            "QPSK": [
                { bits: "00", phase: "135°" },
                { bits: "01", phase: "225°" },
                { bits: "10", phase: "45°" },
                { bits: "11", phase: "315°" }
            ],
            "8PSK": [
                { bits: "000", phase: "0°" },
                { bits: "001", phase: "45°" },
                { bits: "010", phase: "90°" },
                { bits: "011", phase: "135°" },
                { bits: "100", phase: "180°" },
                { bits: "101", phase: "225°" },
                { bits: "110", phase: "270°" },
                { bits: "111", phase: "315°" }
            ],
            "4QAM": [
                { bits: "00", phase: "45°" },
                { bits: "01", phase: "135°" },
                { bits: "10", phase: "225°" },
                { bits: "11", phase: "315°" }
            ],
            "8QAM": [ 
                { bits: "000", phase: "0°" },
                { bits: "001", phase: "0°" },
                { bits: "010", phase: "90°" },
                { bits: "011", phase: "90°" },
                { bits: "100", phase: "180°" },
                { bits: "101", phase: "180°" },
                { bits: "110", phase: "270°" },
                { bits: "111", phase: "270°" }
            ]

        };
        // Evento al presionar el botón
        generateButton.addEventListener("click",function() {
          const modulationType = modulationSelect.value;
          const binaryData = binaryInput.value.trim();
            

          if (!/^[01]+$/.test(binaryData)) {
                alert("Por favor, ingrese solo una cadena binaria (compuesta de 1 y 0).");
                return;
            }

            const modulatedCtx = modulatedCanvas.getContext('2d');
            const signalCtx = signalCanvas.getContext('2d');
          
            signalCtx.clearRect(0, 0, modulatedCanvas.width, modulatedCanvas.height);
            modulatedCtx.clearRect(0, 0, modulatedCanvas.width, modulatedCanvas.height);

             if(modulationType === "ASK" || modulationType === "FSK" || modulationType === "BPSK"){
            drawDigitalSignal(signalCtx, binaryData);
            pskInfo.style.display = "none";
            container.style.display = "block";

            }else{
              pskInfo.style.display = "block";
              updateTruthTable(modulationType);
              container.style.display = "none";
              drawConstellationDiagram();
              
            }
            

            // Dibujar la señal modulada según el tipo de modulación
            switch (modulationType) {
                case "ASK":
                    drawASKSignal(modulatedCtx, binaryData);
                    break;
                case "FSK":
                    drawFSKSignal(modulatedCtx, binaryData);
                    break;
                case "BPSK":
                    drawBPSKSignal(modulatedCtx, binaryData);
                    break;
                case "4PSK":
                    draw4PSKSignal(modulatedCtx, binaryData);
                    break;
                case "QPSK":
                    drawQPSKSignal(modulatedCtx, binaryData);
                    break;
                case "8PSK": 
                    draw8PSKSignal(modulatedCtx, binaryData);
                    break;
                case "4QAM":
                    draw4QAMSignal(modulatedCtx, binaryData);
                    break;
                case "8QAM":
                    draw8QAMSignal(modulatedCtx, binaryData);
                    break;
                default:
                    alert("Tipo de modulación no soportada.");
            }
        });

        clearButton.addEventListener('click', function() {
            // Limpiar los campos de entrada
            binaryInput.value = '';
            modulationSelect.selectedIndex = 0;

            // Limpiar los canvas
            signalCanvas.getContext('2d').clearRect(0, 0, signalCanvas.width, signalCanvas.height);
            modulatedCanvas.getContext('2d').clearRect(0, 0, modulatedCanvas.width, modulatedCanvas.height);

            pskInfo.style.display = "none";
        });

        //Funcion para actualizar la tabla de verdad
        function updateTruthTable(modulationType){
            const tableData = truthTables[modulationType] || [];
            truthTableBody.innerHTML = tableData.map(row => 
                `
                <tr>
                    <td>${row.bits}</td>
                    <td>${row.phase}</td>
                </tr>
            `).join('');
        }

        // Función para dibujar la señal digital
        function drawDigitalSignal(ctx, binaryData) {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            const margin = 20;
            const timeStep = (width - 2 * margin) / binaryData.length;
            const signalHeight = height - 2 * margin;

              ctx.clearRect(0, 0, width, height); // Limpiar el canvas
            // Dibujar ejes cartesianos
            drawAxes(ctx, binaryData.length, timeStep, signalHeight);

            // Dibujar la señal digital
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;

            let x = margin;
            binaryData.split("").forEach((bit, index) => {
                const y = bit === "1" ? margin : signalHeight / 2 + margin;
                ctx.lineTo(x, y);
                x += timeStep;
                ctx.lineTo(x, y);

            
                
            });

            ctx.stroke();

            // Etiquetas de bits
            ctx.fillStyle = "blue";
            ctx.font = "16px Arial";
            x = margin;
            binaryData.split("").forEach((bit) => {
                ctx.fillText(bit, x + timeStep / 2 - 5, signalHeight + 30);
                x += timeStep;
            });
        }

        // Función para dibujar los ejes
        function drawAxes(ctx, numBits, timeStep, signalHeight) {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            const margin = 20;

            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;

            // Eje X (tiempo)
            ctx.moveTo(margin, height / 2);
            ctx.lineTo(width - margin, height / 2);

            // Eje Y (amplitud)
            ctx.moveTo(margin, margin);
            ctx.lineTo(margin, height - margin);

            ctx.stroke();

            // Líneas divisorias para cada bit
            for (let i = 0; i <= numBits; i++) {
                const x = margin + i * timeStep;
                ctx.beginPath();
                ctx.moveTo(x, margin);
                ctx.lineTo(x, height - margin);
                ctx.strokeStyle = "gray";
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // Función para dibujar la señal ASK
        function drawASKSignal(ctx, binaryData) {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            const margin = 20;
            const timeStep = (width - 2 * margin) / binaryData.length;
            const signalHeight = height - 2 * margin;
            const carrierFrequency = 10; // Frecuencia de la señal portadora
            const highAmplitude = signalHeight / 3; // Amplitud para bit 1
            const lowAmplitude = signalHeight / 8; // Amplitud para bit 0

            // Dibujar ejes
            drawAxes(ctx, binaryData.length, timeStep, signalHeight);

            // Dibujar la señal ASK
            ctx.beginPath();
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 2;

            let x = margin;
            binaryData.split("").forEach((bit) => {
                const amplitude = bit === "1" ? highAmplitude : lowAmplitude;

                // Dibujar la portadora para el bit actual
                for (let t = 0; t < timeStep; t++) {
                    const y = height / 2 - amplitude * Math.sin((2 * Math.PI * carrierFrequency * t) / timeStep);
                    ctx.lineTo(x + t, y);
                }

                x += timeStep; // Avanzar al siguiente bit
            });

            ctx.stroke();
        }
            

        // Función para dibujar la señal FSK
        function drawFSKSignal(ctx, binaryData) {
          const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            const margin = 20;
            const timeStep = (width - 2 * margin) / binaryData.length;
            const centerY = height / 2;
            const carrierFrequencyLow = 2; // Frecuencia baja para bit 0
            const carrierFrequencyHigh = 10; // Frecuencia alta para bit 1
            const amplitude = 50;

            drawAxes(ctx, binaryData.length, timeStep, height);

            ctx.beginPath();
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 2;

            let x = margin;

            binaryData.split("").forEach((bit) => {
                const currentFrequency = bit === "1" ? carrierFrequencyHigh : carrierFrequencyLow;

                for (let i = 0; i < timeStep; i++) {
                    const t = i / timeStep;
                    const y = centerY - amplitude * Math.sin(2 * Math.PI * currentFrequency * t);
                    ctx.lineTo(x + i, y);
                }

                x += timeStep;
            });

            ctx.stroke();
        }

        function drawBPSKSignal(ctx, binaryData) {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            const margin = 20;
            const centerY = height / 2;
            const amplitude = 30; // Amplitud de la señal
            const carrierFrequency = 2; // Frecuencia portadora en ciclos por bit
            const bitWidth = (width - 2 * margin) / binaryData.length; // Ancho disponible por bit

            // Dibujar ejes
            drawAxes(ctx, binaryData.length, bitWidth, height);

            ctx.beginPath();
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 2;

            let x = margin;

            binaryData.split("").forEach((bit) => {
                const phase = bit === "1" ? Math.PI : 0; // Cambiar fase a 180° para 1 y 0° para 0

                for (let i = 0; i < bitWidth; i++) {
                    // Calcular la posición en tiempo para cada punto del bit
                    const t = i / bitWidth; // Normalizar tiempo dentro de un bit
                    const y = centerY - amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase); // Señal BPSK
                    ctx.lineTo(x + i, y); // Dibujar punto de la señal
                }

                x += bitWidth; // Avanzar al siguiente bit
            });

            ctx.stroke();
        }


// Función para dibujar la señal 4PSK

        function draw4PSKSignal(ctx, binaryData) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const margin = 20;
    const centerY = height / 2; // Centro vertical del canvas
    const amplitude = 50; // Amplitud de la señal
    const carrierFrequency = 2; // Número de ciclos por símbolo
    const numSymbols = Math.ceil(binaryData.length / 2); // Cada símbolo representa 2 bits
    const symbolWidth = (width - 2 * margin) / numSymbols; // Espacio horizontal para cada símbolo

    // Dibujar los ejes
    drawAxes(ctx, numSymbols, symbolWidth, height);

    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;

    let x = margin;

    // Dividir la cadena binaria en pares de bits
    for (let i = 0; i < binaryData.length; i += 2) {
        // Obtener los bits del símbolo actual (rellenar con 0 si es impar)
        const bits = binaryData.substring(i, i + 2).padEnd(2, "0");

        // Determinar la fase en función de los bits
        let phase;
        switch (bits) {
            case "00":
                phase = 0; // 0°
                break;
            case "01":
                phase = Math.PI / 2; // 90°
                break;
            case "10":
                phase = Math.PI; // 180°
                break;
            case "11":
                phase = (3 * Math.PI) / 2; // 270°
                break;
        }

        // Dibujar el símbolo actual
        for (let j = 0; j < symbolWidth; j++) {
            const t = j / symbolWidth; // Tiempo normalizado dentro del símbolo
            const y = centerY - amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            ctx.lineTo(x + j, y); // Dibujar el punto de la onda
        }

        x += symbolWidth; // Avanzar al siguiente símbolo
    }

    ctx.stroke();

    // Etiquetas de símbolos (bits)
    ctx.fillStyle = "blue";
    ctx.font = "16px Arial";
    x = margin;
    for (let i = 0; i < binaryData.length; i += 2) {
        const bits = binaryData.substring(i, i + 2).padEnd(2, "0");
        ctx.fillText(bits, x + symbolWidth / 2 - 10, height - 10);
        x += symbolWidth;
    }
}

function drawQPSKSignal(ctx, binaryData) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const margin = 20;
    const centerY = height / 2; // Centro vertical del canvas
    const amplitude = 50; // Amplitud de la señal
    const carrierFrequency = 2; // Número de ciclos por símbolo
    const numSymbols = Math.ceil(binaryData.length / 2); // Cada símbolo representa 2 bits
    const symbolWidth = (width - 2 * margin) / numSymbols; // Espacio horizontal para cada símbolo

    // Dibujar los ejes
    drawAxes(ctx, numSymbols, symbolWidth, height);

    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;

    let x = margin;

    // Dividir la cadena binaria en pares de bits
    for (let i = 0; i < binaryData.length; i += 2) {
        // Obtener los bits del símbolo actual (rellenar con 0 si es impar)
        const bits = binaryData.substring(i, i + 2).padEnd(2, "0");

        // Determinar la fase en función de los bits
        let phase;
        switch (bits) {
            case "00":
                phase = (3 * Math.PI) / 4; // 135°           
                break;
            case "01":
                phase = (5 * Math.PI) / 4; // 225°           
                break;
            case "10":
                phase = Math.PI / 4; // 45°           
                break;
            case "11":
                phase = (7 * Math.PI) / 4; // 315°           
                break;
        }

        // Dibujar el símbolo actual
        for (let j = 0; j < symbolWidth; j++) {
            const t = j / symbolWidth; // Tiempo normalizado dentro del símbolo
            const y = centerY - amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            ctx.lineTo(x + j, y); // Dibujar el punto de la onda
        }

        x += symbolWidth; // Avanzar al siguiente símbolo
    }

    ctx.stroke();

    // Etiquetas de símbolos (bits)
    ctx.fillStyle = "blue";
    ctx.font = "16px Arial";
    x = margin;
    for (let i = 0; i < binaryData.length; i += 2) {
        const bits = binaryData.substring(i, i + 2).padEnd(2, "0");
        ctx.fillText(bits, x + symbolWidth / 2 - 10, height - 10);
        x += symbolWidth;
    }
  
}
         
function draw8PSKSignal(ctx, binaryData) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const margin = 20;
    const centerY = height / 2; // Centro vertical del canvas
    const amplitude = 50; // Amplitud de la señal
    const carrierFrequency = 2; // Número de ciclos por símbolo
    const numSymbols = Math.ceil(binaryData.length / 3); // Cada símbolo representa 3 bits
    const symbolWidth = (width - 2 * margin) / numSymbols; // Espacio horizontal para cada símbolo

    // Dibujar los ejes
    drawAxes(ctx, numSymbols, symbolWidth, height);

    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;

    let x = margin;

    // Dividir la cadena binaria en ternas de bits
    for (let i = 0; i < binaryData.length; i += 3) {
        // Obtener los bits del símbolo actual (rellenar con 0 si es impar)
        const bits = binaryData.substring(i, i + 3).padEnd(3, "0");

        // Determinar la fase en función de los bits
        let phase;
        switch (bits) {
            case "000":
                phase = 0; // 0°
                break;
            case "001":
                phase = Math.PI / 4; // 45°
                break;
            case "010":
                phase = Math.PI / 2; // 90°
                break;
            case "011":
                phase = (3 * Math.PI) / 4; // 135°
                break;
            case "100":
                phase = Math.PI; // 180°
                break;
            case "101":
                phase = (5 * Math.PI) / 4; // 225°
                break;
            case "110":
                phase = (3 * Math.PI) / 2; // 270°
                break;
            case "111":
                phase = (7 * Math.PI) / 4; // 315°
                break;
        }

        // Dibujar el símbolo actual
        for (let j = 0; j < symbolWidth; j++) {
            const t = j / symbolWidth; // Tiempo normalizado dentro del símbolo 
            const y = centerY - amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            ctx.lineTo(x + j, y); // Dibujar el punto de la onda

        }

        x += symbolWidth; // Avanzar al siguiente símbolo
    }

    ctx.stroke();

    // Etiquetas de símbolos (bits)
    ctx.fillStyle = "blue";
    ctx.font = "16px Arial";
    x = margin;
    for (let i = 0; i < binaryData.length; i += 3) {
        const bits = binaryData.substring(i, i + 3).padEnd(3, "0");
        ctx.fillText(bits, x + symbolWidth / 2 - 10, height - 10);
        x += symbolWidth;
    }
}

function draw4QAMSignal (ctx, binaryData) { 
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const margin = 20;
    const centerY = height / 2; // Centro vertical del canvas
    const amplitude = 50; // Amplitud de la señal
    const carrierFrequency = 2; // Número de ciclos por símbolo
    const numSymbols = Math.ceil(binaryData.length / 2); // Cada símbolo representa 2 bits
    const symbolWidth = (width - 2 * margin) / numSymbols; // Espacio horizontal para cada símbolo

    // Dibujar los ejes
    drawAxes(ctx, numSymbols, symbolWidth, height);

    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;

    let x = margin;

    // Dividir la cadena binaria en pares de bits
    for (let i = 0; i < binaryData.length; i += 2) {
        // Obtener los bits del símbolo actual (rellenar con 0 si es impar)
        const bits = binaryData.substring(i, i + 2).padEnd(2, "0");

        // Determinar la fase en función de los bits
        let phase;
        switch (bits) {
            case "00":
                phase = Math.PI / 4; // 45°             
                break;
            case "01":
                phase = (3 * Math.PI) / 4; // 135°           
                break;
            case "10":
                phase = (5 * Math.PI) / 4; // 225°           
                break;
            case "11":
                phase = (7 * Math.PI) / 4; // 315°           
                break;
        }

        // Dibujar el símbolo actual
        for (let j = 0; j < symbolWidth; j++) {
            const t = j / symbolWidth; // Tiempo normalizado dentro del símbolo
            const y = centerY - amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            ctx.lineTo(x + j, y); // Dibujar el punto de la onda
        }

        x += symbolWidth; // Avanzar al siguiente símbolo
    }

    ctx.stroke();

    // Etiquetas de símbolos (bits)
    ctx.fillStyle = "blue";
    ctx.font = "16px Arial";
    x = margin;
    for (let i = 0; i < binaryData.length; i += 2) {
        const bits = binaryData.substring(i, i + 2).padEnd(2, "0");
        ctx.fillText(bits, x + symbolWidth / 2 - 10, height - 10);
        x += symbolWidth;
    }
}
function draw8QAMSignal (ctx, binaryData) { 
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const margin = 20;
    const centerY = height / 2; // Centro vertical del canvas
    // Amplitud de la señal
    const carrierFrequency = 2; // Número de ciclos por símbolo
    const numSymbols = Math.ceil(binaryData.length / 3); // Cada símbolo representa 3 bits
    const symbolWidth = (width - 2 * margin) / numSymbols; // Espacio horizontal para cada símbolo

    // Dibujar los ejes
    drawAxes(ctx, numSymbols, symbolWidth, height);

    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;

    let x = margin;

    // Dividir la cadena binaria en ternas de bits
    for (let i = 0; i < binaryData.length; i += 3) {
        // Obtener los bits del símbolo actual (rellenar con 0 si es impar)
        const bits = binaryData.substring(i, i + 3).padEnd(3, "0");

        // Determinar la fase en función de los bits
        let phase;
        let amplitude;
        switch (bits) {
            case "000":
                phase = 0;
                amplitude=30; // 0
                break;
            case "001":
                phase = 0; 
                amplitude=60;// 0°
                break;
            case "010":
                phase = Math.PI / 2;
                amplitude=30; // 90°           
                break;
            case "011":
                phase = Math.PI / 2;
                amplitude=60; // 90°
                break;
            case "100":
                phase = Math.PI; 
                amplitude=30;// 180°           
                break;
            case "101":
                phase = Math.PI;
                amplitude=60; // 180°
                break;
            case "110":
                phase = (3 * Math.PI) / 2; 
                amplitude=30;// 270°           
                break;
            case "111":
                phase = (3 * Math.PI) / 2; 
                amplitude=60; // 270°
                break;
        }



     // Dibujar el símbolo
        for (let j = 0; j < symbolWidth; j++) {
            const t = j / symbolWidth; // Tiempo normalizado dentro del símbolo
            const y = centerY - amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            ctx.lineTo(x + j, y); // Dibujar el punto de la onda
        }

        x += symbolWidth; // Avanzar al siguiente símbolo
    }

    ctx.stroke();

    // Etiquetas de símbolos (bits)
    ctx.fillStyle = "blue";
    ctx.font = "16px Arial";
    x = margin;
    for (let i = 0; i < binaryData.length; i += 3) {
        const bits = binaryData.substring(i, i + 3).padEnd(3, "0");
        ctx.fillText(bits, x + symbolWidth / 2 - 10, height - 10);
        x += symbolWidth;
    }
}



     



//
        function drawConstellationDiagram() {
            const ctx = constellationCanvas.getContext('2d');
            const width = constellationCanvas.width;
            const height = constellationCanvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = 5;

            // Limpiar el canvas
            ctx.clearRect(0, 0, width, height);

            // Dibujar ejes
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, height);
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Obtener el tipo de modulación seleccionado
            const modulationType = modulationSelect.value;
            let points = [];

            switch (modulationType) {
                case "4PSK":
                    points = [
                        { x: centerX + 80, y: centerY - 80, label: "00" },
                        { x: centerX - 80, y: centerY - 80, label: "01" },
                        { x: centerX - 80, y: centerY + 80, label: "10" },
                        { x: centerX + 80, y: centerY + 80, label: "11" }
                    ];
                    break;
                case "QPSK":
                    points = [
                        { x: centerX + 80, y: centerY - 80, label: "10" },
                        { x: centerX - 80, y: centerY - 80, label: "00" },
                        { x: centerX - 80, y: centerY + 80, label: "01" },
                        { x: centerX + 80, y: centerY + 80, label: "11" }
                    ];
                    break;          
                case "8PSK":
                    points = [
                        { x: centerX + 80, y: centerY, label: "000" },
                        { x: centerX + 65, y: centerY - 65, label: "001" },
                        { x: centerX, y: centerY - 80, label: "010" },
                        { x: centerX - 65, y: centerY - 65, label: "011" },
                        { x: centerX - 80, y: centerY, label: "100" },
                        { x: centerX - 65, y: centerY + 65, label: "101" },
                        { x: centerX, y: centerY + 80, label: "110" },
                        { x: centerX + 65, y: centerY + 65, label: "111" }
                    ];
                    break;
                case "4QAM":
                    points = [
                        { x: centerX + 80, y: centerY - 80, label: "00" },
                        { x: centerX - 80, y: centerY - 80, label: "01" },
                        { x: centerX - 80, y: centerY + 80, label: "10" },
                        { x: centerX + 80, y: centerY + 80, label: "11" }
                    ];
                    break;
                    case "8QAM":
                        points = [
                            // Cuadrado más pequeño
                            { x: centerX + 50, y: centerY, label: "000" },
                            { x: centerX, y: centerY - 50, label: "010" },
                            { x: centerX - 50, y: centerY, label: "100" },
                            { x: centerX, y: centerY + 50, label: "110" },
                            // Cuadrado más grande
                            { x: centerX + 80, y: centerY, label: "001" },
                            { x: centerX, y: centerY - 80, label: "011" },
                            { x: centerX - 80, y: centerY, label: "101" },
                            { x: centerX, y: centerY + 80, label: "111" }
                        ];
                        break;
            }

            // Dibujar puntos de constelación
            points.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = "purple";
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "black";
                ctx.fillText(point.label, point.x + 10, point.y - 10);
            });
           
        }