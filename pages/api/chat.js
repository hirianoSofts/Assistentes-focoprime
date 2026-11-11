import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Inicialização segura do Firebase Admin SDK na Vercel
if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: "https://focoplataforms-default-rtdb.europe-west1.firebasedatabase.app"
    });
  } else {
    // Fallback caso utilize regras abertas ou ambiente de teste
    initializeApp({
      databaseURL: "https://focoplataforms-default-rtdb.europe-west1.firebasedatabase.app"
    });
  }
}

const db = getDatabase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { slug, message, imageUrl } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Slug da IA não fornecido.' });
  }

  try {
    // 1. Buscar os dados da IA pelo slug no Firebase
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

    // 2. Buscar os dados do criador e o plano atual
    const userRef = db.ref(`users/${ownerUid}`);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: 'Criador da IA não encontrado na base de dados.' });
    }

    const userData = userSnapshot.val();
    const planName = userData.plan || 'Plano Base';
    
    // Extrai as features configuradas no plano do criador
    const features = userData.features || {
      messagesPerDay: 10,
      imageUploadsPerDay: 0,
      tokens: 250
    };

    // 3. Controle de Uso Diário (Reset baseado na data UTC atual)
    const todayStr = new Date().toISOString().split('T')[0];
    const usageRef = db.ref(`usage/${ownerUid}/${todayStr}`);
    const usageSnapshot = await usageRef.get();
    
    let usageData = usageSnapshot.exists() 
      ? usageSnapshot.val() 
      : { messagesCount: 0, imageUploadsCount: 0, tokensUsed: 0 };

    // Validação de Limite de Mensagens
    const maxMessages = features.messagesPerDay || (planName === 'Plano Base' ? 10 : (features.tokens ? Math.floor(features.tokens / 10) : 50));
    
    if (usageData.messagesCount >= maxMessages) {
      return res.status(403).json({ 
        error: `Esta IA atingiu o limite diário de mensagens do plano do criador (${maxMessages} msgs/dia). O serviço será restabelecido amanhã ou quando o criador fizer upgrade do plano.` 
      });
    }

    // Validação de Upload de Imagens
    if (imageUrl) {
      const maxImages = features.imageUploadsPerDay || 0;
      if (maxImages === 0 || usageData.imageUploadsCount >= maxImages) {
        return res.status(403).json({ 
          error: `O plano atual do criador (${planName}) não permite uploads de imagens ou o limite diário de ${maxImages} foi atingido.` 
        });
      }
      usageData.imageUploadsCount += 1;
    }

    // 4. Processamento de Tokens e Contadores
    const estimatedTokens = Math.ceil((message.length + 50) / 4);
    
    usageData.messagesCount += 1;
    usageData.tokensUsed = (usageData.tokensUsed || 0) + estimatedTokens;

    // Atualiza os dados de uso no Firebase em tempo real a cada interação
    await usageRef.set(usageData);

    // 5. Chamada real ou simulação da resposta da IA baseada no modelo configurado (`aiData.model`)
    const aiReply = `Olá! Resposta gerada pelo assistente ${aiData.name} usando o modelo ${aiData.model || 'Padrão'}.`;

    return res.status(200).json({
      success: true,
      reply: aiReply,
      usage: {
        messagesUsed: usageData.messagesCount,
        messagesLimit: maxMessages,
        tokensUsed: usageData.tokensUsed,
        imageUploadsUsed: usageData.imageUploadsCount
      }
    });

  } catch (error) {
    console.error('Erro ao processar chat:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
}
