require('dotenv').config();
const express = require('express');
const supabase = require('./src/config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.get('/ingressos/ativos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ingressos_eventos')
      .select('*')
      .eq('lote_ativo', true);

    if (error) {
      return res.status(500).json({ erro: 'Erro no banco de dados', detalhe: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});

app.get('/ingressos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('ingressos_eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Ingresso não foi encontrado' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha na busca do ingresso' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/ingressos/ativos`);
});