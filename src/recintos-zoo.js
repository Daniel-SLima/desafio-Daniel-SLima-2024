class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: ['savana'], tamanho: 10, ocupacaoAtual: 3, animais: ['macaco'] },
            { numero: 2, bioma: ['floresta'], tamanho: 5, ocupacaoAtual: 0, animais: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, ocupacaoAtual: 1, animais: ['gazela'] },
            { numero: 4, bioma: ['rio'], tamanho: 8, ocupacaoAtual: 0, animais: [] },
            { numero: 5, bioma: ['savana'], tamanho: 9, ocupacaoAtual: 1, animais: ['leao'] }
        ];
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    calculaOcupacaoAtualCorreta(recinto) {
        const calcularTotal = () => {
            return recinto.animais.reduce((total, nomeAnimal) => {
                const animalInfo = this.animais[nomeAnimal.toUpperCase()];
                return total + (animalInfo ? animalInfo.tamanho * recinto.ocupacaoAtual : 0);
            }, 0);
        };
        return recinto.ocupacaoAtual === 0 ? 0 : calcularTotal();
    }

    analisaRecintos(animal, quantidade) {
        const infoAnimal = this.animais[animal.toUpperCase()];
        if (!infoAnimal) {
            return { erro: "Animal inválido" };
        }
        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const verificaCarnivoros = (recinto) => {
            if (infoAnimal.carnivoro) {
                return recinto.animais.every(a => this.animais[a.toUpperCase()].carnivoro);
            }
            return true;
        };

        const verificaConfortoAnimaisPresentes = (recinto) => {
            return recinto.animais.every(animalPresente => {
                const infoAnimalPresente = this.animais[animalPresente.toUpperCase()];
                if (infoAnimalPresente === this.animais.HIPOPOTAMO && !recinto.bioma.includes('savana') && !recinto.bioma.includes('rio')) {
                    return false;
                }
                if (infoAnimalPresente === this.animais.MACACO && animal.toUpperCase() === 'MACACO' && recinto.animais.length === 1) {
                    return true;
                } else if (!infoAnimalPresente.carnivoro && animal.toUpperCase() === 'MACACO' && recinto.animais.length === 1) {
                    return true;
                }
                if (infoAnimalPresente.carnivoro && infoAnimalPresente !== infoAnimal) {
                    return false;
                }
                return true;
            });
        };

        const calculaEspacoExtra = (recinto, animal) => {
            const especiesDistintas = new Set(
                recinto.animais
                    .filter(a => typeof a === 'string')
                    .map(a => a.toLowerCase())
            );
            if (typeof animal === 'string') {
                especiesDistintas.add(animal.toLowerCase());
            }
            if (especiesDistintas.size > 1) {
                return 1;
            }
            return 0;
        };

        const recintosViaveis = this.recintos
            .filter((recinto) => {
                const espacoLivre = recinto.tamanho - (
                    recinto.ocupacaoAtual === 0
                        ? infoAnimal.tamanho * quantidade
                        : this.calculaOcupacaoAtualCorreta(recinto) +
                        infoAnimal.tamanho * quantidade + 
                        (
                            recinto.animais.length > 0 && 
                            !recinto.animais.map(a => a.toLowerCase()).includes(animal.toLowerCase()) 
                                ? 1 
                                : 0
                        )
                );
                const biomaCompativel = infoAnimal.biomas.some(bioma => recinto.bioma.includes(bioma));
                const espacoSuficiente = espacoLivre >= 0;
                const carnivoroCompativel = verificaCarnivoros(recinto);
                const confortoAnimaisPresentes = verificaConfortoAnimaisPresentes(recinto);

                return (
                    biomaCompativel &&
                    espacoSuficiente &&
                    carnivoroCompativel &&
                    confortoAnimaisPresentes
                );
            })
            .sort((a, b) => a.numero - b.numero)
            .map((recinto) => {
                const espacoLivre = recinto.ocupacaoAtual === 0
                    ? recinto.tamanho - (infoAnimal.tamanho * quantidade)
                    : recinto.tamanho - (
                        this.calculaOcupacaoAtualCorreta(recinto) +
                        infoAnimal.tamanho * quantidade + 
                        (
                            recinto.animais.length > 0 && 
                            !recinto.animais.map(a => a.toLowerCase()).includes(animal.toLowerCase()) 
                                ? 1 
                                : 0
                        )
                    );
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
            });

        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };
