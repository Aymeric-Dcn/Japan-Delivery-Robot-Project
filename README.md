Japan Delivery Robot Project

Overview

Japan Delivery Robot Project is a collaborative robotics project developed during an engineering internship in Japan.

The objective is to build an autonomous indoor delivery robot capable of transporting small packages between predefined locations while allowing users to interact with it through a web interface.

The project combines:

* ROS 2 for robot control
* Node.js backend
* Web-based user interface
* ESP32 microcontroller for the locker system
* SQLite database for user and delivery management

⸻

Features

* User authentication
* Create and manage delivery requests
* Select pickup and destination locations
* Assign deliveries to registered users
* Real-time communication between the web interface and the robot
* ROS 2 bridge for mission exchange
* Live robot status updates through WebSockets
* Electronic locker unlocking via ESP32

⸻

                    +------------------+
                    |  Web Interface   |
                    | (HTML/CSS/JS)    |
                    +--------+---------+
                             |
                    HTTP / WebSocket
                             |
                             v
                    +------------------+
                    | Node.js Backend  |
                    | Express + SQLite |
                    +--------+---------+
                             |
                       ROS 2 Messages
                             |
                             v
                    +------------------+
                    | ROS 2 Bridge     |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | Robot Navigation |
                    +--------+---------+
                             |
                       Unlock Command
                             |
                             v
                    +------------------+
                    | ESP32 Locker     |
                    +------------------+

⸻

Technologies

* C++
* JavaScript
* Node.js
* Express
* WebSocket
* ROS 2 (Jazzy)
* SQLite
* ESP32
* HTML / CSS

⸻

Current Status

Implemented:

* Web interface
* Authentication system
* Delivery creation
* SQLite database
* ROS 2 bridge
* Bidirectional communication between Web ↔ Backend ↔ ROS
* Multi-device communication over a local network
* Real-time status feedback

Work in progress:

* Receiver interface
* Delivery state machine
* ESP32 locker control
* Robot navigation integration
* Mission queue synchronization

⸻

Authors

Developed by Aymeric Duchêne in collaboration with fellow engineering students during an internship in Japan.
