import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // 10 users for 10s
    { duration: '10s', target: 200 }, // 20 users for next 10s
  ],
};

export default function(){
  let url = 'https://petstore.swagger.io/v2/store/order'
  let body = {
  "id": 0,
  "petId": 0,
  "quantity": 0,
  "shipDate": "2025-08-06T01:45:14.110Z",
  "status": "placed",
  "complete": true
}
 let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  let respose = http.post(url, JSON.stringify(body), { headers: headers });
  check(respose, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 300
  });
  const data = respose.json();
  console.log(data.id);
  console.log(data.status);

  let response2 = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available', { headers: headers })
  check(response2, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 300
  });
  const data2 = response2.json();
  console.log(data2[0].category.name);
  sleep(1);
}
