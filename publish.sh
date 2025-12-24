#/bin/bash
npm run build
scp -r -p -O -P 2221 dist/apps/api/* mfortin@192.168.23.2:/volume1/docker/nx/falling-water.energy/api
scp -r -p -O -P 2221 dist/apps/backoffice/* mfortin@192.168.23.2:/volume1/docker/nx/falling-water.energy/backoffice
scp -r -p -O -P 2221 dist/apps/frontend/* mfortin@192.168.23.2:/volume1/docker/nx/falling-water.energy/frontend
