const express = require('express')
const app = express()
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

app.listen(3000)



