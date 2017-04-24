set -x
##cleanup the testing enviromnent if you run 'odin -f cluster.yaml -y' on the testing box
SRV=cashpay-api
service=$(basename `ls /etc/gods/service.$SRV*` | sed -e 's/\.god//')
god status $service

god stop $service

sleep 5
god status $service
god nuke $service
god status $service

rm -rf /home/work/bin/$SRV
rm -rf /home/work/log/$SRV
rm -rf /home/work/data/$SRV

