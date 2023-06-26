import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Le decimos a Vercel donde queremos ejecutar 
// este endpoint
export const runtime = 'edge'

// -> edge tiene mejor rendimiento
// y soporta streaming de datos
// no puede durar tanto la request usando la CPU
// -> requests de milisegundos

// -> default tiene peor rendimiento
// no soporta streaming de datos
// pero tiene mayor compatibilidad
// con paquetes de Node
// la request puede durar mas tiempo usando la CPU
// -> requests de segundos

// Crear el cliente de OpenAi
const config = new Configuration({
    apiKey: process.env.AI_KEY,
})
const openai = new OpenAIApi(config)

export async function POST(request) {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
            {
                role: 'system',
                content: 'Comportate como si fueras de relaciones publicas de la central nuclear atucha 2',
            },
            {
                role: 'user',
                content: 'Hola, me gustaria conocer un poco sobre energia nuclear y sobre todo sobre atucha 2',
            }
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
    })

    // transformar la respuesta de OpenAI en un text-stream
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

}