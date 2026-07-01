const rclnodejs = require("rclnodejs");

let missionPublisher = null;

async function initROS(onStatusReceived) {

    await rclnodejs.init();

    const node = new rclnodejs.Node("web_bridge");

    missionPublisher = node.createPublisher(
        "std_msgs/msg/String",
        "/mission"
    );

    node.createSubscription(
        "std_msgs/msg/String",
        "/robot_status",
        (msg) => {

            console.log("[ROS] Status:", msg.data);

            if (onStatusReceived) {
                onStatusReceived(msg.data);
            }

        }
    );

    rclnodejs.spin(node);

    console.log("ROS bridge started");
}

function publishMission(destination) {

    if (!missionPublisher) {

        console.log("ROS publisher not initialized");

        return;
    }

    missionPublisher.publish({
        data: destination
    });

    console.log("[ROS] Published:", destination);
}

module.exports = {
    initROS,
    publishMission
};