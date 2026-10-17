# Todo List

Vite 프론트엔드와 Express 백엔드를 하나의 Vercel Services 프로젝트로 배포합니다.

## 로컬 실행

백엔드와 프론트엔드 폴더에서 각각 의존성을 설치한 뒤 실행합니다.

```powershell
cd 백엔드
npm install
npm run dev
```

```powershell
cd 리액트
npm install
npm run dev
```

## Vercel 환경 변수

- `MONGODB_URI`: MongoDB 연결 문자열
- `JWT_SECRET`: 충분히 긴 임의 문자열

프론트엔드는 같은 배포의 `/api`를 호출하며, Vercel이 요청을 Express 서비스로 전달합니다.
