import { initializeApp, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Inicialização do Firebase Admin (se já não estiver inicializado)
if (!getApps().length) {
  initializeApp({
    databaseURL: "https://focoplataforms-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = getDatabase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405.json({ error: 'Método não permitido' }));
  }

  const { slug, message, imageUrl } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Slug da IA não fornecido.' });
  }

  try {
    // 1. Buscar os dados da IA pelo slug
    const aiRef = db.ref(`assistants/${slug}`);
    const aiSnapshot = await aiRef.get();

    if (!aiSnapshot.exists()) {
      return res.status(404).json({ error: 'Inteligência Artificial não encontrada.' });
    }

    const aiData = aiSnapshot.val();
    const ownerUid = aiData.ownerUid;

    if (!ownerUid) {
      return res.status(400).json({ error: 'Criador desta IA não identificado.' });
    }

    // 2. Buscar os dados do Plano e Limites do Criador no Firebase
    const userRef = db.ref(`users/${ownerUid}`);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: 'Criador da IA não encontrado na base de dados.' });
    }

    const userData = userSnapshot.val();
    const planName = userData.plan || 'Plano Base';
    const features = userData.features || {
      messagesPerDay: 10,
      imageUploadsPerDay: 0,
      tokens: 250
    };

    // 3. Controle de Uso Diário (Reset diário baseado na data UTC)
    const todayStr = new Date().toISOString().split('T')[0];
    const usageRef = db.ref(`usage/${ownerUid}/${todayStr}`);
    const usageSnapshot = await usageRef.get();
    
    let usageData = usageSnapshot.exists() ? usageSnapshot.val() : { messagesCount: 0, imageUploadsCount: 0, tokensUsed: 0 };

    // Validação de Limite de Mensagens (ex: Plano Base = 10 msgs/dia)
    const maxMessages = features.messagesPerDay || (planName === 'Plano Base' ? 10 : 1000);
    if (usageData.messagesCount >= maxMessages) {
      return res.status(403).json({ 
        error: `Esta IA atingiu o limite diário de mensagens do plano do criador (${maxMessages} msgs/dia). O serviço será restabelecido amanhã ou quando o criador fizer upgrade do plano.` 
      });
    }

    // Validação de Upload de Imagens (se enviada imagem e o plano proibir)
    if (imageUrl) {
      const maxImages = features.imageUploadsPerDay || 0;
      if (maxImages === 0 || usageData.imageUploadsCount >= maxImages) {
        return res.status(403).json({ 
          error: `O plano atual do criador não permite uploads de imagens ou o limite diário foi atingido.` 
        });
      }
      usageData.imageUploadsCount += 1;
    }

    // 4. Processar Resposta da IA (Integração com o modelo configurado)
    // Simulação de chamada de motor de IA com contagem estimada de tokens
    const estimatedTokens = Math.ceil((message.length + 50) / 4); 
    
    // Incrementa contadores
    usageData.messagesCount += 1;
    usageData.tokensUsed = (usageData.tokensUsed || 0) + estimatedTokens;

    // Atualiza os zips/dados de uso no Firebase em tempo real
    await usageRef.set(usageData);

    // Resposta de sucesso simulada do modelo de IA escolhido pela config (`aiData.model`)
    const aiReply = `Olá! Resposta gerada pelo assistente ${aiData.name} (${aiData.model}). Como posso ajudar mais?`;

    return res.status(200).json({
      success: true,
      reply: aiReply,
      usage: {
        messagesUsed: usageData.messagesCount,
        messagesLimit: maxMessages,
        tokensUsed: usageData.tokensUsed
      }
    });

  } catch (error) {
    console.error('Erro ao processar chat:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
}
