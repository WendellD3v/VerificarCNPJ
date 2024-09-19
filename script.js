function copiarCNPJS () {
    const cnpj = document.querySelector("#CNPJ").innerHTML
    navigator.clipboard.writeText(cnpj).then(function () {
        info('Sucesso', 'CNPJ Copiado Com Sucesso')
    })
}

function copiarNOME () {
    const nome = document.querySelector('#NOME').innerHTML
    navigator.clipboard.writeText(nome).then(function () {
        info('Sucesso', 'Nome Da Empresa Copiado Com Sucesso')
    })
}

function copiarNOMEF () {
    const nomeF = document.querySelector('#NomeF').innerHTML
    navigator.clipboard.writeText(nomeF).then(function () {
        info('Sucesso', 'Nome Fantasia Da Empresa Copiado Com Sucesso')
    })
}

function copiarCNAE () {
    const cnae = document.querySelector('#CNAE').innerHTML
    navigator.clipboard.writeText(cnae).then(function() {
        info('Sucesso', 'C-NAE Copiado Com Sucesso')
    })
}

async function formatarInput() {
    cnpj = await document.querySelector('#cnpjDigitado').value

    cnpj.replace(/\D/g, '');

    if (cnpj.length <= 14) {
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        console.log('Função Acionada')
        document.querySelector('#cnpjDigitado').value = cnpj
    }
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
    if (window.event.keyCode == 13){   
        event.returnValue=false;
        event.cancel = true;
    }

    let cnpj = await document.querySelector('#cnpjDigitado').value
    if (cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
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

                    

                    if (result.estabelecimento.nome_fantasia == null) {
                        document.querySelector('#resultado').innerHTML = `
                        <div id="result">
                            <p>CNPJ:</p>
                            <span id='CNPJ'>${formatCNPJ(result.estabelecimento.cnpj)}</span>
                            <button id='copiar' onClick='copiarCNPJS()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                            <br>
                            <br>
                            <p>Nome Da Empresa</p>
                            <span id='NOME'>${result.razao_social}</span>
                            <button id='copiar' onClick='copiarNOME()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                            <br>
                            <br>
                            <p>C-NAE</p>
                            <span id='CNAE'>${result.estabelecimento.atividade_principal.classe} - ${result.estabelecimento.atividade_principal.descricao}</span>
                            <button id='copiar' onClick='copiarCNAE()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                        </div>`
                    } else {
                        document.querySelector('#resultado').innerHTML = `
                        <div id="result">
                            <p>CNPJ:</p>
                            <span id='CNPJ'>${formatCNPJ(result.estabelecimento.cnpj)}</span>
                            <button id='copiar' onClick='copiarCNPJS()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                            <br>
                            <br>
                            <p>Nome Da Empresa</p>
                            <span id='NOME'>${result.razao_social}</span>
                            <button id='copiar' onClick='copiarNOME()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                            <br>
                            <br>
                            <p>Nome Fantasia</p>
                            <span id='NomeF'>${result.estabelecimento.nome_fantasia}</span>
                            <button id='copiar' onClick='copiarNOMEF()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                            <br>
                            <br>
                            <p>C-NAE</p>
                            <span id='CNAE'>${result.estabelecimento.atividade_principal.classe} - ${result.estabelecimento.atividade_principal.descricao}</span>
                            <button id='copiar' onClick='copiarCNAE()'><img src='imgs/copy.svg' width = 30> Copiar</button>
                        </div>`
                    }
                } else {
                    console.log(result.detalhes)
                    document.querySelector('#resultado').innerHTML = ""
                    document.querySelector('#error').innerHTML = `${result.detalhes}`
                }
        } catch (err) {
            console.log(err)
            console.log('Aguarde 1 Minuto Para Verificar Novamente')
            document.querySelector('#resultado').innerHTML = ""
            document.querySelector('#error').innerHTML = 'API Em Pausa, Aguarde 1 Minuto Para Verificar Novamente'
        }
    }
}

function info(type, msg){
    let infobox = document.querySelector('#infobox');
    infobox.innerHTML = `
            <h2>${type}</h2>
            <p>${msg}</p>
        `;

    infobox.classList.add('show');
    setTimeout(() => {
        infobox.classList.remove('show');
        infobox.classList.add('close');
        setTimeout(() => {
            infobox.classList.remove('close');
        }, 1000);
    }, 2000);
}