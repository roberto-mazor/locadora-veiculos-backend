const express = require('express')
const app = express()
const cors = require('cors'); // [cite: 343]
app.use(cors()); // [cite: 344]
/* Indica que todas as requisições podem receber Body em JSON. A partir
disso, o Express aplica um JSON.parse para o conteúdo recebido */
app.use(express.json())
app.get('/', function (req, res) {
 res.setHeader('Access-Control-Allow-Origin', '*')
 res.send('ZecaInfo')
})

const { Pool } = require('pg');

// Substitua pela sua Connection String que você copiou do Neon
const connectionString = 'postgresql://neondb_owner:npg_dXEmQ6nDRh5f@ep-weathered-lab-ac64ufw6-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
});

// Teste de conexão
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao Neon:', err);
  } else {
    console.log('Conectado ao Neon com sucesso em:', res.rows[0].now);
  }
});

app.post("/reservar", function (req, res) {
    // Pegamos os dados do corpo da requisição
    const { nome, email, categoria } = req.body;

    // Montamos o SQL de insert (Página 61 do PDF)
    const sql = 'INSERT INTO agendamentos (nome_cliente, email_cliente, categoria_interesse) VALUES ($1, $2, $3)';
    
    pool.query(sql, [nome, email, categoria], function (erro, resultado) {
        if (erro) {
            res.json(erro);
        } else {
            // Retorna o sucesso para o frontend
            res.status(201).json({ mensagem: "Reserva realizada!" });
        }
    });
});

// Read All - [GET] /veiculos [cite: 128, 129]
app.get("/veiculos", function (req, res) {
    // No PostgreSQL (Neon), o comando é o mesmo, mas o retorno fica em 'resultado.rows'
    pool.query("SELECT * FROM veiculos", function (erro, resultado) {
        if (erro) {
            console.log("Erro na consulta [cite: 205]");
            res.status(500).send(erro);
        } else {
            res.send(resultado.rows); // Envia a lista para o front-end [cite: 216]
        }
    });
});



app.delete("/agendamento/:id", function (req, res) {
    const id = req.params.id;
    pool.query("DELETE FROM agendamentos WHERE id = $1", [id], function (erro, resultado) {
        if (erro) return res.json(erro);
        res.json({ "status": 200, "message": "Excluído com sucesso!" });
    });
});

app.listen(3000)



