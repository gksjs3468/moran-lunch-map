import fs from 'fs';
import path from 'path';

export function jsonDbPlugin() {
  const dbPath = path.resolve(process.cwd(), 'data/db.json');

  // DB 읽기
  function readDb() {
    try {
      if (!fs.existsSync(dbPath)) {
        return { restaurants: [], requests: [], history: [] };
      }
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to read db.json:', err.message);
      return { restaurants: [], requests: [], history: [] };
    }
  }

  // DB 쓰기
  function writeDb(data) {
    try {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to write db.json:', err.message);
      return false;
    }
  }

  // JSON Body 파싱 헬퍼
  function parseBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  }

  function sendJson(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  }

  return {
    name: 'json-db-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // 1. GET /api/db/restaurants
        if (url === '/api/db/restaurants' && req.method === 'GET') {
          const db = readDb();
          return sendJson(res, 200, db.restaurants);
        }

        // 2. POST /api/db/restaurants (식당 추가)
        if (url === '/api/db/restaurants' && req.method === 'POST') {
          const body = await parseBody(req);
          const db = readDb();
          const newRestaurant = {
            ...body,
            id: body.id || `rest-${Date.now()}`,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          db.restaurants = [newRestaurant, ...db.restaurants];
          writeDb(db);
          return sendJson(res, 201, { success: true, restaurant: newRestaurant });
        }

        // 3. PUT /api/db/restaurants/:id (식당 수정 - 관리자)
        if (url.startsWith('/api/db/restaurants/') && req.method === 'PUT') {
          const id = url.split('/')[4];
          const body = await parseBody(req);
          const db = readDb();
          const index = db.restaurants.findIndex((r) => r.id === id);
          if (index === -1) {
            return sendJson(res, 404, { error: 'Restaurant not found' });
          }
          db.restaurants[index] = {
            ...db.restaurants[index],
            ...body,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          writeDb(db);
          return sendJson(res, 200, { success: true, restaurant: db.restaurants[index] });
        }

        // 4. DELETE /api/db/restaurants/:id (식당 삭제 - 관리자)
        if (url.startsWith('/api/db/restaurants/') && req.method === 'DELETE') {
          const id = url.split('/')[4];
          const db = readDb();
          db.restaurants = db.restaurants.filter((r) => r.id !== id);
          writeDb(db);
          return sendJson(res, 200, { success: true });
        }

        // 5. GET /api/db/requests (수정 요청 목록)
        if (url === '/api/db/requests' && req.method === 'GET') {
          const db = readDb();
          return sendJson(res, 200, db.requests || []);
        }

        // 6. POST /api/db/requests (사용자 수정 요청 접수)
        if (url === '/api/db/requests' && req.method === 'POST') {
          const body = await parseBody(req);
          const db = readDb();
          const newRequest = {
            id: `req-${Date.now()}`,
            restaurantId: body.restaurantId,
            restaurantName: body.restaurantName,
            reason: body.reason || '가격 변동 제보',
            requestedMenus: body.requestedMenus || [],
            createdAt: new Date().toISOString(),
            status: 'pending' // pending, approved, rejected
          };
          db.requests = [newRequest, ...(db.requests || [])];
          writeDb(db);
          return sendJson(res, 201, { success: true, request: newRequest });
        }

        // 7. POST /api/db/requests/:id/approve (수정 요청 승인 - 관리자)
        if (url.startsWith('/api/db/requests/') && url.endsWith('/approve') && req.method === 'POST') {
          const parts = url.split('/');
          const reqId = parts[4];
          const db = readDb();
          const request = db.requests?.find((r) => r.id === reqId);
          if (!request) {
            return sendJson(res, 404, { error: 'Request not found' });
          }

          // 해당 식당 찾아서 메뉴 업데이트
          const restIndex = db.restaurants.findIndex((r) => r.id === request.restaurantId);
          if (restIndex !== -1) {
            db.restaurants[restIndex].menus = request.requestedMenus;
            db.restaurants[restIndex].updatedAt = new Date().toISOString().split('T')[0];
          }

          request.status = 'approved';
          request.resolvedAt = new Date().toISOString();

          // 히스토리 기록
          db.history = db.history || [];
          db.history.unshift({
            id: `hist-${Date.now()}`,
            restaurantName: request.restaurantName,
            log: `[제보 승인] ${request.reason}`,
            timestamp: new Date().toISOString()
          });

          writeDb(db);
          return sendJson(res, 200, { success: true, request, updatedRestaurant: db.restaurants[restIndex] });
        }

        // 8. POST /api/db/requests/:id/reject (수정 요청 반려 - 관리자)
        if (url.startsWith('/api/db/requests/') && url.endsWith('/reject') && req.method === 'POST') {
          const parts = url.split('/');
          const reqId = parts[4];
          const db = readDb();
          const request = db.requests?.find((r) => r.id === reqId);
          if (!request) {
            return sendJson(res, 404, { error: 'Request not found' });
          }

          request.status = 'rejected';
          request.resolvedAt = new Date().toISOString();
          writeDb(db);
          return sendJson(res, 200, { success: true, request });
        }

        next();
      });
    }
  };
}
