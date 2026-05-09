Link da apresentação no youtube:https://youtu.be/JYupdO0ClLQ

## API REST - Users e Tasks (Express + Prisma + SQLite)

API REST em camadas (`routes`, `controllers`, `services`, `middlewares`, `models`, `utils`) com autenticação JWT, hash de senha com bcrypt e persistência em SQLite via Prisma.

### Requisitos

- Node.js (recomendado 18+)

### Configuração

1) Instale dependências:

```powershell
cd c:\Users\felip\Desktop\Pos\backend
npm install
```

2) Crie o arquivo `.env` (ou use o já existente):

```powershell
copy .env.example .env
```

3) Rode as migrations (cria o banco):

```powershell
npx prisma migrate dev
```

### Executar API

```powershell
npm start
```

Se aparecer `EADDRINUSE` (porta ocupada), altere a porta:


```powershell
$env:PORT=4000
npm start
```

### Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /tasks`
- `POST /tasks` (auth)
- `GET /tasks/:id`
- `PUT /tasks/:id` (auth)
- `DELETE /tasks/:id` (auth)
- `POST /users/:id/tasks` (auth; só permite criar para o próprio usuário autenticado)
- `GET /health`

### Filtros e ordenação (GET /tasks)

Query params:
- `status`: `pending` | `done`
- `sort`: `title` | `createdAt`
- `order`: `asc` | `desc`
- `userId`: id do usuário

Exemplo:
- `GET /tasks?status=done&sort=title&order=asc`

---

## Testes via terminal (Windows / PowerShell)

### Observação importante sobre `curl` no PowerShell

No PowerShell, `curl` costuma ser **alias** de `Invoke-WebRequest`. Se você quiser usar curl de verdade, use **`curl.exe`**.

### 1) Health-check

```powershell
Invoke-RestMethod http://localhost:3000/health
```

### 2) Registrar usuário

```powershell
$body = @{ name = "Maria"; email = "maria@exemplo.com"; password = "secret123" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method Post -ContentType "application/json" -Body $body
```

### 3) Login (pegar token)

```powershell
$loginBody = @{ email = "maria@exemplo.com"; password = "secret123" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method Post -ContentType "application/json" -Body $loginBody
$token = $login.token
```

### 4) Criar task (autenticado)

```powershell
$headers = @{ Authorization = "Bearer $token" }
$taskBody = @{ title = "Estudar"; description = "Prisma + JWT" } | ConvertTo-Json
$task = Invoke-RestMethod -Uri http://localhost:3000/tasks -Method Post -Headers $headers -ContentType "application/json" -Body $taskBody
$task.id
```

### 5) Listar tasks com filtro/ordenação

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks?status=pending&sort=title&order=asc"
```

### 6) Atualizar task (autenticado)

```powershell
$updateBody = @{ status = "done" } | ConvertTo-Json
Invoke-RestMethod -Uri ("http://localhost:3000/tasks/" + $task.id) -Method Put -Headers $headers -ContentType "application/json" -Body $updateBody
```

### 7) Deletar task (autenticado)

```powershell
Invoke-RestMethod -Uri ("http://localhost:3000/tasks/" + $task.id) -Method Delete -Headers $headers
```

---

## Testes com curl.exe (opcional)

```bash
curl.exe -s http://localhost:3000/health
curl.exe -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Maria\",\"email\":\"maria2@exemplo.com\",\"password\":\"secret123\"}"
curl.exe -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"maria2@exemplo.com\",\"password\":\"secret123\"}"
```

