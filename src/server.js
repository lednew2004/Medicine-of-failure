import  fastify  from "fastify";
import  fastifycors  from "fastify-cors"
import { Database } from "./database.js";

const database = new Database();

const app = fastify();

app.register(fastifycors, {
    origin: "*"
});

app.post("/failure", (request, response) => {
    const { medicine} = request.body;

    const date = new Date()

    const formatPt = new Intl.DateTimeFormat("pt-br", {
    day: "2-digit",
    month:"long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
    }).format(date)


    database.insert("failures", {
        medicine, 
        failure: true,
        date: formatPt
    });

    return response.status(202).send()
});

app.get("/failure", (request, response) => {
    const { search } = request.query;

    console.log(search)

    const data = database.select("failures", search ? {
        medicine: search,
    }: null)

    return response.status(200).send(data)
});

app.put("/failure", (request, response) => {
    const { search } = request.query;
    const { medicine, failure } = request.body;

    database.update("failures", search, {
        medicine,
        failure,
        date: null
    })

    return response.status(200).send()
})


app.listen({
    port: 3030
});