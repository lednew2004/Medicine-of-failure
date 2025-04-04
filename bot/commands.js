export class Commands {

    async get() {
        const response = await fetch("http://localhost:3030/failure");
        const data = await response.json()

        // Acumulando a lista de medicamentos em falta
        let medicineList = "*_Lista de medicamentos em falta:_*\n\n";

        // Adicionando cada medicamento à lista
        data.forEach(medicine => {
            if (medicine.failure) {
                medicineList += `_${medicine.medicine}_\n`;
            }
        });

        // Verificando se há medicamentos em falta e enviando a mensagem
        if (medicineList === "*_Lista de medicamentos em falta:_*\n\n") {
            // Caso não haja medicamentos em falta
            return "Não há medicamentos em falta no momento.";
        } else {
            // Enviando todos os medicamentos em uma única mensagem
            return medicineList;
        }
    };

    async post(medicine){
             await fetch("http://localhost:3030/failure", {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",},
                        body: JSON.stringify( { 
                            medicine,
                            failure: true
                        })
                    })


    }

    async getMedicine(medicine){
        const response = await fetch(`http://localhost:3030/failure?search=${medicine}`);
        const [data] = await response.json();

        if(medicine === data.medicine && data.failure === true){
            return `_O medicamento solicitado: *${medicine}* está na falta!_ \n\n _ele foi adicionado á falta em ${data.date}_`
        }

        return `_O medicamento solicitado: ${medicine} não ésta na falta!_`
    }

    async updateMedicine(medicine){
        const response = await fetch(`http://localhost:3030/failure?search=${medicine}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",},
            body: JSON.stringify( { 
                medicine,
                failure: false
            })
        });
    }
};