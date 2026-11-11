import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: "https://focoplataforms-default-rtdb.europe-west1.firebasedatabase.app"
    });
  } else {
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

  const { slug, message, messages, imageUrl } = req.body;
  
  let userMessage = message;
  if (!userMessage && Array.isArray(messages) && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    userMessage = lastMsg.content;
  }

  if (!slug) {
    return res.status(400).json({ error: 'Slug da IA não fornecido.' });
  }

  if (!userMessage) {
    return res.status(400).json({ error: 'Mensagem não fornecida.' });
  }

  try {
    // 1. Buscar os dados da IA pelo slug no Firebase
    const aiRef = db.ref(`assistants/${slug}`);
    const aiSnapshot = await aiRef.get();

    if (!aiSnapshot.exists()) {
      return res.status(404).json({ error: 'Inteligência Artificial não encontrada no banco de dados.' });
    }

    const aiData = aiSnapshot.val();
    const ownerUid = aiData.ownerUid;

    if (!ownerUid) {
      return res.status(400).json({ error: 'Criador desta IA não identificado nos registros.' });
    }

    // 2. Buscar os dados do criador e o plano atual
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

    // 3. Controle de Uso Diário (Reset baseado na data UTC atual)
    const todayStr = new Date().toISOString().split('T')[0];
    const usageRef = db.ref(`usage/${ownerUid}/${todayStr}`);
    const usageSnapshot = await usageRef.get();
    
    let usageData = usageSnapshot.exists() 
      ? usageSnapshot.val() 
      : { messagesCount: 0, imageUploadsCount: 0, tokensUsed: 0 };

    const maxMessages = features.messagesPerDay || (planName === 'Plano Base' ? 10 : (features.tokens ? Math.floor(features.tokens / 10) : 50));
    
    if (usageData.messagesCount >= maxMessages) {
      return res.status(403).json({ 
        error: `Esta IA atingiu o limite diário de mensagens do plano do criador (${maxMessages} msgs/dia). O serviço será restabelecido amanhã ou quando o criador fizer upgrade do plano.` 
      });
    }

    if (imageUrl) {
      const maxImages = features.imageUploadsPerDay || 0;
      if (maxImages === 0 || usageData.imageUploadsCount >= maxImages) {
        return res.status(403).json({ 
          error: `O plano atual do criador (${planName}) não permite uploads de imagens ou o limite diário de ${maxImages} foi atingido.` 
        });
      }
      usageData.imageUploadsCount += 1;
    }

    // 4. Chamada Real da API da Groq
    const systemPrompt = aiData.systemPrompt || "Você é um assistente útil e prestativo.";
    
    // Mapeia o histórico ou usa a mensagem atual com o system prompt da IA criada
    const chatHistory = Array.isArray(messages) && messages.length > 0 
      ? messages.map(m => ({ role: m.role, content: m.content }))
      : [{ role: "user", content: userMessage }];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Modelo robusto e veloz da Groq
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory
        ],
        temperature: 0.7
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Erro na API da Groq:", errorData);
      throw new Error("Falha ao comunicar com o motor de inteligência artificial.");
    }

    const groqData = await groqResponse.json();
    const aiReply = groqData.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

    // 5. Contagem de Tokens e Atualização no Firebase
    const estimatedTokens = groqData.usage?.total_tokens || Math.ceil((userMessage.length + aiReply.length) / 4);
    
    usageData.messagesCount += 1;
    usageData.tokensUsed = (usageData.tokensUsed || 0) + estimatedTokens;

    await usageRef.set(usageData);

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
    console.error('Erro detalhado ao processar chat:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a mensagem: ' + error.message });
  }
}
