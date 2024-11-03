import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const failureRate = new Rate('failed_requests');
const successfulRequests = new Counter('successful_requests');
const totalRequests = new Counter('total_requests');

export const options = {
  // Test scenarios
  scenarios: {
    // Regular load test
    normal_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },  // Ramp up to 100 users
        { duration: '2m', target: 500 },  // Ramp up to 500 users
        { duration: '2m', target: 1000 }, // Peak at 1000 users
        { duration: '1m', target: 0 },    // Ramp down to 0
      ],
    },
    // Stress test
    stress_test: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '1m',
      startTime: '7m', 
    },
  },
  thresholds: {
    http_req_duration: ['p(99)<500'], // 99% of requests must complete below 500ms
    failed_requests: ['rate<0.001'],    // Error rate must be below 0.1%
  },
};

const BASE_URL = 'http://localhost:3000/api/products';

export default function () {
  totalRequests.add(1);
  
  // Test GET all products
  const getAllResponse = http.get(BASE_URL);
  check(getAllResponse, {
    'get_all_status_200': (r) => r.status === 200,
    'get_all_response_time': (r) => r.timings.duration < 500,
  }) || failureRate.add(1);

  if (getAllResponse.status === 200) {
    successfulRequests.add(1);
  }

  sleep(1);

  // Test POST new product
  const payload = JSON.stringify({
    name: `Test Product ${Date.now()}`,
    description: 'Load test product',
    price: Math.floor(Math.random() * 100) + 1,
    stock: Math.floor(Math.random() * 50)
  });

  const postResponse = http.post(BASE_URL, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  check(postResponse, {
    'post_status_201': (r) => r.status === 201,
    'post_response_time': (r) => r.timings.duration < 500,
  }) || failureRate.add(1);

  if (postResponse.status === 201) {
    successfulRequests.add(1);
  }

  sleep(1);

  // Test GET single product
  if (postResponse.status === 201) {
    const productId = JSON.parse(postResponse.body)._id;
    const getOneResponse = http.get(`${BASE_URL}/${productId}`);
    
    check(getOneResponse, {
      'get_one_status_200': (r) => r.status === 200,
      'get_one_response_time': (r) => r.timings.duration < 500,
    }) || failureRate.add(1);

    if (getOneResponse.status === 200) {
      successfulRequests.add(1);
    }
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: `
Load Test Summary:
=================
- Total Requests: ${data.metrics.total_requests.values.count}
- Successful Requests: ${data.metrics.successful_requests.values.count}
- Failed Requests: ${data.metrics.failed_requests.values.rate}
- 95th Percentile Response Time: ${data.metrics.http_req_duration.values['p(95)']}ms
    `
  };
}
