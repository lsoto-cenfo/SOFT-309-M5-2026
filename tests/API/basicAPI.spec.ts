import { test, expect } from '@playwright/test';

const BASE = 'https://dummyjson.com';

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
test.describe('Users', () => {
  test('GET /users returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/users`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.users.length).toBeGreaterThan(0);
    expect(data.users[0].firstName).toEqual('Emily');
  });

  test('GET /users/:id returns single user', async ({ request }) => {
    const res = await request.get(`${BASE}/users/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('firstName');
    expect(data).toHaveProperty('email');
  });

  test('GET /users/search?q= returns matches', async ({ request }) => {
    const res = await request.get(`${BASE}/users/search?q=Emily`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.users.length).toBeGreaterThan(0);
    expect(data.users[0].firstName.toLowerCase()).toContain('emily');
  });

  test('GET /users with limit and skip', async ({ request }) => {
    const res = await request.get(`${BASE}/users?limit=5&skip=0`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.users.length).toBeLessThanOrEqual(5);
  });

  test('GET /users/:id/posts returns user posts', async ({ request }) => {
    const res = await request.get(`${BASE}/users/1/posts`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBe(true);
  });

  test('GET /users/:id/todos returns user todos', async ({ request }) => {
    const res = await request.get(`${BASE}/users/1/todos`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('todos');
    expect(Array.isArray(data.todos)).toBe(true);
  });

  test('GET /users/:id/carts returns user carts', async ({ request }) => {
    const res = await request.get(`${BASE}/users/1/carts`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('carts');
    expect(Array.isArray(data.carts)).toBe(true);
  });

  test('POST /users/add creates user', async ({ request }) => {
    const res = await request.post(`${BASE}/users/add`, {
      data: { firstName: 'John', lastName: 'Doe', age: 30 },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.firstName).toBe('John');
  });

  test('PUT /users/:id updates user', async ({ request }) => {
    const res = await request.put(`${BASE}/users/1`, {
      data: { firstName: 'UpdatedName' },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data.firstName).toBe('UpdatedName');
  });

  test('DELETE /users/:id deletes user', async ({ request }) => {
    const res = await request.delete(`${BASE}/users/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
test.describe('Products', () => {
  test('GET /products returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/products`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
    expect(data).toHaveProperty('total');
  });

  test('GET /products/:id returns single product', async ({ request }) => {
    const res = await request.get(`${BASE}/products/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('price');
  });

  test('GET /products/search?q= returns matches', async ({ request }) => {
    const res = await request.get(`${BASE}/products/search?q=phone`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
  });

  test('GET /products/categories returns category list', async ({ request }) => {
    const res = await request.get(`${BASE}/products/categories`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('GET /products/category-list returns flat list', async ({ request }) => {
    const res = await request.get(`${BASE}/products/category-list`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(typeof data[0]).toBe('string');
  });

  test('GET /products/category/:name filters by category', async ({ request }) => {
    const res = await request.get(`${BASE}/products/category/smartphones`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((p: any) => expect(p.category).toBe('smartphones'));
  });

  test('GET /products with limit and skip', async ({ request }) => {
    const res = await request.get(`${BASE}/products?limit=5&skip=0`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeLessThanOrEqual(5);
  });

  test('GET /products with select filters fields', async ({ request }) => {
    const res = await request.get(`${BASE}/products?limit=1&select=title,price`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    const product = data.products[0];
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product).not.toHaveProperty('description');
  });

  test('GET /products sorted by price', async ({ request }) => {
    const res = await request.get(`${BASE}/products?sortBy=price&order=asc&limit=5`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    const prices = data.products.map((p: any) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('POST /products/add creates product', async ({ request }) => {
    const res = await request.post(`${BASE}/products/add`, {
      data: { title: 'Test Product', price: 99.99 },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Test Product');
  });

  test('PUT /products/:id updates product', async ({ request }) => {
    const res = await request.put(`${BASE}/products/1`, {
      data: { title: 'Updated Title' },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data.title).toBe('Updated Title');
  });

  test('DELETE /products/:id deletes product', async ({ request }) => {
    const res = await request.delete(`${BASE}/products/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Carts
// ---------------------------------------------------------------------------
test.describe('Carts', () => {
  test('GET /carts returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/carts`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.carts.length).toBeGreaterThan(0);
  });

  test('GET /carts/:id returns single cart', async ({ request }) => {
    const res = await request.get(`${BASE}/carts/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBe(true);
  });

  test('GET /carts/user/:userId returns user carts', async ({ request }) => {
    const res = await request.get(`${BASE}/carts/user/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('carts');
    expect(Array.isArray(data.carts)).toBe(true);
  });

  test('POST /carts/add creates cart', async ({ request }) => {
    const res = await request.post(`${BASE}/carts/add`, {
      data: { userId: 1, products: [{ id: 1, quantity: 2 }] },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('products');
  });

  test('PUT /carts/:id updates cart', async ({ request }) => {
    const res = await request.put(`${BASE}/carts/1`, {
      data: { products: [{ id: 2, quantity: 1 }] },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
  });

  test('DELETE /carts/:id deletes cart', async ({ request }) => {
    const res = await request.delete(`${BASE}/carts/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
test.describe('Posts', () => {
  test('GET /posts returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/posts`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.posts.length).toBeGreaterThan(0);
  });

  test('GET /posts/:id returns single post', async ({ request }) => {
    const res = await request.get(`${BASE}/posts/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
  });

  test('GET /posts/search?q= returns matches', async ({ request }) => {
    const res = await request.get(`${BASE}/posts/search?q=love`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBe(true);
  });

  test('GET /posts/user/:userId returns posts by user', async ({ request }) => {
    const res = await request.get(`${BASE}/posts/user/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.posts.length).toBeGreaterThan(0);
    data.posts.forEach((p: any) => expect(p.userId).toBe(1));
  });

  test('GET /posts/:id/comments returns post comments', async ({ request }) => {
    const res = await request.get(`${BASE}/posts/1/comments`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('comments');
    expect(Array.isArray(data.comments)).toBe(true);
  });

  test('POST /posts/add creates post', async ({ request }) => {
    const res = await request.post(`${BASE}/posts/add`, {
      data: { title: 'New Post', body: 'Post body', userId: 1 },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('New Post');
  });

  test('PUT /posts/:id updates post', async ({ request }) => {
    const res = await request.put(`${BASE}/posts/1`, {
      data: { title: 'Updated Post' },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data.title).toBe('Updated Post');
  });

  test('DELETE /posts/:id deletes post', async ({ request }) => {
    const res = await request.delete(`${BASE}/posts/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------
test.describe('Comments', () => {
  test('GET /comments returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/comments`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.comments.length).toBeGreaterThan(0);
  });

  test('GET /comments/:id returns single comment', async ({ request }) => {
    const res = await request.get(`${BASE}/comments/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('body');
    expect(data).toHaveProperty('postId');
  });

  test('GET /comments/post/:postId returns comments for post', async ({ request }) => {
    const res = await request.get(`${BASE}/comments/post/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.comments.length).toBeGreaterThan(0);
    data.comments.forEach((c: any) => expect(c.postId).toBe(1));
  });

  test('POST /comments/add creates comment', async ({ request }) => {
    const res = await request.post(`${BASE}/comments/add`, {
      data: { body: 'Great post!', postId: 1, userId: 1 },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.body).toBe('Great post!');
  });

  test('PUT /comments/:id updates comment', async ({ request }) => {
    const res = await request.put(`${BASE}/comments/1`, {
      data: { body: 'Updated comment' },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data.body).toBe('Updated comment');
  });

  test('DELETE /comments/:id deletes comment', async ({ request }) => {
    const res = await request.delete(`${BASE}/comments/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Todos
// ---------------------------------------------------------------------------
test.describe('Todos', () => {
  test('GET /todos returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/todos`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.todos.length).toBeGreaterThan(0);
  });

  test('GET /todos/:id returns single todo', async ({ request }) => {
    const res = await request.get(`${BASE}/todos/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('todo');
    expect(data).toHaveProperty('completed');
  });

  test('GET /todos/random returns a todo', async ({ request }) => {
    const res = await request.get(`${BASE}/todos/random`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('todo');
  });

  test('GET /todos with limit and skip', async ({ request }) => {
    const res = await request.get(`${BASE}/todos?limit=3&skip=0`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.todos.length).toBeLessThanOrEqual(3);
  });

  test('POST /todos/add creates todo', async ({ request }) => {
    const res = await request.post(`${BASE}/todos/add`, {
      data: { todo: 'Write tests', completed: false, userId: 1 },
    });
    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.todo).toBe('Write tests');
  });

  test('PUT /todos/:id updates todo', async ({ request }) => {
    const res = await request.put(`${BASE}/todos/1`, {
      data: { completed: true },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data.completed).toBe(true);
  });

  test('DELETE /todos/:id deletes todo', async ({ request }) => {
    const res = await request.delete(`${BASE}/todos/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------
test.describe('Quotes', () => {
  test('GET /quotes returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/quotes`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.quotes.length).toBeGreaterThan(0);
  });

  test('GET /quotes/:id returns single quote', async ({ request }) => {
    const res = await request.get(`${BASE}/quotes/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('quote');
    expect(data).toHaveProperty('author');
  });

  test('GET /quotes/random returns a quote', async ({ request }) => {
    const res = await request.get(`${BASE}/quotes/random`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('quote');
    expect(data).toHaveProperty('author');
  });

  test('GET /quotes with limit and skip', async ({ request }) => {
    const res = await request.get(`${BASE}/quotes?limit=5&skip=0`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.quotes.length).toBeLessThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------
test.describe('Recipes', () => {
  test('GET /recipes returns list', async ({ request }) => {
    const res = await request.get(`${BASE}/recipes`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.recipes.length).toBeGreaterThan(0);
  });

  test('GET /recipes/:id returns single recipe', async ({ request }) => {
    const res = await request.get(`${BASE}/recipes/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('ingredients');
  });

  test('GET /recipes/search?q= returns matches', async ({ request }) => {
    const res = await request.get(`${BASE}/recipes/search?q=chicken`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('recipes');
    expect(Array.isArray(data.recipes)).toBe(true);
  });

  test('GET /recipes/tags returns tag list', async ({ request }) => {
    const res = await request.get(`${BASE}/recipes/tags`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('GET /recipes/tag/:tag filters by tag', async ({ request }) => {
    const res = await request.get(`${BASE}/recipes/tag/Pakistani`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.recipes.length).toBeGreaterThan(0);
  });

  test('GET /recipes/meal-type/:type filters by meal type', async ({ request }) => {
    const res = await request.get(`${BASE}/recipes/meal-type/dinner`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.recipes.length).toBeGreaterThan(0);
  });

  test('POST /recipes/add creates recipe', async ({ request }) => {
    const res = await request.post(`${BASE}/recipes/add`, {
      data: { name: 'Test Recipe', ingredients: ['flour', 'eggs'], instructions: ['mix', 'bake'] },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Test Recipe');
  });

  test('PUT /recipes/:id updates recipe', async ({ request }) => {
    const res = await request.put(`${BASE}/recipes/1`, {
      data: { name: 'Updated Recipe' },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data.name).toBe('Updated Recipe');
  });

  test('DELETE /recipes/:id deletes recipe', async ({ request }) => {
    const res = await request.delete(`${BASE}/recipes/1`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('isDeleted', true);
  });
});

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
test.describe('Utility', () => {
  test('GET /test returns ok status', async ({ request }) => {
    const res = await request.get(`${BASE}/test`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('status', 'ok');
  });

  test('GET /ip returns client IP', async ({ request }) => {
    const res = await request.get(`${BASE}/ip`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('ip');
    expect(typeof data.ip).toBe('string');
  });
});
