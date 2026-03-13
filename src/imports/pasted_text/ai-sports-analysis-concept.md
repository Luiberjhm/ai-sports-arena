1. Concepto del producto

Nombre conceptual: AI Sports Analysis Arena

Idea central:
Un dashboard de análisis deportivo multi-IA donde diferentes modelos generan predicciones para ligas deportivas y el sistema mide su rendimiento histórico.

IAs participantes:

OpenAI (ChatGPT)

Google (Gemini)

Anthropic (Claude)

Alibaba (Qwen)

Perplexity AI (Perplexity)

2. Deportes y ligas que tendrá la plataforma

Secciones principales:

Fútbol

La Liga

Premier League

UEFA Champions League

Serie A

Bundesliga

Ligue 1

Deportes americanos

National Football League

National Basketball Association

Major League Baseball

National Hockey League

NCAA Division I Football

Cada sección tendrá las predicciones del día o jornada.

3. Lo más importante: el prompt NO cambia cada jornada

Aquí estaba la confusión.

Debes usar un System Prompt permanente.

Solo cambian los datos dinámicos.

SYSTEM PROMPT PERMANENTE

Este no se toca nunca.

You are a professional sports analyst specialized in probabilistic prediction.

Your role is to analyze sports matchups and identify the team with the highest probability of winning in the selected league matchday.

Your analysis must consider:

• Relative team strength
• Recent form
• Tactical advantage
• Home vs away performance
• Squad depth
• Momentum trends

Rules:

1. Select ONE team with the highest probability of winning in the matchday.
2. Estimate probability between 70% and 90%.
3. Provide a concise explanation (maximum 30 words).
4. Do not invent statistics.

Output JSON:

{
"team_pick": "",
"probability": "",
"summary": ""
}
PROMPT DINÁMICO (automático)

El backend añade datos.

Ejemplo:

Sport: Football
League: Premier League
Matchday: Current matchday

Analyze the matches and identify the team with the highest probability of winning.

Esto se genera automáticamente.

El usuario solo pulsa RUN.

4. Flujo completo del sistema

Cuando el usuario presiona RUN:

User presses RUN
      ↓
Backend fetches today's matches
      ↓
System prompt + league data
      ↓
Send prompt to 5 AI models
      ↓
Store predictions in database
      ↓
Display results in dashboard
5. Arquitectura técnica que propusiste (es correcta)
Frontend

React
Vite
TypeScript
Tailwind

Diseño:

minimalista
dashboard analytics

Backend

Node.js
NestJS

Responsabilidades:

llamar APIs deportivas

llamar APIs de IA

guardar predicciones

Base de datos

Supabase
(PostgreSQL)

Guardarás:

predicciones

resultados reales

métricas de acierto

6. Modelo de base de datos recomendado
Tabla AI_MODELS
id
name
provider
logo

Ejemplo:

1 ChatGPT
2 Gemini
3 Claude
4 Qwen
5 Perplexity
Tabla LEAGUES
id
sport
league_name
Tabla MATCHES
id
league_id
home_team
away_team
date
result
Tabla PREDICTIONS
id
ai_model_id
match_id
predicted_team
probability
analysis_text
created_at
Tabla AI_PERFORMANCE
ai_model_id
total_predictions
correct_predictions
accuracy_rate
current_streak
7. Dashboard principal

La página principal debe mostrar:

AI Prediction Cards

5 tarjetas:

ChatGPT
Gemini
Claude
Perplexity
Qwen

Cada tarjeta muestra:

Team Pick
Probability
Short reasoning
Consensus Pick

Si 3 o más IAs coinciden.

Consensus Pick
Arsenal
3/5 AI models agree
Leaderboard IA

Tabla:

AI	Accuracy	Picks	Streak
Performance Heatmap

últimos 10 días

🟢 acierto
🔴 fallo

8. APIs gratuitas recomendadas

Para datos deportivos:

Football

API-FOOTBALL

Odds deportivas

The Odds API

Estadísticas deportivas

SportdataAPI

9. Páginas que tendrá la plataforma
Home

overview IA

Football

ligas europeas

NBA

predicciones

NFL

predicciones

MLB

predicciones

NHL

predicciones

NCAA

predicciones

AI Leaderboard

ranking modelos

Analytics

gráficos rendimiento

10. Prompt definitivo para Figma AI

Puedes darle algo así:

Design a sports analytics platform called "AI Sports Analysis Arena".

Purpose:
A dashboard where multiple AI models analyze sports matchups and provide predictions. The system compares their accuracy over time.

Design style:
Minimalist professional dashboard.

Pages required:

Home dashboard
Football leagues section
NBA section
NFL section
MLB section
NHL section
NCAA section
AI leaderboard
Analytics page

Main dashboard elements:

AI prediction cards
Consensus prediction panel
AI leaderboard table
Prediction history timeline
Performance heatmap
Matchday analysis panel

Design requirements:

Clean typography
Modern sports analytics style
Large cards
Subtle shadows
Dark mode interface
Responsive layout

Tech stack compatibility:

React
TailwindCSS
TypeScript
Dashboard component layout
11. Lo más importante de todo el proyecto

Tu valor real no será la predicción.

Será la comparación de IAs.

Pregunta central del producto:

¿Qué IA predice mejor el deporte?

Eso es lo que hará que tu plataforma sea interesante.