export class Commands {

    // Método para obter a lista de medicamentos em falta
    async get() {
        const response = await fetch("https://medicine-of-failure.onrender.com/failure");
        const data = await response.json();

        let medicineList = "*_Lista de medicamentos em falta:_*\n\n";

        if (!data || data.length === 0) {
            return "Não há medicamentos em falta no momento.";
        }

        data.forEach(medicine => {
            if (medicine.failure) {
                medicineList += `_${medicine.medicine}_\n`;
            }
        });

        // Se não houver medicamentos com "failure: true", então informa que não há medicamentos em falta
        if (medicineList === "*_Lista de medicamentos em falta:_*\n\n") {
            return "Não há medicamentos em falta no momento.";
        }

        return medicineList;
    };

    // Método para adicionar medicamento à lista de faltas
    async post(medicine) {
        await fetch("https://medicine-of-failure.onrender.com/failure", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                medicine,
                failure: true
            })
        });
    }

    // Método para buscar um medicamento específico
    async getMedicine(medicine) {
        const response = await fetch(`https://medicine-of-failure.onrender.com/failure?search=${medicine}`);
        const data = await response.json();

        // Verifica se a resposta contém dados e se o medicamento está na falta
        if (data && data.length > 0) {
            const foundMedicine = data.find(item => item.medicine.toLowerCase() === medicine.toLowerCase());
            
            if (foundMedicine && foundMedicine.failure === true) {
                return `_O medicamento solicitado: *${medicine}* está na falta!_ \n\n _Ele foi adicionado à falta em ${foundMedicine.date}_`;
            }
        }

        return `_O medicamento solicitado: ${medicine} não está na falta!_`;
    }

    // Método para atualizar o status do medicamento (remover da falta)
    async updateMedicine(medicine) {
        await fetch(`https://medicine-of-failure.onrender.com/failure?search=${medicine}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                medicine,
                failure: false
            })
        });
    }
};
