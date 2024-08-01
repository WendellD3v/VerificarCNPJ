function copiarCNPJS () {
    const cnpj = document.querySelector("#CNPJ").innerHTML
    navigator.clipboard.writeText(cnpj).then(function () {
        alert('CNPJ Copiado Com Sucesso')
    })
}

function copiarNOME () {
    const nome = document.querySelector('#NOME').innerHTML
    navigator.clipboard.writeText(nome).then(function () {
        alert('Nome Da Empresa Copiado Com Sucesso')
    })
}

function formatCNPJ(cnpj) {
    // Remove todos os caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Adiciona a formatação
    if (cnpj.length <= 14) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Retorna o CNPJ formatado
    return cnpj;
}

async function pegarCNPJ() {
    const cnpj = await document.querySelector('#cnpjDigitado').value
    if (cnpj) {
        document.querySelector('#error').innerHTML = ''
        document.querySelector('#resultado').innerHTML = `
        <div class="loading">
            <img id='carregando' src='imgs/loading.svg' width=200>
            <h2>Procurando o CNPJ, Aguarde..</h2>
        </div>`

        try {
                const req = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
                const result = await req.json()
                if (result.cnpj_raiz) {

                    

                    document.querySelector('#resultado').innerHTML = `
                    <div id="result">
                        <p>CNPJ:</p>
                        <span id='CNPJ'>${formatCNPJ(result.estabelecimento.cnpj)}</span>
                        <button id='copiarCNPJ' onClick='copiarCNPJS()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                        <br>
                        <br>
                        <p>Nome Da Empresa</p>
                        <span id='NOME'>${result.razao_social}</span>
                        <button id='copiarNOME' onClick='copiarNOME()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                    </div>`
                } else {
                    console.log('CNPJ Não Encontrado')
                    document.querySelector('#resultado').innerHTML = ""
                    document.querySelector('#error').innerHTML = 'CNPJ Não Encontrado'
                }
        } catch (err) {
            console.log('Aguarde 1 Minuto Para Verificar Novamente')
            document.querySelector('#resultado').innerHTML = ""
            document.querySelector('#error').innerHTML = 'API Em Pausa, Aguarde 1 Minuto Para Verificar Novamente'
        }
    }
}