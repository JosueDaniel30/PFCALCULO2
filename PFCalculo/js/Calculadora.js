function resolverIntegral() {
    // Verificar que Nerdamer esté cargado
    if (typeof nerdamer === 'undefined') {
        document.getElementById("pasos").innerHTML =
            "<p class='text-danger'>Error: La librería Nerdamer no se cargó correctamente.</p>";
        return;
    }

    const entrada = document.getElementById("inputIntegral").value.trim();

    if (entrada === "") {
        document.getElementById("pasos").innerHTML =
            "<p class='text-danger'>Por favor, escribe una integral.</p>";
        return;
    }

    try {
        // Usamos Nerdamer para integrar
        const resultado = nerdamer.integrate(entrada, 'x').toString();

        // Mostrar problema (manteniendo tu formato original)
        document.getElementById("problema").innerHTML = "∫ " + entrada + " dx";

        // Generar y mostrar pasos detallados
        const pasos = generarPasosDetallados(entrada, resultado);
        document.getElementById("pasos").innerHTML = pasos;

        // Mostrar resultado (manteniendo tu formato original)
        document.getElementById("resultado").innerHTML = resultado + " + C";

    } catch (error) {
        document.getElementById("pasos").innerHTML =
            "<p class='text-danger'>Error: " + error.message + "</p>";
    }
}

function generarPasosDetallados(entrada, resultado) {
    let pasosHTML = "<ol>";

    // Paso 1: Identificar la función
    pasosHTML += `<li><b>Identificamos la función a integrar:</b><br>`;
    pasosHTML += `∫ ${entrada} dx</li>`;

    // Paso 2: Analizar el tipo de integral
    pasosHTML += `<li><b>Analizamos el tipo de integral:</b><br>`;

    if (esIntegralDirecta(entrada)) {
        pasosHTML += `Esta es una integral directa que podemos resolver aplicando las reglas básicas de integración.</li>`;
    } else if (entrada.includes('*') && contieneFuncionesEspeciales(entrada)) {
        pasosHTML += `Reconocemos un producto de funciones. Evaluamos si es apropiado usar integración por partes.</li>`;
    } else if (entrada.includes('^')) {
        pasosHTML += `Contiene términos polinomiales. Aplicaremos la regla de la potencia.</li>`;
    } else {
        pasosHTML += `Aplicaremos las reglas generales de integración.</li>`;
    }

    // Paso 3: Aplicar reglas específicas
    pasosHTML += `<li><b>Aplicamos las reglas de integración:</b><br>`;
    pasosHTML += aplicarReglasEspecificas(entrada);
    pasosHTML += `</li>`;

    // Paso 4: Simplificar el resultado
    pasosHTML += `<li><b>Simplificamos el resultado:</b><br>`;
    pasosHTML += `Después de aplicar las reglas de integración, obtenemos: ${resultado}</li>`;

    // Paso 5: Verificación
    pasosHTML += `<li><b>Verificamos el resultado:</b><br>`;
    pasosHTML += `Podemos comprobar derivando el resultado para confirmar que obtenemos la función original.</li>`;

    pasosHTML += "</ol>";

    return pasosHTML;
}

function esIntegralDirecta(entrada) {
    // Integrales directas: polinomios simples, e^x, sin(x), cos(x), etc.
    const directas = ['x', 'x^2', 'x^3', 'e^x', 'sin(x)', 'cos(x)', '1/x'];
    return directas.some(func => entrada === func);
}

function contieneFuncionesEspeciales(entrada) {
    const funciones = ['sin', 'cos', 'tan', 'log', 'exp', 'e^'];
    return funciones.some(func => entrada.includes(func));
}

function aplicarReglasEspecificas(entrada) {
    let explicacion = "";

    if (entrada.includes('x^')) {
        // Regla de la potencia: ∫ x^n dx = x^(n+1)/(n+1) + C
        const exponente = extraerExponente(entrada);
        if (exponente !== null) {
            explicacion += `Aplicamos la regla de la potencia: ∫ x<sup>${exponente}</sup> dx = x<sup>${exponente + 1}</sup>/${exponente + 1} + C<br>`;
        }
    }

    if (entrada.includes('e^')) {
        explicacion += `La integral de e<sup>x</sup> es e<sup>x</sup> + C<br>`;
    }

    if (entrada.includes('sin(')) {
        explicacion += `La integral de sin(x) es -cos(x) + C<br>`;
    }

    if (entrada.includes('cos(')) {
        explicacion += `La integral de cos(x) es sin(x) + C<br>`;
    }

    if (entrada.includes('1/x')) {
        explicacion += `La integral de 1/x es ln|x| + C<br>`;
    }

    // Para productos que sugieren integración por partes
    if (entrada.includes('*') && entrada.split('*').length === 2) {
        const partes = entrada.split('*');
        explicacion += `Para ∫ u dv, donde u = ${partes[0].trim()} y dv = ${partes[1].trim()} dx<br>`;
        explicacion += `Aplicamos: ∫ u dv = uv - ∫ v du<br>`;
    }

    if (explicacion === "") {
        explicacion = "Aplicamos las reglas generales de integración simbólica.";
    }

    return explicacion;
}

function extraerExponente(entrada) {
    // Extraer el exponente de expresiones como x^2, 3x^2, etc.
    const match = entrada.match(/x\^(\d+)/);
    return match ? parseInt(match[1]) : null;
}

// Verificar que Nerdamer esté cargado
window.addEventListener('load', function() {
    if (typeof nerdamer !== 'undefined') {
        console.log('Nerdamer cargado correctamente');
    } else {
        console.error('Nerdamer NO está cargado');
        document.getElementById("pasos").innerHTML =
            "<p class='text-danger'>Error: La librería Nerdamer no se cargó correctamente. Verifica la carga de los scripts.</p>";
    }
});