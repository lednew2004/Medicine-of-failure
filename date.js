
async function request() {
    const medicine = "paracetamol"
    const respónse = await fetch(`http://localhost:3030/failure?search=${medicine}`,{
        method: "GET"
    });
    const data = await respónse.json();

    console.log(data)
}

request()