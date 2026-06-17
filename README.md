# SOFT-309-M6-2025

[![Playwright Tests](https://github.com/lsoto-cenfo/SOFT-309-M6-2025/actions/workflows/playwright.yml/badge.svg)](https://github.com/lsoto-cenfo/SOFT-309-M6-2025/actions/workflows/playwright.yml)
[![Scheduled k6 Load Test](https://github.com/lsoto-cenfo/SOFT-309-M6-2025/actions/workflows/k6-schedule.yml/badge.svg)](https://github.com/lsoto-cenfo/SOFT-309-M6-2025/actions/workflows/k6-schedule.yml)



npm run release:patch
npx playwright test --shard=1/8


shard -> 'una pieza' 

1er shard -> 8 tests
2do shards -> 8 tests 

--headless=false -> cuando estamos desarrollando los test
--headless -> cuando vamos a ejecutarlos: es mas 'barato'

