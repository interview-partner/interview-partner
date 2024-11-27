#!/bin/bash

# Declare exchange
rabbitmqadmin -V openvidu -u admin -p admin1234 declare exchange name=openvidu.events type=topic durable=true

# Declare queues
rabbitmqadmin -V openvidu -u admin -p admin1234 declare queue name=openvidu.chat.events.queue durable=true
rabbitmqadmin -V openvidu -u admin -p admin1234 declare queue name=openvidu.participant.events.queue durable=true
rabbitmqadmin -V openvidu -u admin -p admin1234 declare queue name=openvidu.room.events.queue durable=true

# Bind queues to exchange
rabbitmqadmin -V openvidu -u admin -p admin1234 declare binding source=openvidu.events destination=openvidu.chat.events.queue destination_type=queue routing_key=event.chat.*
rabbitmqadmin -V openvidu -u admin -p admin1234 declare binding source=openvidu.events destination=openvidu.participant.events.queue destination_type=queue routing_key=event.participant.*
rabbitmqadmin -V openvidu -u admin -p admin1234 declare binding source=openvidu.events destination=openvidu.room.events.queue destination_type=queue routing_key=event.room.*