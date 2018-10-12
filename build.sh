#!/bin/bash

IMAGE="zenjirasync"
NAME="zenjirasync"
PARENT=`ip route show | grep docker0 | awk '{print \$9}'`

if [[ "$1" == "rebuild" ]]; then
  docker stop "${NAME}" && docker rm "${NAME}"
fi

if [[ "$1" == "rebuildall" ]]; then
  docker stop "${NAME}" && docker rm "${NAME}"
  docker rmi "${IMAGE}"
fi

HAS_IMAGE=`docker images | grep ${IMAGE}`
if [[ "$HAS_IMAGE" == "" ]]; then
	docker build -t ${IMAGE} .
fi

docker run \
	--name "${NAME}" \
	--add-host parent:${PARENT} \
	-ti \
	"${IMAGE}" "$2"
