class AbrigoAnimais {

  #ANIMAIS_DATA = {
    'rex': { nomeOriginal: 'Rex', brinquedos: ['RATO', 'BOLA'] },
    'mimi': { nomeOriginal: 'Mimi', brinquedos: ['BOLA', 'LASER'] },
    'fofo': { nomeOriginal: 'Fofo', brinquedos: ['BOLA', 'RATO', 'LASER'] },
    'zero': { nomeOriginal: 'Zero', brinquedos: ['RATO', 'BOLA'] },
    'bola': { nomeOriginal: 'Bola', brinquedos: ['CAIXA', 'NOVELO'] },
    'bebe': { nomeOriginal: 'Bebe', brinquedos: ['LASER', 'RATO', 'BOLA'] },
    'loco': { nomeOriginal: 'Loco', brinquedos: ['SKATE', 'RATO'], regraEspecial: 'companhia' }
  };

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const validacao = this.#validarEProcessarEntradas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais);
    if (validacao.erro) {
      return { erro: validacao.erro };
    }

    const { p1Brinquedos, p2Brinquedos, animaisConsiderados } = validacao;

    let adocoesPessoa1 = 0;
    let adocoesPessoa2 = 0;
    const resultados = [];

    for (const nomeAnimal of animaisConsiderados) {
      const animalData = this.#ANIMAIS_DATA[nomeAnimal];

      const p1PodeAdotar = this.#estaApto(p1Brinquedos, animalData, adocoesPessoa1);
      const p2PodeAdotar = this.#estaApto(p2Brinquedos, animalData, adocoesPessoa2);

      let dono = 'abrigo';

      if (p1PodeAdotar && p2PodeAdotar) {
        dono = 'abrigo';
      } else if (p1PodeAdotar) {
        dono = 'pessoa 1';
        adocoesPessoa1++;
      } else if (p2PodeAdotar) {
        dono = 'pessoa 2';
        adocoesPessoa2++;
      }

      resultados.push(`${animalData.nomeOriginal} - ${dono}`);
    }

    resultados.sort();

    return { lista: resultados };
  }

  #validarEProcessarEntradas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    if (!brinquedosPessoa1 || !brinquedosPessoa2 || !ordemAnimais) {
        return { erro: 'Entrada inválida' };
    }
    
    const p1Brinquedos = brinquedosPessoa1.split(',').map(b => b.trim().toUpperCase());
    const p2Brinquedos = brinquedosPessoa2.split(',').map(b => b.trim().toUpperCase());
    const animaisConsiderados = ordemAnimais.split(',').map(a => a.trim().toLowerCase());

    const nomesAnimaisValidos = new Set(Object.keys(this.#ANIMAIS_DATA));
    if (new Set(animaisConsiderados).size !== animaisConsiderados.length) {
      return { erro: 'Animal inválido' };
    }
    for (const animal of animaisConsiderados) {
      if (!nomesAnimaisValidos.has(animal)) {
        return { erro: 'Animal inválido' };
      }
    }

    const todosBrinquedosValidos = new Set(
      Object.values(this.#ANIMAIS_DATA).flatMap(data => data.brinquedos)
    );

    if (new Set(p1Brinquedos).size !== p1Brinquedos.length || new Set(p2Brinquedos).size !== p2Brinquedos.length) {
      return { erro: 'Brinquedo inválido' };
    }
    for (const brinquedo of [...p1Brinquedos, ...p2Brinquedos]) {
      if (!todosBrinquedosValidos.has(brinquedo)) {
        return { erro: 'Brinquedo inválido' };
      }
    }

    return { p1Brinquedos, p2Brinquedos, animaisConsiderados };
  }

  #estaApto(brinquedosPessoa, animalData, animaisJaAdotados) {
    if (animaisJaAdotados >= 3) {
      return false;
    }

    if (animalData.regraEspecial === 'companhia' && animaisJaAdotados === 0) {
      return false;
    }

    const brinquedosNecessarios = animalData.brinquedos;

    if (animalData.regraEspecial === 'companhia') {
      const setBrinquedosPessoa = new Set(brinquedosPessoa);
      return brinquedosNecessarios.every(b => setBrinquedosPessoa.has(b));
    }

    let indexNecessario = 0;
    for (const brinquedoDaPessoa of brinquedosPessoa) {
      if (brinquedoDaPessoa === brinquedosNecessarios[indexNecessario]) {
        indexNecessario++;
      }
      if (indexNecessario === brinquedosNecessarios.length) {
        return true;
      }
    }

    return false;
  }
}

export { AbrigoAnimais as AbrigoAnimais };