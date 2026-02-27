const express = require('express')
const app = express()
const cors = require('cors'); 
app.use(cors()); 
/* Indica que todas as requisições podem receber Body em JSON. A partir
disso, o Express aplica um JSON.parse para o conteúdo recebido */
app.use(express.json())
app.get('/', function (req, res) {
 res.setHeader('Access-Control-Allow-Origin', '*')
 res.send('ZecaInfo')
})

const bcrypt = require('bcrypt');

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
            console.log("Erro na consulta");
            res.status(500).send(erro);
        } else {
            res.send(resultado.rows); // Envia a lista para o front-end [cite: 216]
        }
    });
});

// Rota protegida: apenas quem passou pela 'verificarAutenticacao' pode ver (Nível 2)
app.get("/veiculos/gestao", verificarAutenticacao, (req, res) => {
    // Esta lógica só será executada se o 'token' existir
    pool.query("SELECT * FROM veiculos", (erro, resultado) => {
        res.send(resultado.rows);
    });
});



app.delete("/agendamento/:id", verificarAutenticacao, function (req, res) {
    const id = req.params.id;
    pool.query("DELETE FROM agendamentos WHERE id = $1", [id], function (erro, resultado) {
        if (erro) return res.json(erro);
        res.json({ "status": 200, "message": "Excluído com sucesso!" });
    });
});

// Rota de Login
app.post("/login", async (req, res) => {
    const { usuario, senha } = req.body;
    
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE login = $1', [usuario]);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            // Compara a senha digitada com o hash do banco 
            const senhaValida = await bcrypt.compare(senha, user.senha);
            
            if (senhaValida) {
                // Sucesso: Aqui você deve iniciar uma sessão ou gerar um Token [cite: 704]
                res.status(200).json({ mensagem: "Login realizado!" });
            } else {
                res.status(401).json({ erro: "Usuário ou senha incorretos." }); // T2.2 
            }
        } else {
            res.status(401).json({ erro: "Usuário ou senha incorretos." });
        }
    } catch (err) {
        res.status(500).send("Erro no servidor");
    }
});

function verificarAutenticacao(req, res, next) {
    // Lógica básica: verificar se há um sinal de login (ex: cookie ou header) [cite: 704]
    const usuarioAutenticado = req.headers['authorization']; 
    
    if (!usuarioAutenticado) {
        return res.status(403).json({ erro: "Acesso negado. Faça login." }); // Redirecionamento lógico 
    }
    next();
}

// Aplicando na gestão de frota (US5)
app.get("/admin/frota", verificarAutenticacao, (req, res) => {
    // Só chega aqui se estiver logado
});

app.listen(3000)



