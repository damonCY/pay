echo you need to add the ip of the deploying host to /home/xbox/aesir/frigga/conf/ip.yml

HOST=${1:-127.0.0.1}

RELEASE_DIR=$(dirname `pwd`)

INSTALL_ROOT="/home/work/bin/"

SRV=cashpay-assets
CLUSTER=onebox

cat << EOF > cluster.conf
cluster:
  name: cop.xiaomi_owt.miui_pdl.cash
  version: 1914
  env: ${CLUSTER}
  jobs:
    - job.${SRV}_service.${SRV}_cluster.${CLUSTER}_pdl.cash_owt.miui_cop.xiaomi

job.${SRV}_service.${SRV}_cluster.${CLUSTER}_pdl.cash_owt.miui_cop.xiaomi:
  tag: job.${SRV}_service.${SRV}_cluster.${CLUSTER}_pdl.cash_owt.miui_cop.xiaomi
  host:
    - ${HOST}
  user: work
  version: 2a69e5ee9
  path: ${INSTALL_ROOT}/${SRV}/
  action: restart
  pkg_url: file://${RELEASE_DIR}
EOF


odin.rb -f cluster.conf -y



